#!/bin/sh
V=0.0.3
set -x 
root=du2rrd-$V
mv qooxdoo/build qooxdoo/build.offline
for d in htdocs bin man/man1 doc; do
        mkdir -p $root/$d
done
ln -s ../$root/htdocs qooxdoo/build
(cd qooxdoo; make build)
rm qooxdoo/build
mv qooxdoo/build.offline qooxdoo/build
cp du2rrd $root/bin
cp example-crontab $root/doc
cd $root
pod2man --release=${V} --center=du2rrd bin/du2rrd > man/man1/du2rrd.1
GROFF_NO_SGR=1 /usr/bin/nroff -man -Tlp man/man1/du2rrd.1 > doc/du2rrd.txt
svn export svn://oss.oetiker.ch/optools/du2rrd/trunk/qooxdoo src
perl -i -p -e 's/VERSION/'$V'/' htdocs/script/du2rrd.js
cd ..
cp CHANGES $root
tar zcvf $root.tar.gz $root
rm -rf $root
scp CHANGES $root.tar.gz oposs@james:public_html/optools/pub/du2rrd/
