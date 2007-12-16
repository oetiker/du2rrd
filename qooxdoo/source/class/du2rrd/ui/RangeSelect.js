/* ************************************************************************
#module(du2rrd)
************************************************************************ */

qx.Class.define('du2rrd.ui.RangeSelect', 
{
    extend: qx.ui.form.ComboBox,        

    construct: function () {
        this.base(arguments);

        this.set({
                width: '100%'
        });

        var list = [
            [this.tr("graph 1 month back"),this._backdays(31)],
            [this.tr("graph 3 months back"),this._backdays(3*31)],
            [this.tr("graph 1 year back"),this._backdays(366)],
            [this.tr("graph 3 years back"),this._backdays(3*366)],
            [this.tr("graph 5 years back"),this._backdays(5*366)],
            [this.tr("graph 10 years back"),this._backdays(10*366)]
        ];

        for (var i=0;i<list.length;i++){
            this.add(new qx.ui.form.ListItem(list[i][0],null,list[i][1].toString()));
        };        

        return this;
    },

    members: {
        _backdays: function(days){
            return Math.round((new Date()).getTime()/1000)-(3600*24*days)
        },
        getStart: function(){
            this.getSelected().getValue();
        }
    }
    

});
 
 
