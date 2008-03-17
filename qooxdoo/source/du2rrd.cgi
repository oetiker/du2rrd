#!/usr/sepp/bin/perl-5.8.8 -w

use strict;


# Point this to your rrdtool installation of you are
# not useing the standard setup
use lib qw( /usr/pack/rrdtool-1.2.23-mo/lib/perl );

# this is for our local libraries
use lib qw( perl );

# Point this to the location of your du2rrd data store. It seems
# perl wan't this to come only after the use-lib 
do {
 no warnings;
 $Qooxdoo::Services::du2rrd::DU2RRD_ROOT = '/var/lib/du2rrd/';
};

###########################################################
# Watch and learn. But don't modify until you understand.
###########################################################

'$Revision: 3879 $ ' =~ /Revision: (\S*)/;
my $Revision = $1;


use CGI;
use CGI::Session;
use Qooxdoo::JSONRPC;

$Qooxdoo::JSONRPC::debug=1;

my $cgi     = new CGI;

if ($cgi->param('graph') and $cgi->param('graph') =~ m|^([^/]+)$|){
    # the webif wants a graph we have prepared
    my $graph = "/tmp/du2rrd.$1.png";
    if (open (my $fh,"<$graph")){
        local $/=undef;
        my $image = <$fh>;
        unlink $graph;
        close $fh;
        # make the image expire way in the future
        print "Content-Type: image/png\n";
        print "Expires: Thu, 15 Apr 2030 20:00:00 GMT\n";
        print "Last-Modification: Thu, 15 Apr 1990 20:00:00 GMT\n";
        print "Length: ".length($image)."\n";
        print "\n";
        print $image;
    }
    else {
        die "ERROR Opening $graph: $!";
    }
}
else {
    # if its not the image, then it must be a json-rpc call. 
    my $session = new CGI::Session;
    Qooxdoo::JSONRPC::handle_request ($cgi, $session);
}
