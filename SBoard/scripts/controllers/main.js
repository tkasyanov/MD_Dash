var CONFIG = {
    customTheme: null, // CUSTOM_THEMES.TRANSPARENT, CUSTOM_THEMES.MATERIAL, CUSTOM_THEMES.MOBILE, CUSTOM_THEMES.COMPACT, CUSTOM_THEMES.HOMEKIT, CUSTOM_THEMES.WINPHONE, CUSTOM_THEMES.WIN95
    transition: TRANSITIONS.ANIMATED_GPU, //ANIMATED or SIMPLE (better perfomance)
    entitySize: ENTITY_SIZES.NORMAL, //SMALL, BIG are available
    tileSize: 150,
    tileMargin: 6,
    doorEntryTimeout: 1000,
    authToken: null, // optional: make an long live token and put it here
    // Required if you are using Google Maps for device tracker
    debug: false, // Prints entities and state change info to the console.

    // next fields are optional
    events: [],
    timeFormat: 24,
    menuPosition: MENU_POSITIONS.LEFT, // or BOTTOM
    hideScrollbar: false, // horizontal scrollbar
    groupsAlign: GROUP_ALIGNS.HORIZONTALLY, // or VERTICALLY

    header: { // https://github.com/resoai/TileBoard/wiki/Header-configuration
        styles: {
            padding: '30px 130px 0',
            fontSize: '28px'
        },
        right: [],
        left: [{
            type: HEADER_ITEMS.DATETIME,
            dateFormat: 'EEEE, LLLL dd', //https://docs.angularjs.org/api/ng/filter/date
        }]
    },

    pages: {}
};
var temp_properties = [];
var editingMode = false;
var objs = {};
saveConfigAction = function () {
    var xhr = new XMLHttpRequest();

    xhr.open('POST', '/sboard/json.php');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(CONFIG));

    xhr.onreadystatechange = function () {
        if (xhr.status === 200 && xhr.readyState == 4) {
            getJsonConfig();
        }
    };

    //$scope.getBodyClass();
    // $scope.editingMode = !$scope.editingMode;
};
var tile = {
    "sensor": {
        "title": "string",
        "unit": "string",
        "example": {
            "state": false,
            "title": "example",
            "unit": "C"
        }
    },
    "slider": {
        "unit": "strimg",
        "states": "array[2]",
        "slider": {
            "max": "int",
            "min": "int",
            "step": "int"
        },
        "example": {
            "unit": "%",
            "bottom": true,
            "slider": {
                "max": 100,
                "min": 0,
                "step": 1
            }
        },

    },
    "sensor_icon": {
        "title": "string",
        "unit": "string",
        "states": "array[2]",
        "icons": "array[2]",
        "example": {
            "title": "example",
            "states": {
                "on": "On",
                "off": "Off"
            },
            "icons": {
                "on": "mdi-hot-tub",
                "off": "mdi-hot-tub"
            }
        }
    },
    "switch": {
        "title": "string",
        "subtitle": "string",
        "states": "array[2]",
        "icons": "array[2]",
        "example": {
            "title": "example_switch",
            "subtitle": "Kitchen",
            "states": {
                "on": "On",
                "off": "Off"
            },
            "icons": {
                "on": "mdi-lightbulb-on",
                "off": "mdi-lightbulb"
            }
        }
    },
    "input_select": {
        "title": "string",
        "attributes": "array",
        "example": {
            "title": "example_select",
            "id": {
                "attributes": {
                    "options": [
                        "example1",
                        "example2"
                    ]
                }
            }
        }
    },
    "input_number": {
        "title": "string",
        "attributes": "array",
        "example": {
            "title": "Tile size",
            "id": {
                "attributes": {
                    "step": 25,
                    "min": 25,
                    "max": 250
                }
            },
            "value": 150,
        }
    },
    "progress": {
        "title": "string",
        "value": "float",
        "unit": "string",
        "background": "string",
        "color": "string",
        "refresh": "int",
        "example": {
            "title": "Progress",
            "value": "50",
            "unit": "%",
            "background": "white",
            "color": "red"
        }
    },
    "iframe": {
        "refresh": "int",
        "url": "string",
        "example": {
            "refresh": 0,
            "url": "http:\/\/www.youtube.com\/embed\/M7lc1UVf-VE?autoplay=1&origin=http:\/\/example.com"
        }
    },
    "graph": {
        "title": "string",
        "tile_color": "string",
        "data": [],
        "options": [],
        "example": {
            "title": "example_graph",
            "width": 2,
            "tile_color": "white",
            "data": [
                {
                    "values": [
                        {
                            "x": 0,
                            "y": 0
                        },
                        {
                            "x": 1,
                            "y": 2
                        },
                        {
                            "x": 2,
                            "y": 2
                        },
                        {
                            "x": 3,
                            "y": 1
                        },
                        {
                            "x": 4,
                            "y": 2
                        },
                        {
                            "x": 5,
                            "y": 2
                        }
                    ],
                    "key": "Line 1",
                    "color": "#ff7f0e"
                }
            ],
            "options": {
                "chart": {
                    "type": "lineChart",
                    "height": 150,
                    "width": 300,
                    "useInteractiveGuideline": true,
                    "xAxis": {
                        "axisLabel": "Time (ms)"
                    },
                    "yAxis": {
                        "axisLabel": "example (v)",
                        "axisLabelDistance": "-10"
                    }
                }
            }
        }
    },
    "custom": {
        "title": "string",
        "icon": "string",
        "example": {
            "title": "example_custom",
            "icon": "mdi-monitor",
            "action": "\/function(item, entity){\n                        alert('test');\n                    }\/"
        }
    },
    "media_player": {
        "title": "string",
        "hideSource": "boolen",
        "hideMuteButton": "boolen",
        "state": "boolen",
        "example": {
            "hideSource": false,
            "hideMuteButton": false,
            "state": true
        }

    },
    "camera": {
        "bgSize": "string",
        "refresh": "int",
        "example": {
            "bgSize": "cover",
            "fullscreen": "camera",
            "refresh": 0,

        }
    },
    "device_tracker": {
        "zoomLevels": "array", // or [9] for only one map slide
        "hideEntityPicture": "bool", //hide entity pic, if you need only map
        "slidesDelay": "int",
        "example": {
            "zoomLevels": [9, 13, 15],
            "hideEntityPicture": true,
            "slidesDelay": 2

        }

    },
    "termostat": {
        "example": {
            "width": 3,
            "height": 1,
            "controlsEnabled": false,
            "property": ["currentTargetValue", "value", "normalTargetValue", "ecoTargetValue"]
        }
    }
};
App.controller('Main', function MainController($scope, $location, $sce) {
    if (!window.CONFIG) return;

    $scope.iconData = [];
    $scope.icons = [];
    $scope.pageIcon = {};
    $scope.pageBg = {};
    $scope.selected = 'mdi-vector-square';
    var http = $.get('//cdn.materialdesignicons.com/1.8.36/meta.json', function (data) {
        $scope.iconData = data;
        $scope.icons = data.map(function (v) {
            return v.name;
        }).slice(0, 301);
    });

    $scope.selectImage = function (i) {
        $scope.pageBg.img = i.thumb;
    }
    $scope.images = [{
        id: 1,
        thumb: '/sboard/images/bg1.jpg'
    },
        {
            id: 2,
            thumb: '/sboard/images/bg2.png'
        },
        {
            id: 3,
            thumb: '/sboard/images/bg3.jpg'
        },
        {
            id: 4,
            thumb: '/sboard/images/bg4.jpg'
        },
        {
            id: 5,
            thumb: '/sboard/images/bg5.jpg'
        },
        {
            id: 6,
            thumb: '/sboard/images/bg6.jpg'
        },
        {
            id: 7,
            thumb: '/sboard/images/bg7.jpg'
        }
    ];
    $scope.searchTerm = '';
    $scope.selectIcon = function (icon) {
        $scope.pageIcon.Icon = 'mdi-' + icon;
        $scope.searchTerm = 'mdi-' + icon;

    };
    $scope.tab = 1;

    $scope.setTab = function (newTab) {
        $scope.tab = newTab;
    };

    $scope.isSet = function (tabNum) {
        return $scope.tab === tabNum;
    };
    $scope.$watch('pageIcon.Icon', function (term) {

        if (typeof term == 'undefined'
            || term == null || term == ''
            || term.length < 2) {
            $scope.icons = $scope.iconData.map(function (v) {
                return v.name;
            }).slice(0, 301);
        } else {
            $scope.icons = $scope.iconData.filter(function (v) {
                if (v.name.match(term)) {
                    return true;
                } else {
                    for (var i = 0, c = v.aliases.length; i < c; i++) {
                        if (v.aliases[i].match(term)) {
                            return true;
                        }
                    }
                    return false;
                }
            }).map(function (v) {
                return v.name;
            }).slice(0, 301);
        }
    });
    $scope.pages = CONFIG.pages;
    $scope.TYPES = TYPES;
    $scope.FEATURES = FEATURES;
    $scope.HEADER_ITEMS = HEADER_ITEMS;

    $scope.activeSelect = null;
    $scope.ready = false;

    $scope.errors = [];
    $scope.states = {};

    $scope.activeDatetime = null;
    $scope.datetimeString = null;

    $scope.activeCamera = null;
    $scope.activeDoorEntry = null;

    $scope.alarmCode = null;
    $scope.activeAlarm = null;
    $scope.jsonInput = true;
    $scope.jsonData = null;
    $scope.groupName = "";
    $scope.pageTitle = "";
    $scope.sliders_termostat =
        [
            {
                "id": 1,
                "title": "Пн"
            },
            {
                "id": 2,
                "title": "Вт"
            },
            {
                "id": 3,
                "title": "Ср"
            },
            {
                "id": 4,
                "title": "Чт"
            },
            {
                "id": 5,
                "title": "Пт"
            },
            {
                "id": 6,
                "title": "Сб"
            },
            {
                "id": 7,
                "title": "Вс"
            }

        ];
    $scope.addItem = function (id) {
        $scope.probs[id].push({
            p: Math.random()
        });
    }
    $scope.removeItem = function (id) {
        $scope.probs[id].pop();
    }
    $scope.probs = {};
    for (i = 1; i <= 7; i++) {
        $scope.probs[i] = [{
            p: 0,
            //symbol: $sce.trustAsHtml('0')
        }, {
            p: 1440,
            //symbol: $sce.trustAsHtml('1440')
        }, {
            p: 0,
            //  symbol: $sce.trustAsHtml('0')
        }];
    }


    $scope.sizes = [
        {'id': 0.5, 'label': '0.5'},
        {'id': 1, 'label': '1'},
        {'id': 2, 'label': '2'},
        {'id': 3, 'label': '3'},
        {'id': 4, 'label': '4'},
        {'id': 5, 'label': '5'},
        {'id': 6, 'label': '6'},
        {'id': 7, 'label': '7'},
    ];
    $scope.pagesSetting = convertToObject([{
        "title": "Setting",
        "bg": "images\/bg2.png",
        "icon": "mdi-settings",
        "groups": [
            {
                "title": "Theme",
                "items": [
                    {
                        "position": [
                            0,
                            0
                        ],
                        "type": "input_select",
                        "id": {
                            "attributes": {
                                "options": [
                                    "win10",
                                    "transparent",
                                    "material",
                                    "win95",
                                    "winphone",
                                    "mobile",
                                    "compact",
                                    "homekit"
                                ]
                            }
                        },
                        "value": "win10",
                        "title": "Theme",
                        "setting": true,
                        "action": function (item, entity) {
                            CONFIG.customTheme = item.value;
                            saveConfigAction();
                            return false;
                        }
                    },
                    {
                        "position": [
                            0,
                            1
                        ],
                        "id": {},
                        "type": "switch",
                        "states": {
                            "on": "On",
                            "off": "Off"
                        },
                        "icons": {
                            "on": "mdi-checkbox-marked",
                            "off": "mdi-checkbox-blank-outline"
                        },
                        "setting": true,
                        "title": "Show Header",
                        "action": function (item, entity) {
                            if (item.id.state == "on")
                                CONFIG.showheader = "off";
                            else
                                CONFIG.showheader = "on";
                            saveConfigAction();
                            return false;
                        }
                    },
                    {
                        "position": [
                            1,
                            0
                        ],
                        "type": "input_select",
                        "id": {
                            "attributes": {
                                "options": [
                                    "small",
                                    "normal",
                                    "big"
                                ]
                            }
                        },
                        "value": "normal",
                        "title": "size",
                        "setting": true,
                        "action": function (item, entity) {
                            CONFIG.entitySize = item.value;
                            saveConfigAction();
                            return false;
                        }
                    },
                    {
                        "position": [1, 1],
                        "type": "input_number",
                        "title": "Tile size",
                        "setting": true,
                        "id": {
                            "attributes": {
                                "step": 25,
                                "min": 75,
                                "max": 250
                            },
                            "state": 150,
                        },

                        "action": function (item, entity) {
                            if (item.value > 25) {
                                CONFIG.tileSize = item.value;
                                saveConfigAction();
                                return false;
                            }
                        }
                    }


                ]
            },
            {
                "title": "General",
                "items": [
                    {
                        "position": [
                            0,
                            0
                        ],
                        "id": {},
                        "type": "switch",
                        "states": {
                            "on": "On",
                            "off": "Off"
                        },
                        "icons": {
                            "on": "mdi-checkbox-marked",
                            "off": "mdi-checkbox-blank-outline"
                        },
                        "setting": true,
                        "title": "Websocket",
                        "action": function (item, entity) {
                            if (item.id.state == "on")
                                CONFIG.websocket = "off";
                            else
                                CONFIG.websocket = "on";
                            saveConfigAction();
                            return false;
                        }
                    },
                    {
                        "position": [
                            1,
                            0
                        ],
                        "id": {},
                        "type": "custom",
                        //"icon":"mdi-pencil-outline",
                        "icon": "mdi-playlist-edit",
                        "setting": true,
                        "title": "Edit config",
                        "action": function (item, entity) {
                            $scope.cofigJson.data = CONFIG;
                            $scope.editConfig = true;
                            return false;
                        }
                    }
                ]
            }
        ],
    }
    ]);

    $scope.menuOptions = [
        // NEW IMPLEMENTATION
        {
            text: 'Configure Tile',
            html: '<a href="#"><i class="fa fa-gear" aria-hidden="true"></i>&nbsp;&nbsp;Configure Tile</a>',
            click: function ($itemScope, $event, modelValue, text, $li) {
                $scope.editTileClick($itemScope.$parent.item, $itemScope.$parent);
            }
        },
        {
            html: '<a href="#"><i class="fa fa-plus-square-o" aria-hidden="true"></i>&nbsp;&nbsp;Add Tile</a>',
            click: function ($itemScope, $event, modelValue, text, $li) {
                $scope.openAddTilePopup($itemScope.$parent.$parent.$parent.group);
            }
        },
        {
            html: '<a href="#"><i class="fa fa-remove" aria-hidden="true"></i>&nbsp;&nbsp;Remove Tile</a>',
            click: function ($itemScope, $event, modelValue, text, $li) {
                $scope.removeTileClick($itemScope.$parent.item, $itemScope.$parent);
            }
        }];

    $scope.menuOptionsGroups = [
        // NEW IMPLEMENTATION
        {
            text: 'Configure Tile',
            html: '<a href="#"><i class="fa fa-gear" aria-hidden="true"></i>&nbsp;&nbsp;Configure Group</a>',
            click: function ($itemScope, $event, modelValue, text, $li) {
                $scope.openEditGroupPopup($itemScope.$parent.group, $itemScope.$parent.$parent);
            }
        },
        {
            html: '<a href="#"><i class="fa fa-plus-square-o" aria-hidden="true"></i>&nbsp;&nbsp;Add Group</a>',
            click: function ($itemScope, $event, modelValue, text, $li) {
                $scope.openAddGroupPopup($itemScope.$parent.group);
            }
        },
        {
            html: '<a href="#"><i class="fa fa-plus-square-o" aria-hidden="true"></i>&nbsp;&nbsp;Add Tile</a>',
            click: function ($itemScope, $event, modelValue, text, $li) {
                $scope.openAddTilePopup($itemScope.$parent.group);
            }
        },
        {
            html: '<a href="#"><i class="fa fa-remove" aria-hidden="true"></i>&nbsp;&nbsp;Remove Group</a>',
            click: function ($itemScope, $event, modelValue, text, $li) {
                $scope.removeGroupClick($itemScope.$parent.group, $itemScope.$parent);
            }
        }];

    if (typeof($scope.jsonData) === "object" && $scope.jsonData !== null)
        $scope.jsonStringData = convertToString($scope.jsonData);

    $scope.positionCss = {position: "absolute", top: "30px", left: "40px"};
    $scope.objJson = {data: $scope.jsonData, options: {mode: 'tree'}};
    $scope.cofigJson = {data: CONFIG, options: {mode: 'tree'}};
    $scope.changeOptions = function (param) {
        $scope.objJson.options.mode = param;
        $scope.changeInputStyle(param);
    };
    $scope.pretty = function (objJson) {
        return objJson;
    };
    $scope.Math = window.Math;

    var wsTimer = 0;
    var startedWebSockets = 0;


    var httpRefreshTimer = 0;
    var subscribedWebSockets = 0;
    var subscribedWebSocketsTimer;
    var requestSent = Math.round(+new Date() / 1000);


    var showedPages = [];

    var latestAlarmActions = {};
    var doorEntryTimeout = null;
    var bodyClass = null;
    var mainStyles = {};
    $scope.activePage = null;
    var cameraList = null;
    var editingMode = false;
    var addTile = false;
    var addGroup = false;
    var addPage = false;
    var editGroup = false;
    var editPage = false;
    var editTile = false;
    var editConfig = false;

    $scope.selectedWidth = null;
    $scope.selectedHeight = null;
    $scope.editedItem = null;
    $scope.editedGroup = null;
    $scope.editedPage = null;
    $scope.selectedItem = null;
    $scope.selectedType = null;
    $scope.tileTypeList = null;
    $scope.tileConfig = null;
    $scope.tileDevice = null;
    $scope.tileObjectArray = [];
    $scope.tileDeviceArray = [];
    // $scope.tileDeviceArrayName =[];
    $scope.tileDevicePropertyArray = null;
    $scope.exampleHTML = "";
    $scope.drag = false;
    $scope.selectedDevice = null;
    $scope.selectedProperty = null;
    $scope.selectedObject = null;


    var defaultDropPlace = {
        position: [0, 0],
        type: TYPES.DROPPLACE,
        title: '',
        id: {},
        value: 'Drop Here!'
    }

    function parse(data) {
        return data ? JSON.parse(data) : {};
    };

    function getJsonConfig() {
        getJSON('/api.php/objects/', function (err, data) {
            if (err != null) {
                Noty.addObject({
                    type: Noty.ERROR,
                    title: 'Error',
                    message: 'Something went wrong: ' + err,
                    lifetime: 5
                });
            } else {

                for (var dev in data.objects) {
                    if (typeof objs[data.objects[dev].TITLE] === "undefined")
                        objs[data.objects[dev].TITLE] = {};
                    for (var prop in data.objects[dev]) {
                        objs[data.objects[dev].TITLE][prop] = data.objects[dev][prop];
                    }
                    $scope.tileObjectArray[data.objects[dev].ID] = {}
                    $scope.tileObjectArray[data.objects[dev].ID].id = data.objects[dev].ID;
                    $scope.tileObjectArray[data.objects[dev].ID].name = data.objects[dev].TITLE;
                    //   $scope.tileDeviceArrayName[data.objects[dev].TITLE]=data.objects[dev].ID;
                }
                $scope.tileDevice = objs;
            }


            getJSON('/api.php/devices/', function (err, data) {
                if (err != null) {
                    Noty.addObject({
                        type: Noty.ERROR,
                        title: 'Error',
                        message: 'Something went wrong: ' + err,
                        lifetime: 5
                    });
                } else {
                    for (i in data.devices) {
                        if (data.devices[i].type == "relay")
                            if (data.devices[i].status == 1) data.devices[i].state = "on"; else data.devices[i].state = "off";
                        if (data.devices[i].type == "dimmer") {
                            data.devices[i].state = data.devices[i].level;
                        }
                    }
                    /*var objCnt = data.devices.length;
                    if (objCnt) {
                        for (var i = 0; i < objCnt; i++) {
                            if (data.devices[i].type == "relay")
                                if (data.devices[i].status == 1) data.devices[i].state = "on"; else data.devices[i].state = "off";
                            if (data.devices[i].type == "dimmer") {
                                data.devices[i].state = data.devices[i].level;
                            }
                        }*/

                    for (var dev in data.devices) {
                        if (typeof objs[data.devices[dev].object] === "undefined")
                            objs[data.devices[dev].object] = {};
                        for (var prop in data.devices[dev]) {
                            objs[data.devices[dev].object][prop] = data.devices[dev][prop];
                            //   objs[data.devices[dev].object] = data.devices[i];
                        }
                        $scope.tileDeviceArray[data.devices[dev].id] = {}
                        $scope.tileDeviceArray[data.devices[dev].id].id = data.devices[dev].id;
                        $scope.tileDeviceArray[data.devices[dev].id].name = data.devices[dev].object;
                        $scope.tileDeviceArray[data.devices[dev].id].title = data.devices[dev].title;
                    }


                }
                getJSON('/sboard/json.php', function (err, data) {
                    if (err != null) {
                        Noty.addObject({
                            type: Noty.ERROR,
                            title: 'Error',
                            message: 'Something went wrong: ' + err,
                            lifetime: 5
                        });
                    } else {

                        //COMMENT IF LOCAL
                        CONFIG = convertToObject(data.config);
                        //CONFIG.pageSettingIndex=CONFIG.pages.push(convertToObject($scope.pageSetting));
                        $scope.tileConfig = tile;
                        $scope.customTheme = CONFIG.customTheme;
                        $scope.pagesSetting[0].groups[0].items[0].value = CONFIG.customTheme;
                        $scope.pagesSetting[0].groups[0].items[2].value = CONFIG.entitySize;
                        $scope.pagesSetting[0].groups[0].items[3].id.state = CONFIG.tileSize;
                        if (CONFIG.websocket == "on" || CONFIG.websocket == "off") {
                            $scope.websocket = CONFIG.websocket;
                            $scope.pagesSetting[0].groups[1].items[0].id = {"state": CONFIG.websocket};
                        } else {
                            $scope.websocket = "on";
                            $scope.pagesSetting[0].groups[1].items[0].id = {"state": "on"};
                        }
                        if (CONFIG.showheader == "on" || CONFIG.showheader == "off") {
                            $scope.showheader = CONFIG.showheader;
                            $scope.pagesSetting[0].groups[0].items[1].id = {"state": CONFIG.showheader};
                        } else {
                            $scope.showheader = "on";
                            $scope.pagesSetting[0].groups[0].items[1].id = {"state": "on"};
                        }
                        if ($scope.showheader == "on")
                            CONFIG.header.left = [{
                                type: HEADER_ITEMS.DATETIME,
                                dateFormat: 'EEEE, LLLL dd', //https://docs.angularjs.org/api/ng/filter/date
                            }];
                        else
                            CONFIG.header.left = [];

                        bodyClass = null;
                        $scope.getBodyClass();
                        $scope.pages = CONFIG.pages;
                        $scope.tileTypeList = Object.keys($scope.tileConfig);

                        var pageIndex = localStorage.getItem('page');
                        //pageIndex=0;
                        if (pageIndex && pageIndex < CONFIG.pages.length + $scope.pagesSetting.length && pageIndex >= 0)
                            if (pageIndex >= CONFIG.pages.length) {
                                activePage = $scope.pagesSetting[pageIndex - CONFIG.pages.length];
                                scrollToActivePageSetting(true);
                                $scope.activePage = activePage;
                                $scope.selectedItem = activePage.groups[0];
                            }
                            else {
                                activePage = CONFIG.pages[pageIndex];
                                scrollToActivePage(true);
                                $scope.activePage = activePage;
                                $scope.selectedItem = activePage.groups[0];
                            }
                        else {
                            if (CONFIG.pages.length > 0) {
                                activePage = CONFIG.pages[0];
                                scrollToActivePage(true);
                                $scope.activePage = activePage;
                                $scope.selectedItem = activePage.groups[0];

                            }
                        }

                        $scope.ready = true;
                        $scope.$digest();
                        //activePage = CONFIG.activePage;

                        for (var page in CONFIG.pages) {
                            for (var group in CONFIG.pages[page].groups) {
                                for (var item in CONFIG.pages[page].groups[group].items) {
                                    var item_config = CONFIG.pages[page].groups[group].items[item]
                                    if (typeof item_config.id === "object")
                                        if (typeof item_config.property === "string") {
                                            if (typeof item_config.id.name === "string")
                                                temp_properties.push(item_config.id.name + '.' + item_config.property);
                                        } else if (typeof item_config.property === "object") {
                                            if (typeof item_config.id.name === "string")
                                                for (var i = 0; i < item_config.property.length; i++) {
                                                    temp_properties.push(item_config.id.name + '.' + item_config.property[i]);
                                                }
                                        }
                                }
                            }
                        }

                        var xhr = new XMLHttpRequest();
                        xhr.open('POST', '/api.php/data/');
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.send(JSON.stringify({"properties": temp_properties}));
                        xhr.onreadystatechange = function () {
                            if (xhr.status === 200) {
                                if (xhr.response != "") {
                                    var obj = jQuery.parseJSON(xhr.response);
                                    if (typeof obj != 'object') return false;
                                    for (key in obj.data) {
                                        var pr_arr = key.split('.');
                                        objs[pr_arr[0]][pr_arr[1]] = obj.data[key];
                                    }
                                }

                                updateView();
                            }
                        };


                        try {
                            if (CONFIG.websocket == "on")
                                startWebSockets();
                            else
                                httpRefreshTimer = setInterval(
                                    function () {
                                        $scope.httpRefreshDevices()
                                    }, 3000);

                        } catch (e) {
                            //     httpRefreshDevices();
                        }

                    }
                });
            });
        });
    }

    $scope.propertyShow = function (type) {
        if (type == "termostat") return false;
        else return true;
    }

    $scope.changeTileDevices = function (selectedDevices, group) {
        $scope.tileDevicePropertyArray.selected = undefined;
        selectedDevices = $scope.tileDeviceArray[$scope.tileDeviceArray.selected];
        if (selectedDevices != null) {
            $scope.jsonData.id = {};
            $scope.jsonData.id.id = objs[selectedDevices.name].ID;
            $scope.jsonData.id.name = selectedDevices.name;
            $scope.jsonData.id.title = selectedDevices.title;
            $scope.jsonData.title = selectedDevices.title;


            getJSON('/api.php/data/' + selectedDevices.name, function (err, data) {
                if (typeof (data.data) === "object")
                    $scope.tileDevicePropertyArray = Object.keys(data.data);

            });
            if (typeof objs[selectedDevices.name].type !== "undefined") {
                $scope.tileDevicePropertyArray.selected = "status";
                if (objs[selectedDevices.name].type == "sensor" || objs[selectedDevices.name].type == "sensor_temp")
                    $scope.tileDevicePropertyArray.selected = "value";
                if (objs[selectedDevices.name].type == "dimmer")
                    $scope.tileDevicePropertyArray.selected = "level";

                $scope.jsonData.property = $scope.tileDevicePropertyArray.selected
            }

            $scope.tileObjectArray.selected = $scope.jsonData.id;
            $scope.jsonStringData = convertToString($scope.jsonData);

        }
    }

    $scope.changeTileObject = function (selectedObject, group) {

        $scope.tileDeviceArray.selected = undefined;
        $scope.tileDevicePropertyArray.selected = undefined;


        if (selectedObject != null) {
            $scope.jsonData.id = selectedObject;
            $scope.jsonData.title = selectedObject.title;
            $scope.jsonStringData = convertToString($scope.jsonData);

            getJSON('/api.php/data/' + selectedObject.name, function (err, data) {
                if (typeof (data.data) === "object")
                    $scope.tileDevicePropertyArray = Object.keys(data.data);

            });

        }
    }


    $scope.changeDevicesProperty = function (selectedProperty) {
        $scope.tileDeviceArray.selected = undefined;
        if (selectedProperty != null) {
            $scope.jsonData.property = selectedProperty;
            $scope.jsonStringData = convertToString($scope.jsonData);
        }
    }

    $scope.changeTileHeight = function (selectedHeight, group) {
        if (selectedHeight != null) {
            $scope.jsonData.height = selectedHeight;
            $scope.objJson.data.height = selectedHeight;
        }
    }
    $scope.changeTileWidth = function (selectedWidth, group) {
        if (selectedWidth != null) {
            $scope.jsonData.width = selectedWidth;
            $scope.objJson.data.width = selectedWidth;
        }
    }


    $scope.changeTileType = function (selectedType, group) {
        $scope.tileObjectArray.selected = undefined;
        $scope.tileDeviceArray.selected = undefined;
        if ($scope.tileDevicePropertyArray == null)
            $scope.tileDevicePropertyArray={};
        if (typeof $scope.tileDevicePropertyArray.selected == "undefined")
            $scope.tileDevicePropertyArray.selected= null;
        $scope.tileDevicePropertyArray.selected = undefined;
        if (selectedType == null)
            selectedType = $scope.tileTypeList[0];
        $scope.selectedType = selectedType;

        var example = $scope.tileConfig[$scope.selectedType].example;
        $scope.exampleHTML = $scope.tileConfig[$scope.selectedType].html;
        example.type = $scope.selectedType;
        // if (!example.position)
        example.position = getFirstFreePosition(group);
        $scope.jsonData = $scope.tileConfig[$scope.selectedType].example;
        $scope.jsonStringData = convertToString($scope.jsonData);
        $scope.objJson.data = $scope.jsonData;


    }

    function getFirstFreePosition(group) {
        var result = [0, 0];
        var width = Math.round(group.width);
        var height = Math.round(group.height + 1);
        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                var pos = [j, i];
                var temp = group.items.filter(function (obj) {
                    return JSON.stringify(obj.position) == JSON.stringify(pos) ||
                        (obj.position && obj.position.length > 1 && obj.width && obj.width > 1 && JSON.stringify([obj.position[0] + 1, obj.position[1]]) == JSON.stringify(pos)) ||
                        (obj.position && obj.position.length > 1 && obj.height && obj.height > 1 && JSON.stringify([obj.position[0], obj.position[1] + 1]) == JSON.stringify(pos));
                });
                if (!temp || temp.length === 0) {
                    result = pos;
                    i = height;
                    j = width;
                    break;
                }
            }
        }

        return result;
    }

    function getJSON(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = function () {
            var status = xhr.status;
            if (status == 200) {
                callback(null, xhr.response);
            } else {
                callback(status);
            }
        };
        xhr.send();
    };


    function recalculateGroupSize() {
        for (var i = 0; i < $scope.activePage.groups.length; i++) {
            setGroupSize($scope.activePage.groups[i]);
        }
    }

    function setGroupSize(group) {
        var width = 1;
        var height = 1;
        for (var i = 0; i < group.items.length; i++) {
            var item = group.items[i];
            var itemWidth = item.styles && item.styles.width ? parseInt(item.styles.width) : item.width ? item.width * CONFIG.tileSize : CONFIG.tileSize;
            var itemHeight = item.styles && item.styles.height ? parseInt(item.styles.height) : item.height ? item.height * CONFIG.tileSize : CONFIG.tileSize;
            var x = (item.position[0]) * CONFIG.tileSize + itemWidth;
            var y = (item.position[1]) * CONFIG.tileSize + itemHeight;
            width = Math.max(width, x / CONFIG.tileSize);
            height = Math.max(height, y / CONFIG.tileSize);
        }
        group.width = width;
        group.height = height;
    }

    $scope.$on('context-menu-opening', function (event, args) {

    });
    $scope.set = function (data) {
        $scope.jsonData = parse(data);
        $scope.nodeOptions.refresh();
        /* use directive internal refresh function */
    }

    $scope.default = function () {
        $scope.jsonData = defaultData();
        $scope.nodeOptions.refresh();
        $scope.inputdata = '';
    }

    $scope.pageLoad = function () {
        getJsonConfig();
        var pageIndex = localStorage.getItem('page');
        if (pageIndex && CONFIG.pages.length > pageIndex)
            activePage = CONFIG.pages[pageIndex];
        else
            activePage = CONFIG.pages[0];
    };


    $scope.editTileClick = function (item, parent) {
        $scope.objJson.data = $scope.jsonData;
        $scope.openEditTilePopup(item);
        $scope.editedItemIdx = parent.$index;
        $scope.editedGroupIdx = parent.$parent.$parent.$index;
        $scope.selectedItem = $scope.activePage.groups[$scope.editedGroupIdx];
        if (item.id != null)
            $scope.selectedObject = item.id;
        $scope.exampleHTML = null;
        $scope.selectedWidth = item.width;
        $scope.selectedHeight = item.height;
        selectedHeight = item.height;
        if ($scope.tileConfig[item.type] != null)
            $scope.exampleHTML = $scope.tileConfig[item.type].html;

    }
    $scope.entityClick = function (page, item, entity, parent, event) {

        if ($scope.editingMode) {
            return;
        }


        if (item.type != TYPES.INPUT_SELECT && item.type != TYPES.SLIDER && item.type != TYPES.INPUT_BOOLEAN)
            if (item.action && typeof item.action === "function")
                if (!callFunction(item.action, [item, entity]))
                    return;

        switch (item.type) {
            case TYPES.SWITCH:
            case TYPES.LIGHT:
            case TYPES.FAN:
            case TYPES.INPUT_BOOLEAN:
                return $scope.toggleSwitch(item, entity);

            case TYPES.LOCK:
                return $scope.toggleLock(item, entity);
            case TYPES.COVER_TOGGLE:
                return $scope.toggleCover(item, entity);

            case TYPES.VACUUM:
                return $scope.toggleVacuum(item, entity);

            case TYPES.AUTOMATION:
                return $scope.triggerAutomation(item, entity);

            case TYPES.SCRIPT:
                return $scope.callScript(item, entity);

            case TYPES.INPUT_SELECT:
                return $scope.toggleSelect(item, entity);

            case TYPES.CAMERA:
            case TYPES.CAMERA_THUMBNAIL:
                return $scope.openCamera(item, entity);

            case TYPES.SCENE:
                return $scope.callScene(item, entity);

            case TYPES.DOOR_ENTRY:
                return $scope.openDoorEntry(item, entity);

            case TYPES.ALARM:
                return $scope.openAlarm(item, entity);

            case TYPES.CUSTOM:
                return $scope.customTileAction(item, entity);

            case TYPES.INPUT_DATETIME:
                return $scope.openDatetime(item, entity);
        }
    };

    $scope.entityLongClick = function ($event, page, item, entity) {
        $event.preventDefault();
        $event.stopPropagation();

        switch (item.type) {
            case TYPES.LIGHT:
                return $scope.openLightSliders(item, entity);
        }

        return false;
    };

    $scope.getBodyClass = function () {
        if (!bodyClass) {
            bodyClass = [];

            if (CONFIG.customTheme) {
                var themes = CONFIG.customTheme;

                if (typeof themes === "string") themes = [themes];

                themes.map(function (theme) {
                    bodyClass.push('-theme-' + theme);
                });
            }


            if (CONFIG.entitySize) {
                bodyClass.push('-' + CONFIG.entitySize + '-entity');
            }

            var menuPos = CONFIG.menuPosition || MENU_POSITIONS.LEFT;
            var groupsAlign = CONFIG.groupsAlign || GROUP_ALIGNS.HORIZONTALLY;

            bodyClass.push('-menu-' + menuPos);
            bodyClass.push('-groups-align-' + groupsAlign);

            if (CONFIG.hideScrollbar) {
                bodyClass.push('-hide-scrollbar');
            }
        }

        var scrollClasses = [];

        if (activePage) {
            if (activePage.scrolledHorizontally) {
                scrollClasses.push('-scrolled-horizontally');
            }

            if (activePage.scrolledVertically) {
                scrollClasses.push('-scrolled-vertically');
            }
        }

        return bodyClass.concat(scrollClasses);
    };

    $scope.checkJsonObject = function (item) {
        $scope.jsonData = convertToObject(document.getElementById("codeJson").innerHTML);
    };

    $scope.getItemEntity = function (item) {
        if (item.setting || item.type == "dropplace")
            return item.id;
        if (typeof objs[item.id] === "object") return objs[item.id];
        if (typeof item.id === "object") if (typeof objs[item.id.name] === "object")
            return objs[item.id.name];


        if (item.type == "iframe") return {};
        if (!(item.id in $scope.states)) {
            warnUnknownItem(item);
            item.id = {};

            return item.id;
        }

        return $scope.states[item.id];
    };

    $scope.getEntryCameraEntity = function (itemEntry) {
        var item = itemEntry.layout.camera;

        if (typeof item.id === "object") return item.id;

        return $scope.states[item.id];
    };

    $scope.showPage = function (page) {
        return showedPages.indexOf(page) !== -1;
    };


    $scope.hasTrackerCoords = function (entity) {
        return true;
        if (!entity.attributes) return false;

        return entity.attributes.longitude || entity.attributes.latitude;
    };

    $scope.slideMapStyles = function (item, page, obj, zoom, state) {
        var key = 'mapStyles' + zoom + (item.width || '1') + (item.height || '1');

        if (1 == 1) {

            var width = item.width || 1,
                height = item.height || 1;
            var tileSize = page.tileSize || CONFIG.tileSize;
            var name = item.id.name || ' ';


            coords = objs[item.id.name][item.property];
            // +80 - hack to hide logo
            var sizes = Math.ceil(tileSize * width) + ',' + Math.ceil((tileSize * height) + 80);

            var url;

            if (item.map === YANDEX_MAP) {
                var icon = 'round';

                if (state.toLowerCase() === 'home') icon = 'home';
                else if (state.toLowerCase() === 'office') icon = 'work';

                var pt = coords + ',' + icon;

                url = "https://static-maps.yandex.ru/1.x/?lang=en-US&ll=" +
                    coords + "&z=" + zoom + "&l=map&size=" + sizes + "&pt=" + pt;
            } else {
                sizes = sizes.replace(',', 'x');

                var label = name.toUpperCase();
                var marker = encodeURIComponent("color:gray|label:" + label + "|" + coords);

                url = "https://maps.googleapis.com/maps/api/staticmap?center=" +
                    coords + "&zoom=" + zoom + "&size=" + sizes + "x&maptype=roadmap&markers=" + marker;

                if (CONFIG.googleApiKey) {
                    url += "&key=" + CONFIG.googleApiKey;
                }
            }

            obj[key] = {
                backgroundImage: 'url(' + url + ')'
            };
        }

        return obj[key];
    };

    $scope.clockStyles = function () {
        return CONFIG.clockStyles;
    };

    $scope.headWarning = function () {
        // @TODO remove
        Noty.addObject({
            id: 'header-deprecated',
            type: Noty.WARNING,
            title: 'Head deprecated',
            message: 'Head is deprecated, please replace it with "header" object. ' +
            '<br> More info <a href="https://github.com/resoai/TileBoard/wiki/Header-configuration">' +
            'https://github.com/resoai/TileBoard/wiki/Header-configuration</a>'
        });

        return true;
    };

    $scope.pageStyles = function (page) {
        //  if (!page.styles) {
        var styles = {};

        if (page.bg) {
            var bg = parseFieldValue(page.bg, page, {});

            if (bg) styles.backgroundImage = 'url(' + bg + ')';
        } else if (page.bgSuffix) {
            var sbg = parseFieldValue(page.bgSuffix, page, {});

            if (sbg) styles.backgroundImage = 'url(' + CONFIG.serverUrl + sbg + ')';
        }

        page.styles = styles;
        // }

        return page.styles;
    };

    $scope.openTermostatSliders = function ($event, item, entity) {
        //    item.controlsEnabled = true;

    }
    $scope.closeTermostatSliders = function ($event, item, entity) {
        //  item.controlsEnabled = false;

    }


    $scope.showPagesMenu = function () {
        return CONFIG.pages.length > 1;
    };

    $scope.pagesMenuClasses = function () {
        var position = CONFIG.menuPosition;

        if (!position) position = MENU_POSITIONS.LEFT;

        return '-' + position;
    };

    $scope.trackerZoomLevels = function (item, entity) {
        if (!entity.zoomLevels) {
            entity.zoomLevels = [9, 13];

            if (item.zoomLevels) {
                entity.zoomLevels = item.zoomLevels;
            }
        }

        return entity.zoomLevels;
    };

    $scope.trackerSlidesClass = function (item, entity) {
        var maps = $scope.trackerZoomLevels(item, entity);

        var c = maps.length;

        if ($scope.showTrackerBg(item, entity)) c++;

        return '-c' + c;
    };

    $scope.trackerBg = function (entity) {
        if (!entity.trackerBg) {
            var styles = {};

            //  if (entity.attributes.entity_picture) {
            //    styles.backgroundImage = 'url(' + entity.attributes.entity_picture + ')';
            //}

            entity.trackerBg = styles;
        }

        return entity.trackerBg;
    };

    $scope.showTrackerBg = function (item, entity) {
        //  if (!entity.attributes.entity_picture) {
        //      return false;
        //  }
        return !item.hideEntityPicture;
    };

    $scope.groupStyles = function (group, page) {
        if (true || !group.styles) {
            var tileSize = page.tileSize || CONFIG.tileSize;
            var tileMargin = page.tileMargin || CONFIG.tileMargin;

            if (!('width' in group) || !('height' in group)) {
                var sizes = calcGroupSizes(group);

                if (!group.width) group.width = sizes.width;
                if (!group.height) group.height = sizes.height;
            }

            var styles = {
                width: tileSize * group.width + tileMargin * (group.width - 1) + 'px',
                height: tileSize * group.height + tileMargin * (group.height - 1) + 'px',
            };

            if (page.groupMarginCss) {
                styles.margin = page.groupMarginCss;
            } else if (group.groupMarginCss) {
                styles.margin = group.groupMarginCss;
            } else if (CONFIG.groupMarginCss) {
                styles.margin = CONFIG.groupMarginCss;
            }

            group.styles = styles;
        }

        return group.styles;
    };

    $scope.dragStop = function (event, ui, item, group) {
        group.items = group.items.filter(function (obj) {
            return obj.type !== 'dropplace'
        });
        $scope.drag = false;
        updateView();
        event.stopPropagation();
    }

    $scope.dragDrag = function (event, ui, item, group) {
        updateView();
        event.stopPropagation();
    }
    $scope.dragDrop = function (event, ui, item, group) {
        var editedItem = Object.assign({}, group.items[$scope.editedItemIdx]);
        editedItem.position = item.position;
        editedItem.styles = null;


        group.items.splice($scope.editedItemIdx, 1);

        group.items = group.items.filter(function (obj) {
            return obj.type !== 'dropplace'
        });
        group.items.push(editedItem);
        $scope.drag = false;
        recalculateGroupSize();
        updateView();
    }


    $scope.dragOver = function (event, ui) {
        angular.element(event.target).addClass('drop-area-hover');
    }

    $scope.dragOut = function (event, ui) {
        angular.element(event.target).removeClass('drop-area-hover');
    }


    $scope.dragStart = function (event, ui, element, group, parent) {
        if (!$scope.editingMode) {
            $scope.drag = false;
            updateView();
            event.stopImmediatePropagation();
            return false;
        }
        if (element.width > 0) w = element.width; else w = 1;
        if (element.height > 0) h = element.height; else h = 1;
        defaultDropPlace.width = w;
        defaultDropPlace.height = h;

        $scope.editedItemIdx = parent.$index;
        var temp = [];
        var width = group.width + 1;
        var height = group.height + 1;
        for (var i = 0; i < width; i = i + w) {
            for (var j = 0; j < height; j = j + h) {
                var item = Object.assign({}, defaultDropPlace);
                item.position = [i, j];
                temp.push(item);
            }
        }

        for (var i = 0; i < group.items.length; i++) {
            var item = group.items[i];
            if (typeof(item.height) == "undefined") item.height = 1;
            if (typeof(item.width) == "undefined") item.width = 1;
            temp = temp.filter(function (obj) {
                var answer = true;
                for (var jh = 0; jh < item.height; jh = jh + 0.5) {
                    for (var j = 0; j < item.width; j = j + 0.5) {
                        for (var jho = 0; jho < obj.height; jho = jho + 0.5) {
                            for (var jo = 0; jo < obj.width; jo = jo + 0.5) {
                                if (JSON.stringify([obj.position[0] + jo, obj.position[1] + jho]) === JSON.stringify([item.position[0] + j, item.position[1] + jh])) answer = false;
                            }
                        }
                    }
                }
                return answer;
            });
        }
        /* for (var i = 0; i < group.items.length; i++) {
             var item = group.items[i];
             temp = temp.filter(function (obj) {
                 return JSON.stringify(obj.position) !== JSON.stringify(item.position);
             });
             /*for (var j = 1; j < item.height; j=j+h) {
                 var pos = [item.position[0], item.position[1]];
                 if (JSON.stringify(pos) == JSON.stringify(element.position))
                     continue;
                 pos[1] = pos[1] + j;
                 temp = temp.filter(function (obj) {
                     return JSON.stringify(obj.position) !== JSON.stringify(pos);
                 });
             }*/
        /* var pos=[];
         var k=0;
         for (var jh = 0; jh < item.height; jh++) {
             for (var j = 0; j < item.width; j++) {
                 k++;
                 var pos = [item.position[j], item.position[jh]];
                 if (JSON.stringify(pos) == JSON.stringify(element.position))
                    continue;
                 pos[k] = jh + j;
                // pos[1] = pos[1] + jh;
                 temp = temp.filter(function (obj) {
                     return JSON.stringify(obj.position) !== JSON.stringify(pos);
                 });
             }
         }
     }*/

        group.items = group.items.concat(temp);
        $scope.drag = true;
        updateView();
        event.stopPropagation();
    }

    $scope.itemStyles = function (page, item, entity) {
        var prevSize = item._prevTileSize || page.tileSize || CONFIG.tileSize;
        var currentSize = page.tileSize || CONFIG.tileSize;
        var hasChanged = prevSize !== currentSize;

        if (!item.styles || hasChanged) {
            var width = item.width || 1;
            var height = item.height || 1;
            var pos = item.position;
            var tileSize = page.tileSize || CONFIG.tileSize;
            var tileMargin = page.tileMargin || CONFIG.tileMargin;

            item._prevTileSize = tileSize;

            var styles = {
                width: tileSize * width + tileMargin * (width - 1) + 'px',
                height: tileSize * height + tileMargin * (height - 1) + 'px',
                left: pos[0] * tileSize + (tileMargin * pos[0]) + 'px',
                top: pos[1] * tileSize + (tileMargin * pos[1]) + 'px',
            };

            item.styles = styles;
        }

        if (item.tile_color != null) {
            item.styles.backgroundColor = item.tile_color;
        }

        if ($scope.editingMode) {
            item.styles.borderStyle = 'solid';
            item.styles.border = 1;
        } else {
            item.styles.borderStyle = 'none';
        }

        if (item.customStyles) {
            var res;

            if (typeof item.customStyles === "function") {
                res = callFunction(item.customStyles, [item, entity]);
            } else if (typeof item.customStyles === "object") {
                res = item.customStyles;
            }
            if (res)
                for (var k in res) item.styles[k] = res[k];
        }

        return item.styles;
    };

    $scope.itemBgStyles = function (item, entity) {
        var obj = entity.attributes || entity;

        if (!obj.bgStyles) {
            var bg, styles = {};

            if ('bgOpacity' in item) {
                styles.opacity = parseFieldValue(item.bgOpacity, item, entity);
            }

            if (item.bg) {
                bg = parseFieldValue(item.bg, item, entity);

                if (bg) styles.backgroundImage = 'url(' + bg + ')';
            } else if (item.bgSuffix) {
                bg = parseFieldValue(item.bgSuffix, item, entity);

                if (bg) styles.backgroundImage = 'url(' + CONFIG.serverUrl + bg + ')';
            }

            obj.bgStyles = styles;
        }

        return obj.bgStyles;
    };

    $scope.changeInputStyle = function (style) {
        var jsonarray = document.getElementsByClassName("add-tile-tree");
        var treearray = document.getElementsByClassName("add-tile-code");
        if (style === 'tree') {
            for (var i = 0; i < jsonarray.length; i++) {
                jsonarray[i].classList.add('active');
            }

            for (var i = 0; i < treearray.length; i++) {
                treearray[i].classList.remove('active');
            }
            $scope.jsonStringData = convertToString($scope.jsonData);
        } else {
            for (var i = 0; i < jsonarray.length; i++) {
                jsonarray[i].classList.remove('active');
            }

            for (var i = 0; i < treearray.length; i++) {
                treearray[i].classList.add('active');
            }
        }
        //  $scope.jsonInput = style === 'json';
    };

    $scope.itemClasses = function (item) {

        var entity = $scope.getItemEntity(item);
        if (typeof entity.state === "undefined") entity.state = "";

        if (!item._classes) {
            item._classes = [];
        }

        item._classes.length = 0;

        item._classes.push('-' + item.type);
        item._classes.push('-' + escapeClass(entity.state));

        if (item.theme) item._classes.push('-th-' + item.theme);
        else item._classes.push('-th-' + item.type);

        if (item.classes) item.classes.forEach(function (c) {
            item._classes.push(c);
        });

        if (item.loading) item._classes.push('-loading');
        if ($scope.selectOpened(item)) item._classes.push('-top-entity');

        return item._classes;
    };

    $scope.entityState = function (item, entity) {
        if (item.state === false) return null;

        var res;

        if (item.state) {
            if (typeof item.state === "string") {
                return parseString(item.state, entity);
            } else if (typeof item.state === "function") {
                res = callFunction(item.state, [item, entity]);
                if (res) return res;
            }
        }

        if (item.states) {
            if (typeof item.states === "function") {
                res = callFunction(item.states, [item, entity]);
            } else if (typeof item.states === "object") {
                res = item.states[entity.state] || entity.state;
            }

            if (res) return res;
        }

        if (!item.state) return entity.state;

        return item.state;
    };

    $scope.entityIcon = function (item, entity) {
        var state = entity.state;


        if (typeof item.property !== "undefined") {


            if (entity.type == "relay") {
                if (objs[item.id.name][item.property] == 1) {
                    state = "on";
                    entity.state = state;
                }
                if (objs[item.id.name][item.property] == 0) {
                    state = "off";
                    entity.state = state;
                }
            }

            if (typeof objs[item.id.name] != "undefined")
                delete  objs[item.id.name][item.property];
        } else {
            if (typeof item.id === "string") {
                if (entity.type == "relay") {
                    if (entity.status == 1) state = "on"; else state = "off";
                }
            }
        }


        if (item.icon) {
            state = parseFieldValue(item.icon, item, entity);
        }

        if (!item.icons) return state;

        if (typeof item.icons === "function") {
            return callFunction(item.icons, [item, entity]);
        }

        return item.icons[state] || null;
    };

    $scope.entityTitle = function (item, entity) {
        if (!('title' in item)) {
            return entity.attributes ? entity.attributes.friendly_name : null;
        }

        return getItemFieldValue('title', item, entity);
    };

    $scope.itemField = function (field, item, entity) {
        return getItemFieldValue(field, item, entity);
    };

    $scope.entityUnit = function (item, entity) {
        if (!('unit' in item)) {
            return entity.attributes ? entity.attributes.unit_of_measurement : null;
        }

        return getItemFieldValue('unit', item, entity);
    };

    $scope.entitySubtitle = function (item, entity) {
        return getItemFieldValue('subtitle', item, entity);
    };


    $scope.entityValueTermostat = function (item, entity, property) {
        $scope.ecoTemp=entity[property];
        if (typeof entity[property]!=="undefined") {
            return entity[property];
        }
        return "";
    }

    $scope.entityValue = function (item, entity) {

        var value = entity.state;
        if (entity.value) {
            value = entity.value;
            entity.state = entity.value;
        }
        if (item.value) {
            value = getItemFieldValue('value', item, entity);
        }

        if (typeof item.property !== "undefined") {

            if (item.type == "sensor")
                value = objs[item.id.name][item.property];
            if (item.type == "slider") {

                if (objs[item.id.name][item.property] != null) {

                    entity.state = objs[item.id.name][item.property];
                    if (typeof entity.attributes !== "undefined")
                        entity.attributes._c.value = Number(objs[item.id.name][item.property]);
                    delete  objs[item.id.name][item.property];
                }
                value = entity.state;

            }
            if (item.type == "switch")
                if (objs[item.id.name][item.property] == 1) value = "on"; else value = "off";

        } else {
            if (typeof item.id === "string") {
                if (entity.type == "relay") {
                    if (entity.status == 1) value = "on"; else value = "off";
                }
                if (entity.type == "dimmer") {
                    value = entity.level;

                }
            }
        }
        if (typeof item.filter === "function") {
            return callFunction(item.filter, [value, item, entity]);
        }

        return value;
    };

    $scope.climateTarget = function (item, entity) {
        var value = entity.attributes.temperature || [
            entity.attributes.target_temp_low,
            entity.attributes.target_temp_high
        ].join(" - ");

        if (item.filter) return item.filter(value);

        return value;
    };

    $scope.listField = function (field, item, list) {
        var value = parseFieldValue(list[field], item, list);

        if (typeof item.filter === "function") {
            return callFunction(item.filter, [value, field, item]);
        }

        return value;
    };

    $scope.getWeatherField = function (field, item, entity) {
        var fields = item.fields;

        if (!fields || !fields[field]) return null;

        return parseFieldValue(fields[field], item, entity);
    };

    $scope.getWeatherLine = function (line, item, entity) {
        if (!line) return null;

        return parseFieldValue(line, item, entity);
    };

    $scope.getWeatherIcon = function (item, entity) {
        var icon;

        if (item.icon || item.icons) {
            icon = $scope.entityIcon(item, entity);
        }

        if (!icon) {
            icon = $scope.getWeatherField('icon', item, entity);

            if (icon) console.warn(
                "`icon` field inside fields is deprecated for WEATHER tile, " +
                "please move it to the tile object");
        }

        if (!icon) return null;

        var map = item.icons;

        if (!map && item.fields.iconMap) {
            map = item.fields.iconMap;

            if (icon) console.warn(
                "`iconMap` field inside fields is deprecated for WEATHER tile, " +
                "please move it to the tile object as `icons`");
        }

        if (typeof map === "function") return callFunction(map, [icon, item, entity]);

        if (!map) return icon;

        return map[icon] || icon;
    };

    $scope.getWeatherImageStyles = function (item, entity) {
        if (!item.iconImage) return null;

        var iconImage = parseFieldValue(item.iconImage, item, entity);

        if (typeof item.icons === "function") {
            iconImage = callFunction(item.icons, [iconImage, item, entity]);
        }

        if (item.icons && (iconImage in item.icons)) {
            iconImage = item.icons[iconImage];
        }

        if (!iconImage) return null;

        if (!item._imgStyles) item._imgStyles = {};

        item._imgStyles['backgroundImage'] = 'url("' + iconImage + '")';

        return item._imgStyles;
    };

    $scope.weatherListField = function (field, line, item, entity) {
        if (!line || !line[field]) return null;

        return parseFieldValue(line[field], item, entity);
    };

    $scope.weatherListIcon = function (line, item, entity) {
        var icon = $scope.weatherListField('icon', line, item, entity);

        if (!icon) return null;

        if (typeof item.icons === "function") {
            return callFunction(item.icons, [icon, item, entity]);
        }

        if (!item.icons) return icon;

        return item.icons[icon] || icon;
    };

    $scope.weatherListImageStyles = function (line, item, entity) {
        var iconImage = $scope.weatherListField('iconImage', line, item, entity);

        if (!iconImage) return null;

        if (typeof item.icons === "function") {
            iconImage = callFunction(item.icons, [iconImage, item, entity]);
        }

        if (item.icons && (iconImage in item.icons)) {
            iconImage = item.icons[iconImage];
        }

        if (!iconImage) return null;

        if (!line._imgStyles) line._imgStyles = {};

        line._imgStyles['backgroundImage'] = 'url("' + iconImage + '")';

        return line._imgStyles;
    };

    $scope.slidesStyles = function (item, $index) {
        if (!item.slidesStyles) {
            item.slidesStyles = {
                'animation-delay': ((item.slidesDelay || $index * 0.8)) + 's'
            };

            if ('bgOpacity' in item) {
                item.slidesStyles.opacity = item.bgOpacity;
            }
        }

        return item.slidesStyles;
    };

    $scope.slideStyles = function (slide, item, entity) {
        if (!slide.slideStyles) {
            var styles = {};

            if (slide.bg) {
                var bg = parseFieldValue(slide.bg, item, entity);

                if (bg) styles.backgroundImage = 'url(' + bg + ')';
            }

            slide.slideStyles = styles;
        }

        return slide.slideStyles;
    };

    $scope.itemSelectStyles = function (entity, items) {
        if (!entity.itemSelectStyles) {
            var styles = {};

            if (items) {
                // magic numbers
                styles.marginTop = (-Math.min(items.length * 17, 180)) + 'px';
            }

            entity.itemSelectStyles = styles;
        }

        return entity.itemSelectStyles;
    };

    $scope.getMainStyles = function () {
        return mainStyles;
    };

    $scope.getHeader = function (page) {
        if (!page) {
            if (CONFIG.header.left.length > 0 || CONFIG.header.right.length > 0) {
                return CONFIG.header;
            } else {
                return false;
            }
            return CONFIG.header;
        }
        if (typeof page.header == "undefined") return false;


    };

    $scope.getSliderConf = function (item, entity) {
        var key = "_c";

        if (!entity.attributes) entity.attributes = {};
        if (entity.attributes[key]) return entity.attributes[key];

        var def = item.slider || {};
        var attrs = entity.attributes || {};

        entity.attributes[key] = {
            max: attrs.max || def.max || 100,
            min: attrs.min || def.min || 0,
            step: attrs.step || def.step || 1,
            value: +entity.state || def.value || 0,
            request: def.request || {
                type: "call_service",
                domain: "input_number",
                service: "set_value",
                field: "value"
            }
        };

        setTimeout(function () {
            item._sliderInited = true;
        }, 50);

        return entity.attributes[key];
    };

    $scope.getLightSliderConf = function (slider, entity) {
        var key = "_c_" + slider.field;

        if (!entity.attributes) entity.attributes = {};
        if (entity.attributes[key]) return entity.attributes[key];


        var def = slider || {};
        var attrs = entity.attributes;
        var value = +attrs[def.field] || 0;

        entity.attributes[key] = {
            max: def.max || attrs.max || 100,
            min: def.min || attrs.min || 0,
            step: def.step || attrs.step || 1,
            value: value || def.min || attrs.min || 0,
            request: def.request || {
                type: "call_service",
                domain: "input_number",
                service: "set_value",
                field: "value"
            }
        };

        setTimeout(function () {
            entity.attributes._sliderInited = true;
            slider._sliderInited = true;
        }, 100);

        setTimeout(function () {
            entity.attributes._sliderInited = true;
        }, 0);

        return entity.attributes[key];
    };

    $scope.getVolumeConf = function (item, entity) {
        if (!entity.attributes) entity.attributes = {};
        if (entity.attributes._c) return entity.attributes._c;

        var def = {
            max: 100,
            min: 0,
            step: 2
        };
        var attrs = entity.attributes;
        var value = attrs.volume_level * 100 || 0;

        //if (!('volume_level' in attrs)) return false;

        entity.attributes._c = {
            max: attrs.max || def.max || 100,
            min: attrs.min || def.min || 0,
            step: attrs.step || def.step || 1,
            value: value || 0
        };

        setTimeout(function () {
            entity.attributes._sliderInited = true;
        }, 50);

        return entity.attributes._c;
    };

    $scope.getLightSliderValue = function (slider, conf) {
        if (slider.formatValue) return slider.formatValue(conf);

        return conf.value;
    };

    $scope.openLightSliders = function (item, entity) {
        if (entity.state !== "on") {
            return $scope.toggleSwitch(item, entity, function () {
                setTimeout(function () {
                    if (entity.state === "on") {
                        $scope.openLightSliders(item, entity);
                        updateView();
                    }
                }, 0);
            })
        } else {
            if (!item.controlsEnabled) {
                item.controlsEnabled = true;

                setTimeout(function () {
                    item._controlsInited = true;
                }, 50);

                updateView();
            }
        }
    };

    $scope.closeLightSliders = function ($event, item, entity) {
        $event.preventDefault();
        $event.stopPropagation();

        item.controlsEnabled = false;
        item._controlsInited = false;

        return false;
    };

    $scope.preventClick = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        return false;
    };

    $scope.supportsFeature = function (feature, entity) {
        /*   if (!('supported_features' in entity.attributes)) {
               return false;
           }

           var features = entity.attributes.supported_features;

           return (features | feature) === features;*/
    };

    $scope.shouldShowVolumeSlider = function (entity) {
        return true;
        //  return $scope.supportsFeature(FEATURES.MEDIA_PLAYER.VOLUME_SET, entity) &&
        //    ('volume_level' in entity.attributes) &&
        //  entity.state !== 'off';
    };

    $scope.shouldShowVolumeButtons = function (entity) {
        return true;
        // return (!$scope.supportsFeature(FEATURES.MEDIA_PLAYER.VOLUME_SET, entity) ||
        //  !('volume_level' in entity.attributes)) &&
        //    $scope.supportsFeature(FEATURES.MEDIA_PLAYER.VOLUME_STEP, entity) &&
        //   entity.state !== 'off';
    };


    // Actions

    var setSliderValue = debounce(setSliderValueFn, 0);

    function setSliderValueFn(item, entity, value) {
        entity.state = value.value;
        if (item.action && typeof item.action === "function")
            if (!callFunction(item.action, [item, entity])) {
                entity.attributes._c.value = entity.state;
                return;
            }

        if (!value.request) return;
        sendItemData(item, entity);


        // sendItemData(item, {
        //     type: conf.type,
        //     domain: conf.domain,
        //     service: conf.service,
        //     service_data: serviceData
        // });
    }

    $scope.sliderChanged = function (item, entity, value) {
        if (!item._sliderInited) return;

        setSliderValue(item, entity, value, true);
    };

    $scope.volumeChanged = function (item, entity, conf) {
        // if (!entity.attributes._sliderInited) return;

        var value = {
            value: conf.value / 100,
            request: {
                type: "call_service",
                domain: "media_player",
                service: "volume_set",
                field: "volume_level"
            }
        };

        setSliderValue(item, entity, value, false);
    };

    $scope.lightSliderChanged = function (slider, item, entity, value) {
        if (!item._controlsInited) return;
        if (!slider._sliderInited) return;
        if (!entity.attributes._sliderInited) return;

        setSliderValue(item, entity, value, false);
    };

    $scope.toggleSwitch = function (item, entity, callback) {
        if (item.action && typeof item.action === "function")
            callFunction(item.action, [item, entity]);

        if (entity.state === "off") entity.state = "on";
        else if (entity.state === "on") entity.state = "off";

        sendItemData(item, entity);
    };
    $scope.toggleEdit = function (item) {
        $scope.editingMode = !$scope.editingMode;
        editingMode = $scope.editingMode;
    };


    $scope.saveConfig = function () {


        // delete CONFIG.pages.splice(CONFIG.pageSettingIndex-1,1);
        delete CONFIG.tile;

        var xhr = new XMLHttpRequest();

        xhr.open('POST', '/sboard/json.php');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(CONFIG));
        //CONFIG.pageSettingIndex=CONFIG.pages.push($scope.pageSetting);
        xhr.onreadystatechange = function () {
            if (xhr.status === 200) {

                $scope.toggleEdit(null);
                updateView();
            }
        };
        // $scope.editingMode = !$scope.editingMode;
    };


    saveConfigAction = function () {
        var xhr = new XMLHttpRequest();

        xhr.open('POST', '/sboard/json.php');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(CONFIG));

        xhr.onreadystatechange = function () {
            if (xhr.status === 200 && xhr.readyState == 4) {
                getJsonConfig();
            }
        };

        //$scope.getBodyClass();
        // $scope.editingMode = !$scope.editingMode;
    };

    $scope.openAddTilePopup = function (group) {
        $scope.selectedItem = group;
        $scope.changeTileType($scope.selectedType, group);
        $scope.addTile = true;
        $scope.changeInputStyle('json');
        $scope.objJson.data = $scope.jsonData;

    };

    $scope.openAddGroupPopup = function () {
        $scope.groupName = "";
        $scope.addGroup = true;
    };

    $scope.openAddPagePopup = function () {
        $scope.pageTitle = "";
        $scope.pageBg.img = "";
        $scope.pageIcon.Icon = "";
        $scope.addPage = true;
    };
    $scope.openAddAutoPagePopup = function () {
        $scope.pageTitle = "";
        $scope.pageBg.img = "";
        $scope.pageIcon.Icon = "";
        $scope.addAutoPage = true;

        getJSON('/api.php/rooms/', function (err, data) {
            if (typeof (data.rooms) === "object") {
                $scope.rooms = {};
                for (var room in data.rooms) {
                    $scope.rooms[data.rooms[room].object] = data.rooms[room];
                    $scope.rooms[data.rooms[room].object].devices = {};
                }


                getJSON('/api.php/devices/', function (err, data) {
                    if (err != null) {
                        Noty.addObject({
                            type: Noty.ERROR,
                            title: 'Error',
                            message: 'Something went wrong: ' + err,
                            lifetime: 5
                        });
                    } else {
                        // $scope.rooms[data.devices[dev].linkedRoom].devices={};
                        for (var dev in data.devices) {
                            if (typeof  $scope.rooms[data.devices[dev].linkedRoom] !== "undefined" && $scope.rooms[data.devices[dev].linkedRoom] != "")
                                $scope.rooms[data.devices[dev].linkedRoom].devices[data.devices[dev].object] = data.devices[dev];
                        }


                    }
                });
            }
            updateView();
        });
    };

    $scope.openEditGroupPopup = function (group, parent) {
        $scope.editedGroupIdx = parent.$index;
        $scope.activeGroup = group;
        $scope.groupName = group.title;
        $scope.editGroup = true;
    };

    $scope.openEditPagePopup = function (page, parent) {
        $scope.editedPageIdx = parent.$index;
        $scope.editedPage = page;
        $scope.pageTitle = page.title;
        $scope.pageBg.img = page.bg;
        $scope.pageIcon.Icon = page.icon;
        $scope.editPage = true;
    };

    $scope.openEditTilePopup = function (item) {
        $scope.selectedProperty = null;
        $scope.selectedObject = null;
        $scope.jsonData = item;
        $scope.objJson.data = item;
        $scope.selectedType = item.type;
        if (typeof item.id === "object") {
            if (item.id.name != null) {
                getJSON('/api.php/data/' + item.id.name, function (err, data) {
                    if (typeof (data.data) === "object")
                        $scope.tileDevicePropertyArray = Object.keys(data.data);

                });
            }
        }

        if (typeof item.property !== "undefined") {
            $scope.selectedProperty = item.property;
        } else {
            delete $scope.tileDevicePropertyArray;
        }
        $scope.jsonStringData = convertToString($scope.jsonData);
        $scope.editTile = true;
        $scope.changeInputStyle('json');
    };

    $scope.toggleLock = function (item, entity) {
        if (entity.state === "locked") service = "unlock";
        else if (entity.state === "unlocked") service = "lock";

        if (entity.state === "locked") entity.state = "lock";
        else if (entity.state === "unlocked") entity.state = "unlock";

        // sendItemData(item, {
        //     type: "call_service",
        //     domain: "lock",
        //     service: service,
        //     service_data: {
        //         entity_id: item.id
        //     }
        // });
    };

    $scope.toggleVacuum = function (item, entity) {
        if (entity.state === "off") service = "turn_on";
        else if (entity.state === "on") service = "turn_off";
        else if (['idle', 'docked', 'paused'].indexOf(entity.state) !== -1) {
            service = "start";
        } else if (entity.state === "cleaning") service = "return_to_base";

        if (entity.state === "off") entity.state = "on";
        else if (entity.state === "on") entity.state = "off";
        else if (['idle', 'docked', 'paused'].indexOf(entity.state) !== -1) {
            entity.state = "start";
        } else if (entity.state === "cleaning") entity.state = "return";

        // sendItemData(item, {
        //     type: "call_service",
        //     domain: "vacuum",
        //     service: service,
        //     service_data: {
        //         entity_id: item.id
        //     }
        // });
    };

    $scope.triggerAutomation = function (item, entity) {
        // sendItemData(item, {
        //     type: "call_service",
        //     domain: "automation",
        //     service: "trigger",
        //     service_data: {
        //         entity_id: item.id
        //     }
        // });
    };

    $scope.customTileAction = function (item, entity) {
        if (item.action && typeof item.action === "function") {
            callFunction(item.action, [item, entity]);
        }
    };

    $scope.sendPlayer = function (service, item, entity) {
        // sendItemData(item, {
        //     type: "call_service",
        //     domain: "media_player",
        //     service: service,
        //     service_data: {
        //         entity_id: item.id
        //     }
        // });
    };

    $scope.mutePlayer = function (muteState, item, entity) {
        // sendItemData(item, {
        //     type: "call_service",
        //     domain: "media_player",
        //     service: "volume_mute",
        //     service_data: {
        //         entity_id: item.id,
        //         is_volume_muted: muteState
        //     }
        // });
    };

    $scope.callScript = function (item, entity) {
        // sendItemData(item, {
        //     type: "call_service",
        //     domain: "script",
        //     service: "turn_on",
        //     service_data: {
        //         entity_id: item.id
        //     }
        // });
    };

    $scope.callScene = function (item, entity) {
        // sendItemData(item, {
        //     type: "call_service",
        //     domain: "scene",
        //     service: "turn_on",
        //     service_data: {
        //         entity_id: item.id
        //     }
        // });
    };

    $scope.increaseBrightness = function ($event, item, entity) {
        $event.preventDefault();
        $event.stopPropagation();

        if (entity.state === "off") return false;

        if (!('brightness' in entity.attributes)) {
            return addError("No brightness field in object");
        }

        var brightness = +entity.attributes.brightness + 25.5;

        brightness = Math.min(brightness, 255);

        $scope.setLightBrightness(item, brightness);

        return false;
    };

    $scope.decreaseBrightness = function ($event, item, entity) {
        $event.preventDefault();
        $event.stopPropagation();

        if (entity.state === "off") return false;

        if (!('brightness' in entity.attributes)) {
            return addError("No brightness field in object");
        }

        var brightness = +entity.attributes.brightness - 25.5;

        brightness = Math.max(brightness, 1);

        $scope.setLightBrightness(item, brightness);

        return false;
    };

    $scope.increaseNumber = function ($event, item, entity) {
        $event.preventDefault();
        $event.stopPropagation();

        var value = parseFloat(entity.state);

        value += (entity.attributes.step || 1);

        if (entity.attributes.max) {
            value = Math.min(value, entity.attributes.max);
        }

        $scope.setInputNumber(item, value);

        return false;
    };

    $scope.decreaseNumber = function ($event, item, entity) {
        $event.preventDefault();
        $event.stopPropagation();

        var value = parseFloat(entity.state);

        value -= (entity.attributes.step || 1);

        if (entity.attributes.min) {
            value = Math.max(value, entity.attributes.min);
        }

        $scope.setInputNumber(item, value);

        return false;
    };

    $scope.setLightBrightness = function (item, brightness) {
        if (item.loading) return;

        // sendItemData(item, {
        //     type: "call_service",
        //     domain: "light",
        //     service: "turn_on",
        //     service_data: {
        //         entity_id: item.id,
        //         brightness_pct: Math.round(brightness / 255 * 100 / 10) * 10
        //     }
        // });
    };

    $scope.setInputNumber = function (item, value) {
        if (item.loading) return;
        item.value = value;
        if (item.action && typeof item.action === "function")
            if (!callFunction(item.action, [item]))
                return;

        // sendItemData(item, {
        //     type: "call_service",
        //     domain: "input_number",
        //     service: "set_value",
        //     service_data: {
        //         entity_id: item.id,
        //         value: value
        //     }
        // });
    };

    $scope.setSelectOption = function ($event, item, entity, option) {
        item.value = option;
        if (item.action && typeof item.action === "function")
            if (!callFunction(item.action, [item, entity]))
                return;


        $event.preventDefault();
        $event.stopPropagation();

        // sendItemData(item, {
        //     type: "call_service",
        //     domain: "input_select",
        //     service: "select_option",
        //     service_data: {
        //         entity_id: item.id,
        //         option: option
        //     }
        // });

        $scope.closeActiveSelect();

        return false;
    };

    $scope.setSourcePlayer = function ($event, item, entity, option) {
        $event.preventDefault();
        $event.stopPropagation();

        // sendItemData(item, {
        //     type: "call_service",
        //     domain: "media_player",
        //     service: "select_source",
        //     service_data: {
        //         entity_id: item.id,
        //         source: option
        //     }
        // });

        $scope.closeActiveSelect();

        return false;
    };

    $scope.setClimateOption = function ($event, item, entity, option) {
        $event.preventDefault();
        $event.stopPropagation();

        // sendItemData(item, {
        //     type: "call_service",
        //     domain: "climate",
        //     service: "set_operation_mode",
        //     service_data: {
        //         entity_id: item.id,
        //         operation_mode: option
        //     }
        // });

        $scope.closeActiveSelect();

        return false;
    };


    $scope.increaseClimateTemp = function ($event, item, entity) {
        $event.preventDefault();
        $event.stopPropagation();

        var value = parseFloat(entity.attributes.temperature);

        value += (entity.attributes.target_temp_step || 1);

        if (entity.attributes.max_temp) {
            value = Math.min(value, entity.attributes.max_temp);
        }

        $scope.setClimateTemp(item, value);

        return false;
    };

    $scope.decreaseClimateTemp = function ($event, item, entity) {
        $event.preventDefault();
        $event.stopPropagation();

        var value = parseFloat(entity.attributes.temperature);

        value -= (entity.attributes.target_temp_step || 1);

        if (entity.attributes.min_temp) {
            value = Math.max(value, entity.attributes.min_temp);
        }

        $scope.setClimateTemp(item, value);

        return false;
    };

    $scope.setClimateTemp = function (item, value) {
        // sendItemData(item, {
        //     type: "call_service",
        //     domain: "climate",
        //     service: "set_temperature",
        //     service_data: {
        //         entity_id: item.id,
        //         temperature: value
        //     }
        // });
    };

    $scope.sendCover = function (service, item, entity) {
        // sendItemData(item, {
        //     type: "call_service",
        //     domain: "cover",
        //     service: service,
        //     service_data: {
        //         entity_id: item.id
        //     }
        // });
    };

    $scope.toggleCover = function (item, entity) {
        if (entity.state === "open") service = "close_cover";
        else if (entity.state === "closed") service = "open_cover";

        $scope.sendCover(service, item, entity);
    };

    $scope.openFanSpeedSelect = function ($event, item) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.openSelect(item);
    };

    $scope.setFanSpeed = function ($event, item, entity, option) {
        $event.preventDefault();
        $event.stopPropagation();

        // sendItemData(item, {
        //     type: "call_service",
        //     domain: "fan",
        //     service: "set_speed",
        //     service_data: {
        //         entity_id: item.id,
        //         speed: option
        //     }
        // });

        $scope.closeActiveSelect();

        return false;
    };

    $scope.actionAlarm = function (action, item, entity) {
        var code = $scope.alarmCode;
        entity.state = action;
        if (action === 'alarm_arm_home') entity.state = 'armed_home'
        else if (action === 'alarm_arm_away') entity.state = 'armed_away'
        else if (action === 'alarm_disarm') entity.state = 'disarmed'
        else entity.state = action

        var data = {
            entity_id: item.id
        };

        if (code) data.code = code;

        latestAlarmActions[item.id] = Date.now();

        // sendItemData(item, {
        //     type: "call_service",
        //     domain: "alarm_control_panel",
        //     service: action,
        //     service_data: data
        // });

        $scope.alarmCode = null;
    };


    // UI

    $scope.openPage = function (page, parent, preventAnimation) {
        if ($scope.editingMode) {
            $scope.openEditPagePopup(page, parent);
            return;
        }
        localStorage.setItem('page', $scope.pages.indexOf(page));
        preventAnimation = preventAnimation || false;
        showedPages = [];

        if (activePage) {
            showedPages = [activePage]
        }

        showedPages.push(page);

        activePage = page;
        $scope.activePage = activePage;
        $scope.selectedItem = activePage.groups[0];

        if (CONFIG.transition === TRANSITIONS.SIMPLE) {
            scrollToActivePage();
        } else {
            setTimeout(function () {
                scrollToActivePage(preventAnimation);
            }, 20);
        }
        if (CONFIG.rememberLastPage) {
            $location.hash($scope.pages.indexOf(page));
        }
    };
    $scope.openPageSetting = function (page, parent, preventAnimation) {

        localStorage.setItem('page', $scope.pages.length + $scope.pagesSetting.indexOf(page));
        preventAnimation = preventAnimation || false;
        showedPages = [];

        if (activePage) {
            showedPages = [activePage]
        }

        showedPages.push(page);

        activePage = page;
        $scope.activePage = activePage;
        $scope.selectedItem = activePage.groups[0];

        if (CONFIG.transition === TRANSITIONS.SIMPLE) {
            scrollToActivePageSetting();
        } else {
            setTimeout(function () {
                scrollToActivePageSetting(preventAnimation);
            }, 20);
        }
        if (CONFIG.rememberLastPage) {
            $location.hash($scope.pages.indexOf(page));
        }
    };

    $scope.openCamera = function (item) {
        $scope.activeCamera = item;
    };

    $scope.closeCamera = function () {
        $scope.activeCamera = null;
    };

    $scope.openDatetime = function (item, entity) {
        $scope.activeDatetime = item;

        if (entity.attributes && entity.attributes.has_date) {
            var d = new Date();

            $scope.datetimeString = d.getFullYear() + "";
            $scope.datetimeString += leadZero(d.getMonth());
            $scope.datetimeString += leadZero(d.getDate());
        }
    };

    $scope.closeDatetime = function () {
        $scope.activeDatetime = null;
        $scope.datetimeString = null;
    };

    $scope.closeDoorEntry = function () {
        $scope.activeDoorEntry = null;

        if (doorEntryTimeout) clearTimeout(doorEntryTimeout);
    };

    $scope.openDoorEntry = function (item, entity) {
        $scope.activeDoorEntry = item;

        if (doorEntryTimeout) clearTimeout(doorEntryTimeout);

        if (CONFIG.doorEntryTimeout) {
            doorEntryTimeout = setTimeout(function () {
                $scope.closeDoorEntry();

                updateView();
            }, CONFIG.doorEntryTimeout * 1000);
        }
    };

    $scope.openAlarm = function (item) {
        $scope.activeAlarm = item;
        $scope.alarmCode = null;
    };

    $scope.closeAlarm = function () {
        $scope.activeAlarm = null;
        $scope.alarmCode = null;
    };

    $scope.closeAddTile = function () {
        $scope.addTile = false;
    };

    $scope.closeAddGroup = function () {
        $scope.addGroup = false;
    };

    $scope.closeAddPage = function () {
        $scope.addPage = false;
        $scope.editPage = false;
    };
    $scope.closeAddAutoPage = function () {
        $scope.addAutoPage = false;
    };
    $scope.closeEditGroup = function () {
        $scope.editGroup = false;
    };

    $scope.closeEditPage = function () {
        $scope.editPage = false;
    };

    $scope.closeEditTile = function () {
        $scope.editTile = false;
    };
    $scope.closeEditConfig = function () {
        $scope.editConfig = false;
    };

    $scope.addNewTile = function (tile, group) {
        if (!$scope.jsonData) {
            Noty.addObject({
                type: Noty.ERROR,
                title: 'Error',
                message: 'Incorrect JSON',
                lifetime: 5
            });
            return;
        }

        group.items.push(Object.assign({}, $scope.jsonData));
        updateView();
        recalculateGroupSize();
        $scope.addTile = false;
        $scope.editTile = false;

    };

    $scope.addNewGroup = function (name) {
        if (name.length > 0) {
            a = {
                title: name,
                width: 1,
                height: 3,
                items: []
            };
            $scope.activePage.groups.push(a);
            recalculateGroupSize();
            $scope.addGroup = false;
            $scope.editGroup = false;
        } else {
            Noty.addObject({
                type: Noty.ERROR,
                title: 'Error',
                message: 'Incorrect group name',
                lifetime: 5
            });
        }
    };

    $scope.addNewPage = function (pageTitle, pageBg, pageIcon) {
        if (pageTitle.length == 0) {
            Noty.addObject({
                type: Noty.ERROR,
                title: 'Error',
                message: 'Incorrect group name',
                lifetime: 5
            });
            return;
        }
        if (pageBg.img.length == 0) {
            Noty.addObject({
                type: Noty.ERROR,
                title: 'Error',
                message: 'Incorrect backgroud',
                lifetime: 5
            });
            return;
        }
        if (pageIcon.Icon.length == 0) {
            Noty.addObject({
                type: Noty.ERROR,
                title: 'Error',
                message: 'Incorrect icon',
                lifetime: 5
            });
            return;
        }
        a = {
            title: pageTitle,
            bg: pageBg.img,
            icon: pageIcon.Icon,
            groups: []
        };
        $scope.pages.push(a);
        recalculateGroupSize();
        $scope.addPage = false;
    };
    $scope.addNewAutoPage = function (pageTitle, pageBg, pageIcon, rooms) {
        if (pageTitle.length == 0) {
            Noty.addObject({
                type: Noty.ERROR,
                title: 'Error',
                message: 'Incorrect group name',
                lifetime: 5
            });
            return;
        }
        if (pageBg.img.length == 0) {
            Noty.addObject({
                type: Noty.ERROR,
                title: 'Error',
                message: 'Incorrect backgroud',
                lifetime: 5
            });
            return;
        }
        if (pageIcon.Icon.length == 0) {
            Noty.addObject({
                type: Noty.ERROR,
                title: 'Error',
                message: 'Incorrect icon',
                lifetime: 5
            });
            return;
        }
        a = {
            title: pageTitle,
            bg: pageBg.img,
            icon: pageIcon.Icon,
            groups: []
        };

        for (var room in rooms) {

            b = {
                "title": rooms[room].title,
                "width": 0, "height": 0,
                "items": []
            };
            for (var dev in rooms[room].devices) {
                if (rooms[room].devices[dev].enabled) {
                    sizes = calcGroupSizes(b);
                    b.width = sizes.width;
                    b.height = sizes.height;
                    obj = {
                        "id": {
                            "id": rooms[room].devices[dev].id,
                            "name": dev,
                        },

                        "state": false,
                        "title": rooms[room].devices[dev].title,

                        "height": 1,
                        "width": 1,
                    };
                    switch (rooms[room].devices[dev].type) {
                        case "dimmer":
                            obj.property = "level";
                            obj.type = "slider";
                            obj.unit = "%";
                            obj.slider = {"max": 100, "min": 0, "step": 1};
                            obj.bottom = true;
                            break;
                        case "sensor_temphum":
                            obj.property = "value";
                            obj.type = "sensor";
                            obj.unit = "C";
                            break;
                        case "relay":
                            obj.property = "status";
                            obj.type = "switch";
                            obj.states = {
                                "on": "On",
                                "off": "Off"
                            };
                            obj.icons = {
                                "on": "mdi-lightbulb-on",
                                "off": "mdi-lightbulb"
                            };
                            break;
                        case "button":
                            obj.property = "status";
                            obj.type = "switch";
                            obj.icon = "mdi-radiobox-blank";
                            break;
                        default:
                            obj.property = "value";
                            obj.type = "sensor";
                    }
                    obj.position = getFirstFreePosition(b)
                    b.items.push(obj);
                }
            }
            if (b.items.length > 0)
                a.groups.push(b);
        }


        $scope.pages.push(a);
        recalculateGroupSize();
        $scope.addAutoPage = false;
    };

    $scope.editExistGroup = function (name) {
        if (name.length > 0) {
            $scope.activeGroup.title = name;
            $scope.editGroup = false;
            $scope.addGroup = false;
        } else {
            Noty.addObject({
                type: Noty.ERROR,
                title: 'Error',
                message: 'Incorrect group name',
                lifetime: 5
            });
        }
    };

    $scope.editExistPage = function (pageTitle, pageBg, pageIcon) {
        if (pageTitle.length == 0) {
            Noty.addObject({
                type: Noty.ERROR,
                title: 'Error',
                message: 'Incorrect group name',
                lifetime: 5
            });
            return;
        }
        if (pageBg.img.length == 0) {
            Noty.addObject({
                type: Noty.ERROR,
                title: 'Error',
                message: 'Incorrect backgroud',
                lifetime: 5
            });
            return;
        }
        if (pageIcon.Icon.length == 0) {
            Noty.addObject({
                type: Noty.ERROR,
                title: 'Error',
                message: 'Incorrect icon',
                lifetime: 5
            });
            return;
        }
        $scope.editedPage.title = pageTitle;
        $scope.editedPage.bg = pageBg.img;
        $scope.editedPage.icon = pageIcon.Icon;
        $scope.editPage = false;
    };

    $scope.removeGroup = function () {
        $scope.activePage.groups.splice($scope.editedGroupIdx, 1);
        $scope.editGroup = false;
    };


    $scope.removePage = function () {
        $scope.pages.splice($scope.editedPageIdx, 1);
        $scope.editPage = false;
    };

    $scope.editExistTile = function (group) {
        if (typeof($scope.jsonData) !== "object") {
            Noty.addObject({
                type: Noty.ERROR,
                title: 'Error',
                message: 'Incorrect JSON',
                lifetime: 5
            });
            return;
        }

        $scope.activePage.groups[$scope.editedGroupIdx].items.splice($scope.editedItemIdx, 1);
        var editedItem = $scope.objJson.data;
        editedItem.styles = null;

        // $scope.activePage.groups[$scope.editedGroupIdx].items.push(editedItem);
        group.items.push(editedItem);
        $scope.editTile = false;
    };
    $scope.editExistConfig = function (conf) {
        if (typeof($scope.cofigJson.data) !== "object") {
            Noty.addObject({
                type: Noty.ERROR,
                title: 'Error',
                message: 'Incorrect JSON',
                lifetime: 5
            });
            return;
        }
        $scope.editConfig = false;
        CONFIG = $scope.cofigJson.data;
        saveConfigAction();

    };


    $scope.removeTile = function () {
        $scope.activePage.groups[$scope.editedGroupIdx].items.splice($scope.editedItemIdx, 1);
        $scope.editTile = false;
    };
    $scope.removeTileClick = function (item, parent) {
        $scope.editedItemIdx = parent.$index;
        $scope.editedGroupIdx = parent.$parent.$parent.$index;
        $scope.activePage.groups[$scope.editedGroupIdx].items.splice($scope.editedItemIdx, 1);
        $scope.editTile = false;

    };
    $scope.removeGroupClick = function (item, parent) {
        $scope.editedGroupIdx = parent.$index;
        $scope.activePage.groups.splice($scope.editedGroupIdx, 1);
        $scope.editGroup = false;

    };


    function convertToObject(html) {
        var obj = null;
        if (typeof html === 'object') {
            for (var k in html) {
                if (html.hasOwnProperty(k)) {
                    html[k] = convertToObject(html[k]);
                }
            }
            return html;
        }
        try {
            obj = JSON.parse(html, function (key, value) {
                if (typeof value === "string" &&
                    value.startsWith("/Function(") &&
                    value.endsWith(")/")) {
                    value = value.substring(10, value.length - 2);
                    return eval("(" + value + ")");
                }
                return value;
            });
        } catch (e) {
            if (typeof html === "string" &&
                html.startsWith("/Function(") &&
                html.endsWith(")/")) {
                html = html.substring(10, html.length - 2);
                return eval("(" + html + ")");
            }
            return html;
        }
        if (obj != null)
            return obj
        else return html;
    }

    function convertToString(object) {
        var a = JSON.parse(JSON.stringify(object, function (key, val) {
            if (typeof val === 'function') {
                return '/Function(' + val + ')/'; // implicitly `toString` it
            }
            return val;
        }));
        return a;
    }

    $scope.getCameraList = function () {
        if (cameraList) return cameraList;

        var res = [];

        $scope.pages.forEach(function (page) {
            (page.groups || []).forEach(function (group) {
                (group.items || []).forEach(function (item) {
                    if ([TYPES.CAMERA, TYPES.CAMERA_THUMBNAIL]
                        .indexOf(item.type) !== -1) {
                        res.push(item);
                    }
                })
            })
        });

        cameraList = res;

        return res;
    };

    function scrollToActivePage(preventAnimation) {
        var index = $scope.pages.indexOf(activePage);
        if (index >= 0) {
        } else {
            var index = $scope.pagesSetting.indexOf(activePage);
        }
        var translate = index * 100;

        var $pages = document.getElementById("pages");

        var transform;

        if (CONFIG.transition === TRANSITIONS.ANIMATED_GPU) {
            transform = 'translate3d(0, -' + translate + '%, 0)';
        } else if (CONFIG.transition === TRANSITIONS.ANIMATED) {
            transform = 'translate(0, -' + translate + '%)';
        } else {
            transform = 'translate(0, -' + translate + '%)';
        }

        $pages.style.transform = transform;

        if (preventAnimation) {
            $pages.style.transition = 'none';

            setTimeout(function () {
                $pages.style.transition = null;
            }, 50);
        }
    }

    function scrollToActivePageSetting(preventAnimation) {
        var index = $scope.pages.length + $scope.pagesSetting.indexOf(activePage);

        var translate = index * 100;

        var $pages = document.getElementById("pages");

        var transform;

        if (CONFIG.transition === TRANSITIONS.ANIMATED_GPU) {
            transform = 'translate3d(0, -' + translate + '%, 0)';
        } else if (CONFIG.transition === TRANSITIONS.ANIMATED) {
            transform = 'translate(0, -' + translate + '%)';
        } else {
            transform = 'translate(0, -' + translate + '%)';
        }

        $pages.style.transform = transform;

        if (preventAnimation) {
            $pages.style.transition = 'none';

            setTimeout(function () {
                $pages.style.transition = null;
            }, 50);
        }
    }

    $scope.isPageActive = function (page) {
        return activePage === page;
    };

    $scope.shouldDrawPage = function (page) {
        if (CONFIG.transition === TRANSITIONS.SIMPLE) {
            return $scope.isPageActive(page);
        }

        return true;
    };

    $scope.isHidden = function (object, entity) {
        if (object == null) return false;
        if (!('hidden' in object)) return false;

        if (typeof object.hidden === "function") {
            return callFunction(object.hidden, [object, entity]);
        }

        return object.hidden;
    };

    $scope.swipeUp = function () {
        var index = $scope.pages.indexOf(activePage);

        if ($scope.pages[index + 1]) {
            $scope.openPage($scope.pages[index + 1]);
        }
    };

    $scope.swipeDown = function () {
        var index = $scope.pages.indexOf(activePage);

        if ($scope.pages[index - 1]) {
            $scope.openPage($scope.pages[index - 1]);
        }
    };

    $scope.toggleSelect = function (item) {
        if ($scope.selectOpened(item)) {
            $scope.closeActiveSelect();
        } else {
            $scope.openSelect(item);
        }
    };

    $scope.openSelect = function (item) {
        $scope.activeSelect = item;
    };

    $scope.closeActiveSelect = function () {
        $scope.activeSelect = null;
    };

    $scope.selectOpened = function (item) {
        return $scope.activeSelect === item;
    };

    $scope.inputAlarm = function (num) {
        $scope.alarmCode = $scope.alarmCode || "";

        $scope.alarmCode += num;
    };

    $scope.clearAlarm = function () {
        $scope.alarmCode = "";
    };

    $scope.sendDatetime = function () {
        if (!$scope.activeDatetimeValid()) return;

        var item = $scope.activeDatetime;
        var entity = $scope.getItemEntity(item);

        var str = $scope.getActiveDatetimeInput();
        var dt = str.split(' ');

        var data = {
            entity_id: item.id
        };

        if (entity.attributes.has_date) data.date = dt[0];
        if (entity.attributes.has_time) data.time = dt[1] || dt[0];

        // sendItemData(item, {
        //     type: "call_service",
        //     domain: "input_datetime",
        //     service: "set_datetime",
        //     service_data: data
        // });
    };

    $scope.inputDatetime = function (num) {
        var entity = $scope.getItemEntity($scope.activeDatetime);

        if (!entity) return;

        var placeholder = getDatetimePlaceholder(entity);

        placeholder = placeholder.replace(/\W/gi, "");

        $scope.datetimeString = $scope.datetimeString || "";

        if ($scope.datetimeString.length >= placeholder.length) return;

        $scope.datetimeString += num;
    };

    $scope.clearCharDatetime = function () {
        if ($scope.datetimeString) {
            $scope.datetimeString = $scope.datetimeString
                .slice(0, $scope.datetimeString.length - 1);
        }
    };

    $scope.getActiveDatetimeInput = function () {
        var entity = $scope.getItemEntity($scope.activeDatetime);
        var placeholder = getDatetimePlaceholder(entity);

        var res = $scope.datetimeString || "";

        var i = 0;

        return placeholder.replace(/\w|\W/gi, function (match, index) {
            if (i >= res.length) return "";

            if (/\W/.test(match)) return match;

            return res[i++];
        });
    };

    $scope.getActiveDatetimePlaceholder = function () {
        var entity = $scope.getItemEntity($scope.activeDatetime);
        var placeholder = getDatetimePlaceholder(entity);

        var dt = $scope.getActiveDatetimeInput() || "";

        return placeholder.slice(dt.length);
    };

    $scope.activeDatetimeValid = function () {
        var entity = $scope.getItemEntity($scope.activeDatetime);

        if (!entity) return false;

        var placeholder = getDatetimePlaceholder(entity);

        placeholder = placeholder.replace(/\W/gi, "");

        $scope.datetimeString = $scope.datetimeString || "";

        return $scope.datetimeString.length === placeholder.length;
    };

    function getDatetimePlaceholder(entity) {
        var res = [];

        if (!entity || !entity.attributes) return null;

        if (entity.attributes.has_date) res.push("YYYY-MM-DD");
        if (entity.attributes.has_time) res.push("hh:mm");

        return res.join(" ");
    }


    angular.element(window).on('view:updated', function () {
        updateView();
    });

    $scope.$watchGroup([
        'activePage.scrolledVertically',
        'activePage.scrolledHorizontally',
    ], updateView);

    function calcGroupSizes(group) {
        var maxWidth = 1;
        var maxHeight = 1;

        for (var i = 0; i < group.items.length; i++) {
            var item = group.items[i];

            maxHeight = Math.max(maxHeight, (item.position ? item.position[1] : 0) + (item.height || 1));
            maxWidth = Math.max(maxWidth, (item.position ? item.position[0] : 0) + (item.width || 1));
        }

        return {
            width: maxWidth,
            height: maxHeight
        }
    }

    function getContext() {
        return {
            states: $scope.states,
            $scope: $scope,
            parseFieldValue: parseFieldValue.bind(this)
        };
    }

    function callFunction(func, args) {
        if (typeof func !== "function") return func;

        return func.apply(getContext(), args || []);
    }


    function getItemFieldValue(field, item, entity) {
        var value = item[field];

        return parseFieldValue(value, item, entity);
    }

    function parseFieldValue(value, item, entity) {
        if (!value) return null;

        if (typeof value === "function") return callFunction(value, [item, entity]);
        if (typeof value === "string") return parseString(value, entity);

        return value;
    }

    function parseVariable(value, entity) {
        if (value[0] === "@") return getObjectAttr(entity, value.slice(1));
        if (value[0] === "&") return getEntityAttr(value.slice(1));

        return value;
    }

    function parseString(value, entity) {
        return value.replace(/([&@][\w\d._]+)/gi, function (match, contents, offset) {
            if (match[0] === "&" && match.split('.').length < 3) return match;

            var res = parseVariable(match, entity);

            if (typeof res === "undefined") {
                if (match === value) return "";

                return match;
            }

            if (res === null) return "";

            return res;
        });
    }

    function escapeClass(text) {
        return text && typeof text === "string" ?
            text.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'non';
    }

    function getEntityAttr(str) {
        var path = str.split('.');

        if (path.length < 3) return;

        var entity = $scope.states[path.slice(0, 2).join('.')] || null;

        return getObjectAttr(entity, path.slice(2).join('.'));
    }

    function getObjectAttr(obj, path) {
        var res = obj;

        path.split('.').forEach(function (key) {
            res = typeof res === 'object' && res ? res[key] : undefined;
        });

        return res;
    }

    function setStates(states) {
        states.forEach(function (state) {
            $scope.states[state.entity_id] = state;
        });
    }

    function setNewState(key, state) {
        if (!$scope.states[key]) $scope.states[key] = state;

        for (var k in state) $scope.states[key][k] = state[k];
    }

    function checkStatesTriggers(key, state) {
        checkAlarmState(key, state);
    }

    function checkAlarmState(key, state) {
        if (key in latestAlarmActions) {
            var ts = latestAlarmActions[key];

            if (Date.now() - ts < 3000) {
                $scope.closeAlarm();
                updateView();
            }
        }
    }

    function triggerEvents(eventData) {
        if (!CONFIG.events) return;

        CONFIG.events.forEach(function (event) {
            if (eventData.command !== event.command) return;

            if (typeof event.action === "function") {
                callFunction(event.action, [eventData]);
            }
        });
    }

    function handleMessage(data) {
        if (data.type === "event") handleEvent(data.event);
    }

    function handleEvent(event) {
        try {
            if (event.event_type === "state_changed") {
                debugLog('state change', event.data.entity_id, event.data.new_state);

                setNewState(event.data.entity_id, event.data.new_state);
                checkStatesTriggers(event.data.entity_id, event.data.new_state);
            } else if (event.event_type === "tileboard") {
                debugLog('tileboard', event.data);

                triggerEvents(event.data);
            }
        } catch (e) {
            console.error(e);
        }
        updateView();
    }

    function addError(error) {
        if (!CONFIG.ignoreErrors) Noty.addObject({
            type: Noty.ERROR,
            title: 'Error',
            message: error,
            lifetime: 10
        });
    }

    function warnUnknownItem(item) {
        if (!CONFIG.ignoreErrors) Noty.addObject({
            type: Noty.WARNING,
            title: 'Entity not found',
            message: 'Entity id="' + item.id + '" not found, title="' + item.title + '"',
            id: Math.floor(Math.random() * (999999))
        });
    }

    function debugLog() {
        if (CONFIG.debug) {
            console.log.apply(console, [].slice.call(arguments));
        }
    }

    function updateView() {
        if (!$scope.$$phase) $scope.$digest();
    }

    window.openPage = function (page) {
        $scope.openPage(page);
        updateView();
    };


    $.subscribe('wsConnected', function (_) {
        // clearTimeout(httpRefreshTimer);
        subscribeToDevices();
    });
    $.subscribe('wsData', function (_, response) {
        if (response.action == 'subscribed') {
            console.log('Subscription to devices confirmed.');
            clearInterval(subscribedWebSocketsTimer);
            subscribedWebSockets = 1;
        }
        if (response.action == 'properties') {
            var obj = jQuery.parseJSON(response.data);
            if (typeof obj != 'object') return false;
            var objCnt = obj.length;
            if (objCnt) {
                for (var i = 0; i < objCnt; i++) {
                    var pr_arr = obj[i].PROPERTY.split('.');
                    objs[pr_arr[0]][pr_arr[1]] = obj[i].VALUE;
                }
            }
            updateView();
        }
        if (response.action == 'devices_data') {
            var obj = jQuery.parseJSON(response.data);
            if (typeof obj.DATA != 'object') return false;
            var objCnt = obj.DATA.length;
            if (objCnt) {
                for (var i = 0; i < objCnt; i++) {
                    setObj(obj.DATA[i]);
                }
            }
        }
    });

    function setObj(data) {

        if (data.type == "relay") {
            // if (data.status==1) data.state="on"; else data.state="off";
        }
        if (data.type == "dimmer") {
            //     data.state=data.level;

        }
        objs[data.object] = data;
        updateView();
    }

    function startWebSockets() {
        var loc = window.location, new_uri;
        var serverUrl = '';
        if (loc.protocol === "https:") {
            serverUrl = "wss:";
        } else {
            serverUrl = "ws:";
        }
        serverUrl += "//" + loc.hostname + ":8001/majordomo";
        try {
            console.log('Conneting to ' + serverUrl);
            if (window.MozWebSocket) {
                wsSocket = new MozWebSocket(serverUrl);
            } else if (window.WebSocket) {
                wsSocket = new WebSocket(serverUrl);
            }

        } catch (e) {
            console.log('Failed connecting to ' + serverUrl);
            // httpRefreshDevices();
            return false;
        }
        wsSocket.binaryType = 'blob';
        wsSocket.onopen = function (msg) {
            ///connected
            console.log('WS connected (' + serverUrl + ')');
            startedWebSockets = 1;
            clearTimeout(wsTimer);
            clearInterval(httpRefreshTimer);
            $.publish('wsConnected');
        };
        wsSocket.onmessage = function (msg) {
            console.log('WS data (' + serverUrl + ')');
            var response;
            response = JSON.parse(msg.data);
            console.log('Action: ' + response.action + '; Data: ' + response.data);
            $.publish('wsData', response);
            return;
        };
        wsSocket.onclose = function (msg) {
            //disconnected
            startedWebSockets = 0;
            httpRefreshTimer = setInterval(
                function () {
                    $scope.httpRefreshDevices()
                }, 5000);
            //wsTimer=setTimeout('startWebSockets();', 5*1000);
            $.publish('wsDisconnected', []);
            console.log('WS disconnected (' + serverUrl + ')');
            return;
        };
    }

    function subscribeToDevices() {
        console.log('Sending devices subscription request...');

        if (temp_properties.length > 0) {
            var payload;
            payload = new Object();
            payload.action = 'Subscribe';
            payload.data = new Object();
            payload.data.TYPE = 'properties';
            payload.data.PROPERTIES = temp_properties.join();
            wsSocket.send(JSON.stringify(payload));
        }
        subscribedWebSocketsTimer = setInterval(
            function () {
                subscribeToDevices()
            }, 3000);
        return false;
    }

    $scope.httpRefreshDevices = function () {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/api.php/data/');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({"properties": temp_properties}));
        xhr.onreadystatechange = function () {
            if (xhr.status === 200) {
                if (xhr.response != "") {
                    var obj = jQuery.parseJSON(xhr.response);
                    if (typeof obj != 'object') return false;
                    for (key in obj.data) {
                        var pr_arr = key.split('.');
                        objs[pr_arr[0]][pr_arr[1]] = obj.data[key];
                    }
                }

            }
        };
        updateView();
        return true;
        // httpRefreshTimer = setTimeout('httpRefreshDevices()',3000);
    }

    function sendItemData(item, entity) {

        var xhr = new XMLHttpRequest();
        if (typeof item.id === "object")
            var device = item.id.name;
        else
            var device = item.id;

        if (item.type == "slider") {
            var json = JSON.stringify({
                data: entity.state,
            });
            xhr.open('POST', '/api.php/data/' + device + '.level', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.send(json);
        }
        if (item.type == "switch") {
            if (entity.state == "off")
                xhr.open('GET', '/api.php/method/' + device + '.turnOff', true);
            else
                xhr.open('GET', '/api.php/method/' + device + '.turnOn', true);
            xhr.send();
        }
        xhr.onreadystatechange = function () {
            if (xhr.status === 200 && xhr.readyState == 4) {

            }
        }
    }


});
