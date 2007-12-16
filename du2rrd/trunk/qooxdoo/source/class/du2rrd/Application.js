/* ************************************************************************

#module(du2rrd)
#resource(du2rrd.image:image)
#embed(du2rrd.image/*)
#embed(qx.icontheme/22/apps/accessories-tip.png)
************************************************************************ */

qx.Class.define('du2rrd.Application', 
{
    extend: qx.application.Gui,
       
    members: 
    {           
        main: function()
        {
            this.base(arguments);
	        qx.io.Alias.getInstance().add(
    	       'DR', qx.core.Setting.get('du2rrd.resourceUri')
        	);

  			// this will provide access to the server side of this app
    		var rpc = new du2rrd.io.Rpc('http://johan.oetiker.ch/~oetiker/du2rrd/');
            
            var prime = new qx.ui.layout.VerticalBoxLayout();

            with(prime){
                setPadding(8);
                setLocation(0,0);
                setWidth('100%');
                setHeight('100%');
                setSpacing(2);
            };            
            prime.addToDocument();

			var title = new qx.ui.basic.Atom(this.tr('du2rrd - Long Term Disk Space Monitoring'));
			title.set({
            	textColor: '#a0a0a0',
            	font: qx.ui.core.Font.fromString('16px bold sans-serif'),
                paddingBottom: 4
			});

			prime.add(title);

		    var splitpane = new qx.ui.splitpane.HorizontalSplitPane(300, '1*');
		    splitpane.setEdge(0);
			splitpane.setHeight('1*');
		    splitpane.setShowKnob(true);
  		    prime.add(splitpane);

            var vbox = new qx.ui.layout.VerticalBoxLayout();
            with(vbox){
                setLocation(0,0);
                setWidth('100%');
                setHeight('100%');
                setSpacing(3);
            };
            var combo = new du2rrd.ui.RangeSelect();
            vbox.add(combo);
 		    var tree = new du2rrd.ui.TargetTree(rpc);
            var tt = new qx.ui.popup.ToolTip(this.tr("Double-Click to draw a graph.<br/>Use Checkboxes to add items to the graph."),'icon/22/apps/accessories-tip.png');
            tt.set({ hideInterval: 20000, showInterval: 100});
            tree.setToolTip(tt);

            vbox.add(tree);
	        splitpane.addLeft(vbox);
            
			var graphlist = new du2rrd.ui.GraphList(rpc);
			splitpane.addRight(graphlist);
            var logo_box = new qx.ui.layout.HorizontalBoxLayout();
            logo_box.setHorizontalChildrenAlign('right');
            logo_box.setHeight('auto');
            var logo = new qx.ui.form.Button('Created by OETIKER+PARTNER AG');
            logo.set({
                textColor: '#b0b0b0',
                font: qx.ui.core.Font.fromString('8px sans-serif'),
                border: null,
                padding: 1
            });
            
            logo.addEventListener('execute', function(e){
                var w = new qx.client.NativeWindow('http://oetiker.ch');
                w.set({
                    width: 950,
                    height: 700
                })
                w.open()
            });
            logo_box.add(logo);
            prime.add(logo_box);

            combo.addEventListener('changeSelected', graphlist.set_start,graphlist);
            qx.ui.core.ClientDocument.getInstance().addEventListener('windowresize', graphlist.redraw_graph,graphlist);
            splitpane.getSecondArea().addEventListener("changeWidth", function(){qx.client.Timer.once(this.redraw_graph,this)},graphlist);            
            combo.setSelected(combo.getList().getFirstChild()); // trigger the event and set default
        },
        
        close : function(e)
        {
            this.base(arguments);
            // return "du2rrd Web UI: "
            //      + "Do you really want to close the application?";
        },
        
			
		terminate : function(e) {
			this.base(arguments);
		}

        /********************************************************************
         * Functional Block Methods
         ********************************************************************/

    },
		



    /*
    *****************************************************************************
    SETTINGS
    *****************************************************************************
    */

    settings : {
			'du2rrd.resourceUri' : './resource'
	}
});
 
