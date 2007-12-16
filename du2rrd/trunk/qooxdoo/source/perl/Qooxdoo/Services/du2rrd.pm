package Qooxdoo::Services::du2rrd;
use strict;
use warnings;
use lib qw(/usr/pack/rrdtool-1.2.23-mo/lib/perl);
use RRDs;
use Storable qw(retrieve);
use Data::Dumper;

my $root = '/scratch/du2rrd/';

sub GetAccessibility {
        return "public";
}


sub reparse_tree {
    my $tree = shift;
    my $path = shift;
    my @folders;
    for my $node ( sort { $tree->{$b}{'/size'} <=> $tree->{$a}{'/size'} } grep {$_ !~ m|^/|} keys %$tree ){
        my @subkeys = grep {$_ !~ m|^/|} keys %{$tree->{$node}};
        my $nodepath = $path.'/'.$node;
        if ($#subkeys > 0){
            push @folders, [ $node, $tree->{$node}{'/size'},$nodepath, reparse_tree($tree->{$node},$nodepath) ];
        } 
        else {
            push @folders, $node, $tree->{$node}{'/size'}, $nodepath;
        }
    }
    return @folders;
}

sub method_get_tree
{
    my $error = shift;
    my $param = shift;
    my $tree = eval{ retrieve($root.'status.storable') };
    if ($@){
        $error->set_error(101,$@);
        return $error;
    };
    return [reparse_tree($tree,'')];
}

sub clean_path {
    my $path = shift;
    if ( $path =~ m|/\.\./|){
        return undef;
    }
    $path =~ s|^/||;       
    return $path;
}

sub get_end {
    shift =~ m|([^/]+)$|;
    return $1;
}

sub method_prepare_graph {
    my $error = shift;
    my $p = shift;

    my $tree = eval{ retrieve($root.'status.storable') };
    if ($@){
        $error->set_error(104,$@);
        return $error;
    };

    my $handle = sprintf("X%06.0fY%06.0fZ",rand(1e6),$$);

    my $prime_ds = clean_path(shift @{$p->{data}});
    my @path = split /\//, $prime_ds;
    my $base = $tree->{$path[0]};
    my $title = (shift @path);
    for (@path){
        warn "$_\n";
        if ($base->{'/label'} ne $title){
           $title .= '  '.$base->{'/label'}.': '.$_;
        }
        $base=$base->{$_}        
    };
    my @graph =
        ("/tmp/du2rrd.$handle.png",
         '--title'           => $title,
         '--vertical-label'  => "file space in use",
         '--start'           => $p->{start},
         '--end'             => $p->{end},
         '--width'           => $p->{width}-100,
         '--height'          => $p->{height}-120,
         '--lower-limit'     => 0,
         '--color'           => 'BACK#ffffff00',
         '--color'           => 'SHADEA#ffffff00',
         '--color'           => 'SHADEB#ffffff00',
         '--base'            => '1024',
         "DEF:prime=${root}/${prime_ds}.rrd:diskusage:AVERAGE",
         "AREA:prime#999999:Total Diskusage ".get_end($prime_ds)."\\:\\g",
         "VDEF:pavg=prime,AVERAGE",
         "GPRINT:pavg: %.0lf %sByte\\l",
         );

    my $stack = '';
    my @col = qw(004586 ffb40e 35a826 e52f6f afddff ff7011 006124 ffde5e 98003e 0084d1 ffb3d6);
    my $i = 0;
    for my $ds (@{$p->{data}}) {
        $ds = clean_path($ds);
        $i++;        
        my $color = shift @col;
        push @col, $color;
        push @graph,
            (
             "DEF:c$i=${root}/${ds}.rrd:diskusage:AVERAGE",
             "AREA:c$i#${color}:".get_end($ds).$stack,
#            "VDEF:v$i=c$i,AVERAGE",
#            "GPRINT:v$i: %.0lf %sByte",
             );
        $stack = ':STACK';
    }
    my $date = ''.localtime(time);
    $date =~ s/:/\\:/g;
    push @graph, (
        'COMMENT:\l',
        "COMMENT:$date\\r"       
    );
    RRDs::graph(@graph);
    if (my $ERROR = RRDs::error) {
        $error->set_error(102,$ERROR);
        return $error;
    };

    return {handle => $handle};
}
1;

# Emacs Configuration
#
# Local Variables:
# mode: cperl
# eval: (cperl-set-style "PerlStyle")
# mode: flyspell
# mode: flyspell-prog
# End:
#
# vi: sw=4 et
