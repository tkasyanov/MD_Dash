var App = angular.module('App', ['pr.longpress', 'ng.jsoneditor','ui.bootstrap.contextMenu',  '720kb.tooltips','color.picker', 'nvd3','ngDragDrop']);

App.config(function ($sceProvider) {
    $sceProvider.enabled(false);
});

App.config(function ($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});

/*
if (!window.CONFIG) {
    var error = 'Please make sure you have "config.js" file and it\'s a valid javascript!\n' +
        'If you running TileBoard for the first time, please rename "config.example.js" to "config.js"';

    alert(error);
}*/

//var Api = new HApi();
<!--var Api = new HApi(CONFIG.wsUrl, CONFIG.authToken);-->