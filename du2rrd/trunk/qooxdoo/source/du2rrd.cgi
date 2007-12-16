#!/usr/bin/perl -w

# Point this to the location of your du2rrd data store

my $Qooxdoo::Services::du2rrd::DU2RRD_ROOT = '/var/lib/du2rrd';

###########################################################
# Watch and learn. But don't modify until you understand.
###########################################################

use strict;
use lib qw( perl );

'$Revision: 3879 $ ' =~ /Revision: (\S*)/;
my $Revision = $1;

use CGI;
use CGI::Session;
use Qooxdoo::JSONRPC;

$Qooxdoo::JSONRPC::debug=1;


my $cgi     = new CGI;

if ($cgi->param('graph') =~ m|^([^/]+)$|){
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
}
else {
   my $session = new CGI::Session;
   Qooxdoo::JSONRPC::handle_request ($cgi, $session);
}
