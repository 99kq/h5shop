require('./product.less');

var appFunc = require('../utils/appFunc'),
    template = require('./product.tpl.html');

var productView = {
    init: function(){
        productView.bindEvents();
        // console.log("bindEvents productView");
    },
    renderProduct: function(){
        if($$('#productView .page-content')[0]) return;

        H5Shop.showIndicator();

        var renderData = {
            avatarUrl: 'http://lorempixel.com/68/68/people/7/',
            nickName: 'H5Shop',
            points: '100'
        };

        var output = appFunc.renderTpl(template, renderData);
        $$('#productView .page[data-page="product"]').html(output);

        H5Shop.hideIndicator();
    },
    logOut: function(){
        H5Shop.confirm(i18n.product.confirm_logout,function(){
            mainView.router.loadPage('page/login.html');
            H5Shop.showTab('#ourView');
        });
    },
    bindEvents: function(){
        var bindings = [{
            element: '#productView',
            event: 'show',
            handler: productView.renderProduct
        },{
            element: '#productView',
            selector: '.logout-button',
            event: 'click',
            handler: productView.logOut
        },{
            element: '#productView',
            selector: '.update-button',
            event: 'click',
            //handler: productView.checkVersion
        }];
        appFunc.bindEvents(bindings);
    }
};

module.exports = productView;