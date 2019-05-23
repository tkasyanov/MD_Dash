var App = angular.module('App', ['pr.longpress', 'ng.jsoneditor','ui.bootstrap.contextMenu',  '720kb.tooltips','color.picker', 'nvd3','ngDragDrop','ui.select','at.multirange-slider','tb-color-picker']);

App.config(function ($sceProvider) {
    $sceProvider.enabled(false);
});

App.config(function ($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});
