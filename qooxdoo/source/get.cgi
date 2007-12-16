#!/usr/bin/perl -w

require 5.008;
use strict;
use Getopt::Long 2.25 qw(:config posix_default no_ignore_case);
use Pod::Usage 1.14;
#use CGI::Fast;
use CGI;

'$Revision: 3879 $ ' =~ /Revision: (\S*)/;
my $Revision = $1;

# main loop
sub main()
{
# while (my $q = new CGI::Fast) {
    my $q = new CGI;
    if ($q->param('graph') =~ m|^([^/]+)$|){
        my $graph = "/tmp/du2rrd.$1.png";
       	if (open (my $fh,"<$graph")){
    	    local $/=undef;
            my $image = <$fh>;
            unlink $graph;
    	    close $fh;
            print "Content-Type: image/png\n";
            print "Expires: Thu, 15 Apr 2010 20:00:00 GMT\n";
    	    print "Length: ".length($image)."\n";
            print "\n";
    	    print $image;

        }
        else {
            die "ERROR Opening $graph: $!";
        }
    }
#}
};

main;

__END__

=head1 NAME

get.cgi - Ship the a graph out to the qooxdoo app

=head1 SYNOPSIS

B<get.cgi>

=head1 DESCRIPTION

Ship a graph out to the client,  delete it and make is so that the client caches the graph.

=head1 COPYRIGHT

Copyright (c) 2007 by OETIKER+PARTNER AG. All rights reserved.

=head1 LICENSE

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.

=head1 AUTHOR

S<Tobi Oetiker E<lt>tobi@oetiker.chE<gt>>

=head1 HISTORY

 2007-12-09 to Initial Version

=cut

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
