require('./contacts.less');

var appFunc = require('../utils/appFunc'),
    service = require('./service'),
    template = require('./contacts.tpl.html');

var contacts = {
    init: function(){
        contacts.bindEvents();
    },
    loadContacts: function(){
        if(contacts.beforeLoadContacts()) {
            H5Shop.searchbar('#contactView .searchbar',{
                searchList: '.contacts-list',
                searchIn: '.item-title'
            });

            service.loadContacts(function(c){
                setTimeout(function(){
                    var renderData = {
                        contacts: c
                    };
                    var output = appFunc.renderTpl(template, renderData);
                    $$('#contactView .contacts-list ul').html(output);

                    H5Shop.hideIndicator();

                },500);
            });
        }
    },
    beforeLoadContacts: function(){
        if($$('#contactView .contacts-list .list-group .contact-item').length > 0) {
            return false;
        }else {
            H5Shop.showIndicator();
            return true;
        }
    },
    bindEvents: function(){
        var bindings = [{
            element: '#contactView',
            event: 'show',
            handler: contacts.loadContacts
        }];

        appFunc.bindEvents(bindings);
    }
};

module.exports = contacts;
