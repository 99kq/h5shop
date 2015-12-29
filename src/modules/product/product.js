require('./product.less');

var service = require('./service'),
    appFunc = require('../utils/appFunc'),
    template = require('./product.tpl.html'),
    inputModule = require('../input/input');

var product = {
    init: function(){
        this.getList();
        this.bindEvent();
    },
    getList: function(){
        var that = this;

        service.getList(function(tl){
            that.renderList(tl);

            H5Shop.hideIndicator();

            //Unlock scroll loading status
            var ptrContent = $$('#productView').find('.pull-to-refresh-content');
            ptrContent.data('scrollLoading','unloading');
        });
    },
    refreshList: function(){

        service.refreshList(function(tl){
            // Find newest msg id in ptrContent;

            product.refreshItemTime();

            var newestId = $$('#productView').find('.product-list .card'). eq(0).data('id');

            setTimeout(function () {

                $$('#productView .refresh-click').find('i').removeClass('ios7-reloading');

                if(parseInt(newestId) === 48) {
                    product.showLoadResult(i18n.index.nothing_loaded);
                    H5Shop.pullToRefreshDone();
                    return false;
                }

                var length = tl.length;

                if(length >= 15){
                    product.renderList(tl);
                }else if(length > 0){
                    product.renderList(tl, 'prepend');
                }else{
                    product.showLoadResult(i18n.index.nothing_loaded);
                }

                H5Shop.pullToRefreshDone();

            },1500);

        });
    },
    infiniteList: function(){
        var $this = $$(this);

        H5Shop.showIndicator();
        service.infiniteList(function(tl){
            var status = $this.data('scrollLoading');
            if (status === 'loading') return;

            $this.data('scrollLoading','loading');

            var items = $this.find('.product-list .card');
            var length = items.length;
            var lastId = items.eq(length - 1).data('id');
            if(parseInt(lastId) === 24){
                H5Shop.detachInfiniteScroll($this);
                H5Shop.hideIndicator();
            }else{

                setTimeout(function(){
                    $this.data('scrollLoading','unloading');
                    product.renderList(tl, 'append');

                    H5Shop.hideIndicator();
                },1500);
            }
        });
    },
    refreshListByClick: function(){
        setTimeout(function(){
            $$('#productView .refresh-click').find('i').addClass('ios7-reloading');
        },350);

        $$('#productView .pull-to-refresh-content').scrollTop(0,300);

        H5Shop.pullToRefreshTrigger('#productView .pull-to-refresh-content');
    },
    showLoadResult: function(text){
        setTimeout(function(){
            $$('#productView .load-result').html(text).css('opacity','1').transition(1000);

            setTimeout(function(){
                $$('#productView .load-result').css('opacity','0').transition(1000);
            },2100);
        },400);
    },
    refreshItemTime:function(){
        $$('#productView').find('.card .ks-facebook-date').each(function(){
            var nowTime = appFunc.timeFormat($$(this).data('time'));
            $$(this).html(nowTime);
        });
    },
    photoBrowser: function(){

        var url = $$(this).attr('src');

        var myPhotoBrowser = H5Shop.photoBrowser({
            photos: [url],
            toolbar: false,
            backLinkText: i18n.global.close
        });

        myPhotoBrowser.open();

    },
    renderList: function(tl, type){
        var renderData = {
            list: tl,
            finalText: function(){
                return appFunc.matchUrl(this.text);
            },
            time: function(){
                return appFunc.timeFormat(this.created_at);
            }
        };
        var output = appFunc.renderTpl(template, renderData);
        if(type === 'prepend'){
            $$('#productView').find('.product-list').prepend(output);
        }else if(type === 'append') {
            $$('#productView').find('.product-list').append(output);
        }else {
            $$('#productView').find('.product-list').html(output);
        }
    },
    openItemPage: function(e){
        if(e.target.nodeName === 'A' || e.target.nodeName === 'IMG'){
            return false;
        }
        var itemId = $$(this).data('id');
        productF7View.router.loadPage('page/tweet.html?id=' + itemId);
    },
    bindEvent: function(){

        var bindings = [{
            element: '#productView',
            selector: '.pull-to-refresh-content',
            event: 'refresh',
            handler: this.refreshList
        },{
            element: '#productView',
            selector: '.pull-to-refresh-content',
            event: 'infinite',
            handler: this.infiniteList
        },{
            element: '#productView',
            selector: '.refresh-click',
            event: 'click',
            handler: this.refreshListByClick
        },{
            element: '#productView',
            selector: 'a.open-send-popup',
            event: 'click',
            handler: inputModule.openSendPopup
        },{
            element: '#productView',
            selector: '.product-list .ks-facebook-card',
            event: 'click',
            handler: this.openItemPage
        },{
            element: '#productView',
            selector:'div.card-content .item-image>img',
            event: 'click',
            handler: this.photoBrowser
        }];

        appFunc.bindEvents(bindings);
    }
};

module.exports = product;