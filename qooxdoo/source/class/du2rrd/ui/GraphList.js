/* ************************************************************************
#module(du2rrd)
************************************************************************ */

/**
 * a widget showing the smokeping graph overview
 */

qx.Class.define('du2rrd.ui.GraphList', 
{
    extend: qx.ui.layout.BoxLayout,        

    construct: function (rpc) {

        this.base(arguments);
        this.set({
                overflow: 'hidden',
                backgroundColor: '#f0f0f0',
                border: new qx.ui.core.Border(1,'solid','#a0a0a0'),
                width: '100%',
                height: '100%',
                horizontalChildrenAlign: 'center',
                verticalChildrenAlign: 'middle'
        });
        this._rpc = rpc;        
        qx.event.message.Bus.subscribe('du2rrd.graph.select',this._load_graph,this);        
    },

    members: {
        _load_graph: function(msg){
            var data = msg.getData()
            this.removeAll();
            var element = this.getElement();
            this._graph = new du2rrd.ui.Graph(
                this._rpc,
                element,
                data,
                this._start
            );
            this.add(this._graph);
        },
        set_start: function(e){
            this._start = parseInt(e.getValue().getValue());
            if (this._graph != null) {
                this._graph.setStart(this._start);
                this._graph.redraw();
            }
        },
        redraw_graph: function(){
            if (this._graph != null) {
                this._graph.redraw();
            }
        }
    }
    

});
 
 
