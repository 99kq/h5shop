var xhr = require('../utils/xhr');

module.exports = {
    getList: function(callback){
        xhr.simpleCall({
            func:'product'
        },function(res){
            callback(res.data);
        });
    },
    refreshList: function(callback){
        xhr.simpleCall({
            func:'refresh_timeline'
        },function(res){
            callback(res.data);
        });
    },
    infiniteList: function(callback){
        xhr.simpleCall({
            func:'more_timeline'
        },function(res){
            callback(res.data);
        });
    }
};