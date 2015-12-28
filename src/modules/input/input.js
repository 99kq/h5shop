require('./input.less');

var appFunc = require('../utils/appFunc'),
    template = require('./input.tpl.html'),
    camera = require('../components/camera'),
    geo = require('../components/geolocation');

var inputModule = {
    openSendPopup: function(){

        var output = appFunc.renderTpl(template, {
            send_placeholder: i18n.index.send_placeholder
        });
        H5Shop.popup(output);

        var bindings = [{
            element: '#sendWeiboBtn',
            event: 'click',
            handler: inputModule.postMessage
        },{
            element: 'div.message-tools .get-position',
            event: 'click',
           handler: geo.catchGeoInfo
        },{
            element: '#geoInfo',
            event: 'click',
            handler: geo.cleanGeo
        },{
            element: 'div.message-tools .image-upload',
            event: 'click',
            handler: camera.getPicture
        }];

        appFunc.bindEvents(bindings);
    },
    postMessage: function(){
        var text = $$('#messageText').val();

        if(appFunc.getCharLength(text) < 4){
            H5Shop.alert(i18n.index.err_text_too_short);
            return;
        }

        var imgSrc = $$('#uploadPicPreview>img').attr('src');

        if(imgSrc !== 'http://placeholder'){
            if(appFunc.isPhonegap()) {
                camera.startUpload(imgSrc);
            }
        }else {
            H5Shop.showPreloader(i18n.index.sending);

            setTimeout(function () {
                H5Shop.hidePreloader();
                H5Shop.closeModal('.send-popup');
                //Refresh Timeline
            }, 1300);
        }
    }
};

module.exports = inputModule;