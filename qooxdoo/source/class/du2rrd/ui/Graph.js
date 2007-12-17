/* ************************************************************************
#module(du2rrd)
************************************************************************ */

/**
 * a widget showing the smokeping graph overview
 */

var  du2rrd_ui_Graph_default_width = null;
var  du2rrd_ui_Graph_default_height = null;

qx.Class.define('du2rrd.ui.Graph', 
{
    extend: qx.ui.layout.BoxLayout,        

    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * @param object  {GraphShadow}   What happens when the SNCF conductors tamazing.
     *
     */

    construct: function (rpc,element,task,start) {    
        this.base(arguments);
        this.set({
            rpc: rpc,
            sizeElement: element,
            task: task,
            width: 'auto',
            height: 'auto',
            horizontalChildrenAlign: 'center',
            verticalChildrenAlign: 'middle'
        });

        if (start != null){
            this.setStart(start)
        }

        this._loader = new du2rrd.ui.LoadingAnimation();
        var self=this;
        this._prepare_graph = function(data,exc,id){
            if (exc == null){
                self._preloader = qx.io.image.PreloaderManager.getInstance().create(self.getRpc().getBaseUrl()+'du2rrd.cgi?graph='+data['handle']);
                if (self._preloader.isLoaded()){
                    qx.client.Timer.once(self._image_loader,self,0);
                }
                else {
                    self._preloader.addEventListener('load',  self._image_loader, self);
                    self._preloader.addEventListener('error', self._image_error,  self);
                } 
            }           
            else {
                alert(exc);
            }
        },

        this.redraw();
    },

    properties: {
        rpc:   { check: "du2rrd.io.Rpc", nullable: false  },
        sizeElement:    { check: "Element" },
        task:  { check: "Array"   },
        start: { check: "Integer", init: Math.round((new Date()).getTime()/1000)-(3600*24*180) },
        end:   { check: "Integer", init: Math.round((new Date()).getTime()/1000) }
    },

    members: {
        _image_loader: function(e) {                    
            var image = new qx.ui.basic.Image();
            image.setPreloader(this._preloader);
            qx.io.image.PreloaderManager.getInstance().remove(this._preloader);
            with(this){
                removeAll();
                add(image);
//              addEventListener('click',this._open_navigator,this);
//              _unhighlight();
            }
        },

        _image_error: function(e) {                 
            qx.io.image.PreloaderManager.getInstance().remove(this._preloader);
            with(this){
                removeAll();
                add(new qx.ui.basic.Atom(this.tr("Loading Graph failed. Try again!")));
            }
        },

        redraw: function (){
            var width = qx.html.Dimension.getBoxWidth(this.getSizeElement());
            var height = qx.html.Dimension.getBoxHeight(this.getSizeElement());
            this.removeAll();
            this.add(this._loader);
            this.getRpc().callAsync(this._prepare_graph,'prepare_graph',{
                start: this.getStart(),
                end: this.getEnd(),
                width: width,
                height: height,
                data: this.getTask()
            });
        }

    }
    

});
 
 
