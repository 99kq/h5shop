require('./product.less');

var service = require('./service'),
    appFunc = require('../utils/appFunc'),
    template = require('./product.tpl.html'),
    inputModule = require('../input/input');

var productView = {
    init: function(){
        console.log("can show?");
        productView.getProductList();
        productView.bindEvents();

    },
    getProductList: function(){
        H5Shop.showIndicator();
        service.getList(function(tl){
            
            console.log(tl);
            productView.renderProductList(tl);

            H5Shop.hideIndicator();

            //Unlock scroll loading status
            var ptrContent = $$('#productView').find('.pull-to-refresh-content');
            ptrContent.data('scrollLoading','unloading');
        });
    },
    renderProductList: function(tl, type){
        var renderData = {
            product: tl,
            finalText: function(){
                return appFunc.matchUrl(this.text);
            },
            time: function(){
                return appFunc.timeFormat(this.created_at);
            }
        };
        var output = appFunc.renderTpl(template, renderData);
        console.log("render list.");
        if(type === 'prepend'){
            $$('#productView').find('.product-list').prepend(output);
        }else if(type === 'append') {
            $$('#productView').find('.product-list').append(output);
        }else {
            $$('#productView').find('.product-list').html(output);
        }
    },
    bindEvents: function(){
        var bindings = [
        // {
        //     element: '#productView',
        //     event: 'show',
        //     handler: productView.getProductList
        // },
        {
            element: '#productView',
            selector: '.update-button',
            event: 'click',
            handler: productView.checkVersion
        }];
        appFunc.bindEvents(bindings);
    }
};

module.exports = productView;