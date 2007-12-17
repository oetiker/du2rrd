/* ************************************************************************
#module(du2rrd)
************************************************************************ */

/**
 * a widget showing the smokeping target tree
 */

qx.Class.define('du2rrd.ui.TargetTree', 
{
    extend: qx.ui.treevirtual.TreeVirtual,        

    include: qx.ui.treevirtual.MNode,

    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * @param root_node  {String}   Name of the root node
     *                              where will we find our RPC server.
     *
     * @param rpc        {rpcObject}  An rpc object providing access to the du2rrd service
     */

    construct: function (rpc) {
        var columns = [
            this.tr("Directory"),
            this.tr("Size MB"),
            this.tr("S")
        ];

        with(this){        
            base(arguments,columns);
            set({
                border: new qx.ui.core.Border(1,'solid','#a0a0a0'),
                width: '100%', 
                height: '1*',
                backgroundColor: '#f0f0f0',
                excludeFirstLevelTreeLines: true
//              openCloseClickSelectsRow: true,
//              focusCellOnMouseMove: true
            });
//            setCellFocusAttributes({
//                opacity: 1,
//                backgroundColor: 'transparent'
//            });
            //getManager().addEventListener('changeSelection', this._send_event,this)
            setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
            var tcm = getTableColumnModel();
            var colbehaviour = tcm.getBehavior();
            colbehaviour.set(0, { width:'1*'});                            
            colbehaviour.set(1, { width:50});                            
            colbehaviour.set(2, { width:20});                            
            tcm.setDataCellRenderer(2,new qx.ui.table.cellrenderer.Boolean());
            addEventListener('cellClick',this._toggle,this);
            addEventListener('cellDblclick',this._send_event,this);
        };
        var self = this;
        var fill_tree = function(data,exc,id){
            if (exc == null){
                var nodes = data.length;
                var model = self.getDataModel();
                model.data = { application: { _path: [], _nodemap: [] }};
                for(var i=0;i<nodes;i++){
                    du2rrd.ui.TargetTree._add_data(model,null,data[i],false);
                }
                model.setData();
            }   
            else {
                alert(exc);
            }
        };

//        this._hist = qx.client.History.getInstance();
//        this._hist.addEventListener('request', this._goto_history,this);

        rpc.callAsync(fill_tree,'get_tree');
    },

    /*
    *****************************************************************************
     Statics
    *****************************************************************************
    */

    statics :
    {

                /*
        ---------------------------------------------------------------------------
        CORE METHODS
        ---------------------------------------------------------------------------
        */

        /**
         * Create the tree based on input from the Server
         *
         * @type member
                 *
         * @param {void}
         *
                 * @return BaseUrl {Strings}
                 */


        _add_data: function(model,parent,data,active){
                        // in data[0] we have the id of the folder
            var branch = model.addBranch(parent,data[0],false);
            model.data.application._path[branch] = data[2];
            model.data.application._nodemap[data[2]] = branch;
            model.setColumnData(branch,1,Math.round(data[1]/1024/1024));            
            model.setColumnData(branch,2,active);            
            var total = data[1];
            //var files = new Array();
            var length = data.length;
            var sum = 0;
            for (var i=3;i<length;i++){                
                if(qx.util.Validation.isValidArray(data[i])){
                    sum += data[i][1];
                    du2rrd.ui.TargetTree._add_data(model,branch,data[i],(sum < total * 0.8 || i < 3*6));
                }
                else {
                    var leaf = model.addLeaf(branch,data[i]);
                    model.data.application._path[leaf] = data[i+2];
                    model.data.application._nodemap[data[i+2]] = leaf;
                    sum += data[i+1];            
                    model.setColumnData(leaf,1,Math.round(data[i+1]/1024/1024));        
                    model.setColumnData(leaf,2,(sum < total * 0.8 || i < 3*6));                                    
                    i += 2;
                    //files.push(data[i-1]);
                    //folder.add(file);
                }
            }                       
           //folder.setUserData('ids',files);

        }     
    },
    members: {
        _toggle: function(e) {
            var col = e.getColumn();
            var model = this.getDataModel();
            var node = model.getValue(0,e.getRow());
            if (col == 2){
                node.columnData[2]=node.columnData[2] ? false : true;
                model.setData();
            }                
        },
//        _goto_history: function(e){
//           var target = unescape(e.getData());
//            var model = this.getDataModel();
//            var selmod = this.getSelectionModel();
//            selmod.clearSelection();
//            var map =  model.data.application._nodemap;
//            var idx = model.getColumnIndexById(map[target]);
//           this.debug(target + ' -> ' + map[target] + ',' + idx);
//            selmod.setSelectionInterval(idx,idx);
//        },
        _send_event: function(e) {
            var col = e.getColumn();
            var model = this.getDataModel();
            var node = model.getValue(0,e.getRow());
            var path = model.data.application._path;
            var graphs = [];
            graphs.push(path[node.nodeId]);
//          var hist = qx.client.History.getInstance();    
//          hist.addToHistory(path[node.nodeId],'du2rrd - '+ path[node.nodeId]); 
            var kidcount = node.children.length;
            for (var i=0;i<kidcount;i++){
                var kid = node.children[i];
                var kid_node = this.nodeGet(kid);
                if (kid_node.columnData[2]){ 
                    graphs.push(path[kid]);
                }
            }
            qx.event.message.Bus.dispatch('du2rrd.graph.select',graphs);
        }
    }   
});
