var appFunc = require('../utils/appFunc'),
    service = require('./service'),
    template = require('./comment.tpl.html'),
    popupTpl = require('./commentPopup.tpl.html');

var commentModule = {
    init: function(){
        this.getComments();
    },
    getComments: function(){
        service.getComments(function(c){
            var random = Math.floor(Math.random()*2);
            if(!random) c = null;

            setTimeout(function(){
                var renderData = {
                    comments: c,
                    rtime: function(){
                        return appFunc.timeFormat(this.time);
                    }
                };
                var output = appFunc.renderTpl(template, renderData);
                $$('#commentContent').html(output);
            },1500);
        });
    },
    commentPopup: function(params){
        var renderData = {
            comment: i18n.timeline.comment
        };

        if(params.name){
            renderData.title = i18n.comment.reply_comment;
            renderData.placeholder = i18n.comment.reply + '@' + params.name + ':';
        }else {
            renderData.title = i18n.timeline.comment;
            renderData.placeholder = i18n.comment.placeholder;
        }

        var output = appFunc.renderTpl(popupTpl, renderData);
        H5Shop.popup(output);

        var bindings = [{
            element:'#commentBtn',
            event: 'click',
            handler: commentModule.sendComment
        }];

        appFunc.bindEvents(bindings);
    },
    sendComment: function(){
        var text = $$('#commentText').val();

        if(appFunc.getCharLength(text) < 4){
            H5Shop.alert(i18n.index.err_text_too_short);
            return false;
        }

        H5Shop.showPreloader(i18n.comment.commenting);

        setTimeout(function(){
            H5Shop.hidePreloader();
            H5Shop.closeModal('.comment-popup');

            //Refresh comment content
        },1500);
    },
    createActionSheet: function(){
        var replyName = $$(this).find('.comment-detail .name').html();
        var buttons1 = [
            {
                text: i18n.comment.reply_comment,
                bold: true,
                onClick:function(){
                    commentModule.commentPopup({name:replyName});
                }
            },
            {
                text: i18n.comment.copy_comment ,
                bold: true
            }
        ];
        var buttons2 = [
            {
                text: i18n.global.cancel,
                color: 'red'
            }
        ];

        var groups = [buttons1, buttons2];
        H5Shop.actions(groups);
    }
};

module.exports = commentModule;