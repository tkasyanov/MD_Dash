<!doctype html>
<html lang="en" ng-app="App">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="referrer" content="no-referrer"/>
    <title>Sboard</title>

    <meta name="mobile-web-app-capable" content="yes">
    <!-- iOS Settings -->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
    <link rel="manifest" href="site.webmanifest">
    <link rel="mask-icon" href="safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="theme-color" content="#ffffff">

    <link rel="stylesheet" href="styles/main.css?v1_2"/>
    <link rel="stylesheet" href="styles/themes.css"/>
    <link rel="stylesheet" href="styles/weather-icons.css"/>
    <link rel="stylesheet" href="styles/font-awesome.min.css"/>
    <link rel="stylesheet" href="styles/add.css?v1_2"/>
    <link rel="stylesheet" href="styles/jsoneditor.min.css"/>
    <link rel="stylesheet" href="styles/angularjs-color-picker.min.css"/>
    <link rel="stylesheet" href="styles/styles.css"/>
    <link rel="stylesheet" href="styles/angular-tooltips.css"/>

    <style>
        [ng-cloak] {
            display: none;
        }
    </style>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1/jquery-ui.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/nvd3/1.8.1/nv.d3.min.css">
    <script src="scripts/vendors/nvd3/d3.js" charset="utf-8"></script>
    <script src="scripts/vendors/nvd3/nv.d3.js"></script>
    <script src="scripts/vendors/angular.min.js"></script>
    <script src="scripts/vendors/jsoneditor.min.js"></script>
    <script src="scripts/vendors/angular-tooltips.js"></script>
    <script src="scripts/vendors/contextMenu.js"></script>
    <script src="scripts/vendors/tinycolor-min.js"></script>
    <script src="scripts/vendors/angularjs-color-picker.min.js"></script>
    <script src="scripts/vendors/ng-jsoneditor.js"></script>
    <script src="scripts/vendors/angular-dragdrop.js"></script>
    <script src="scripts/vendors/nvd3/angular-nvd3.js"></script>
    <script src="scripts/vendors/angular-long-press.js"></script>
    <script src="scripts/vendors/select.min.js"></script>
    <script src="scripts/vendors/multirange-slider.js"></script>
    <script src="scripts/models/noty.js"></script>

    <script src="scripts/app.js"></script>
    <script src="/js/jquery.tiny-pubsub.js"></script>


    <script src="scripts/init.js"></script>
    <script src="scripts/directives.js?v1_2"></script>

    <script src="scripts/controllers/main.js?v1_2"></script>
    <script src="scripts/controllers/noty.js"></script>
    <script src="scripts/controllers/screensaver.js"></script>
</head>

<body ng-controller="Main" ng-class="getBodyClass()" ng-init="pageLoad()">

<div class="page-container" ng-show="ready">
    <div class="camera-popup" ng-if="activeCamera && (entity = getItemEntity(activeCamera))">

        <div class="camera-popup-container">
            <div class="camera-popup--list">
                <div class="camera-popup--list-item" ng-click="openCamera(item)"
                     ng-class="{'-active': activeCamera === item}"
                     ng-repeat="item in getCameraList() track by $index">
            <span ng-show="entity = getItemEntity(item)">
              <span ng-bind="entityTitle(item, entity)"></span>
            </span>
                </div>
            </div>

            <div class="camera-popup--camera">
                <div ng-if="activeCamera.fullscreen == 'camera'">
                    <camera item="activeCamera" entity="entity" freezed="false"></camera>
                </div>

                <div ng-if="activeCamera.fullscreen == 'camera_thumbnall'">
                    <camera-thumbnail item="activeCamera" entity="entity" freezed="false"></camera-thumbnail>
                </div>
            </div>

            <div class="camera-popup--close" ng-click="closeCamera()">
                <i class="mdi mdi-close"></i>
            </div>
        </div>
    </div>

    <div class="door-entry-popup" ng-if="activeDoorEntry && (page = activeDoorEntry.layout.page)
            && (cameraEntity = getEntryCameraEntity(activeDoorEntry))">

        <div class="door-entry-popup-container">
            <div class="door-entry-popup--camera">
                <div ng-if="activeDoorEntry.layout.camera.type === TYPES.CAMERA">
                    <camera item="activeDoorEntry.layout.camera" entity="cameraEntity" freezed="false"></camera>
                </div>

                <div ng-if="activeDoorEntry.layout.camera.type === TYPES.CAMERA_THUMBNAIL">
                    <camera-thumbnail item="activeDoorEntry.layout.camera" entity="cameraEntity"
                                      freezed="false"></camera-thumbnail>
                </div>
            </div>

            <div class="door-entry-popup--tiles">
                <div tile ng-repeat="item in activeDoorEntry.layout.tiles track by $index"></div>
            </div>

            <div class="door-entry-popup--close" ng-click="closeDoorEntry()">
                <i class="mdi mdi-close"></i>
            </div>
        </div>
    </div>

    <div class="alarm-popup d-flex jc-center ai-center"
         ng-if="activeAlarm && (alarmEntity = getItemEntity(activeAlarm))">

        <div class="alarm-popup-overlay" ng-click="closeAlarm()"></div>

        <div class="alarm-popup-container" ng-class="{'-no-code': !alarmEntity.attributes.code_format}">

            <div class="alarm-popup--close" ng-click="closeAlarm()">
                <i class="mdi mdi-close"></i>
            </div>

            <div class="alarm-popup-state">
                <span ng-bind="entityState(activeAlarm, alarmEntity)"></span>
            </div>

            <div class="alarm-popup-input-container" ng-if="alarmEntity.attributes.code_format">
                <div class="alarm-popup-input">
                    <div class="alarm-popup-input-code" ng-if="alarmCode">
                        <span ng-repeat="dot in alarmCode track by $index">•</span>
                    </div>
                    <div class="alarm-popup-input-placeholder" ng-if="!alarmCode">Enter code</div>
                </div>
            </div>

            <div class="alarm-popup-buttons">
                <div ng-if="alarmEntity.attributes.code_format">
                    <div class="alarm-popup-buttons-line" ng-repeat="line in [6, 3, 0] track by $index">
                        <div class="alarm-popup-button" ng-bind="button + line" ng-click="inputAlarm(button + line)"
                             ng-repeat="button in [1, 2, 3] track by $index"></div>
                    </div>

                    <div class="alarm-popup-buttons-line">
                        <div class="alarm-popup-button -l2" ng-click="inputAlarm(0)">0</div>
                        <div class="alarm-popup-button -warning" ng-click="clearAlarm()">
                            <div class="mdi mdi-close"></div>
                        </div>
                    </div>
                </div>

                <div class="alarm-popup-buttons-line">
                    <div class="alarm-popup-button -icon -home"
                         ng-click="actionAlarm('alarm_arm_home', activeAlarm, alarmEntity)">
                        <div class="mdi mdi-bell-plus"></div>
                        Arm home
                    </div>
                    <div class="alarm-popup-button -icon -away"
                         ng-click="actionAlarm('alarm_arm_away', activeAlarm, alarmEntity)">
                        <div class="mdi mdi-bell"></div>
                        Arm away
                    </div>
                    <div class="alarm-popup-button -icon -disarm"
                         ng-click="actionAlarm('alarm_disarm', activeAlarm, alarmEntity)">
                        <div class="mdi mdi-bell-off"></div>
                        Disarm
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="alarm-popup d-flex jc-center ai-center" ng-if="addGroup">
        <div class="alarm-popup-overlay" ng-click="closeAddGroup()"></div>
        <div class="alarm-popup-container" ng-class="{'-no-code': !alarmEntity.attributes.code_format}">
            <div class="alarm-popup--close" ng-click="closeAddGroup()">
                <i class="mdi mdi-close"></i>
            </div>

            <div class="alarm-popup-state">
                <span>Adding new group</span>
            </div>
            <div>
                <input class="add-group-input" id="add-group-input" placeholder="Group name" ng-model="groupName">
            </div>
            <div class="alarm-popup-buttons">
                <div class="alarm-popup-buttons-line">
                    <div class="alarm-popup-button -icon -away group-popup-btn" ng-click="closeAddGroup()">
                        <div class="mdi mdi-cancel"></div>
                        Cancel
                    </div>
                    <div class="alarm-popup-button -icon -disarm group-popup-btn" ng-click="addNewGroup(groupName)">
                        <div class="mdi mdi-plus"></div>
                        Add
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="alarm-popup d-flex jc-center ai-center" ng-if="editGroup">
        <div class="alarm-popup-overlay" ng-click="closeEditGroup()"></div>
        <div class="alarm-popup-container" ng-class="{'-no-code': !alarmEntity.attributes.code_format}">
            <div class="alarm-popup--close" ng-click="closeEditGroup()">
                <i class="mdi mdi-close"></i>
            </div>

            <div class="alarm-popup-state">
                <span>Edit group</span>
            </div>
            <div>
                <input class="add-group-input" placeholder="Group name" ng-model="groupName">
            </div>
            <div class="alarm-popup-buttons">
                <div class="alarm-popup-buttons-line">
                    <div class="alarm-popup-button -icon -away" ng-click="closeEditGroup()">
                        <div class="mdi mdi-cancel"></div>
                        Cancel
                    </div>
                    <div class="alarm-popup-button -icon -away" ng-click="removeGroup()">
                        <div class="mdi mdi-trash-can"></div>
                        Remove
                    </div>
                    <div class="alarm-popup-button -icon -disarm" ng-click="editExistGroup(groupName)">
                        <div class="mdi mdi-content-save"></div>
                        Save
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="alarm-popup d-flex jc-center ai-center" ng-if="addPage || editPage">
        <div class="alarm-popup-overlay" ng-click="closeAddPage()"></div>
        <div class="alarm-popup-container" ng-class="{'-no-code': !alarmEntity.attributes.code_format}">
            <div class="alarm-popup--close" ng-click="closeAddPage()">
                <i class="mdi mdi-close"></i>
            </div>
            <div class="alarm-popup-state"></div>
            <input class="add-page-input" title="Page title" placeholder="Page title" ng-model="pageTitle">
            <input class="add-page-input" title="Page background" placeholder="Page background" ng-model="pageBg.img">
            <div class="ng-thumbnails-wrapper">
                <div class="ng-thumbnails slide-left">
                    <span ng-repeat="i in images" ng-click="selectImage(i)"><img ng-src="{{ i.thumb }}"/></span>
                </div>
            </div>
            <input class="add-page-input" title="Page icon" placeholder="Page icon" ng-model="pageIcon.Icon">
            <div class="page-popup-buttons">
                <div mdi-picker="" ng-model="icon"
                     class="ng-pristine ng-untouched ng-valid dropdown mdi-picker ng-not-empty open">
                    <div class="dropdown-menu" aria-labelledby="dropdownMenu1">
                        <div ng-show="icons.length == 0" class="" style="padding: 10px 4px 4px 4px;">No icons found
                        </div>
                        <div class="icons">
                            <span ng-repeat="icon in icons" class="mdi mdi-24px mdi-{{icon}}" ng-attr-title="{{icon}}"
                                  ng-click="selectIcon(icon)"></span>
                            <div ng-show="icons.length == 301" class="" style="padding: 10px 4px 4px 4px;">Please filter
                                to view others...
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div class="page-popup-buttons" ng-if="addPage">
                <div class="alarm-popup-buttons-line">
                    <div class="alarm-popup-button -icon -away group-popup-btn" ng-click="closeAddPage()">
                        <div class="mdi mdi-cancel"></div>
                        Cancel
                    </div>
                    <div class="alarm-popup-button -icon -disarm group-popup-btn"
                         ng-click="addNewPage(pageTitle,pageBg,pageIcon)">
                        <div class="mdi mdi-plus"></div>
                        Add
                    </div>
                </div>
            </div>
            <div class="page-popup-buttons" ng-if="editPage">
                <div class="alarm-popup-buttons-line">
                    <div class="alarm-popup-button -icon -away" ng-click="closeEditPage()">
                        <div class="mdi mdi-cancel"></div>
                        Cancel
                    </div>
                    <div class="alarm-popup-button -icon -away" ng-click="removePage()">
                        <div class="mdi mdi-trash-can"></div>
                        Remove
                    </div>
                    <div class="alarm-popup-button -icon -disarm" ng-click="editExistPage(pageTitle,pageBg,pageIcon)">
                        <div class="mdi mdi-content-save"></div>
                        Save
                    </div>
                </div>
            </div>
        </div>
    </div>


    <div class="alarm-popup d-flex jc-center ai-center" ng-if="addAutoPage">
        <div class="alarm-popup-overlay" ng-click="closeAddAutoPage()"></div>
        <div class="autopage-popup-container" ng-class="{'-no-code': !alarmEntity.attributes.code_format}">
            <div class="alarm-popup--close" ng-click="closeAddAutoPage()">
                <i class="mdi mdi-close"></i>
            </div>
            <div class="d-flex jc-between">

                <div class="newpageset">
                    <div class="alarm-popup-state"></div>
                    <input class="add-page-input" title="Page title" placeholder="Page title" ng-model="pageTitle">
                    <input class="add-page-input" title="Page background" placeholder="Page background"
                           ng-model="pageBg.img">
                    <div class="ng-thumbnails-wrapper">
                        <div class="ng-thumbnails slide-left">
                            <span ng-repeat="i in images" ng-click="selectImage(i)"><img ng-src="{{ i.thumb }}"/></span>
                        </div>
                    </div>
                    <input class="add-page-input" title="Page icon" placeholder="Page icon" ng-model="pageIcon.Icon">
                    <div class="page-popup-buttons">
                        <div mdi-picker="" ng-model="icon"
                             class="ng-pristine ng-untouched ng-valid dropdown mdi-picker ng-not-empty open">
                            <div class="dropdown-menu" aria-labelledby="dropdownMenu1">
                                <div ng-show="icons.length == 0" class="" style="padding: 10px 4px 4px 4px;">No icons
                                    found
                                </div>
                                <div class="icons">
                                    <span ng-repeat="icon in icons" class="mdi mdi-24px mdi-{{icon}}"
                                          ng-attr-title="{{icon}}" ng-click="selectIcon(icon)"></span>
                                    <div ng-show="icons.length == 301" class="" style="padding: 10px 4px 4px 4px;">
                                        Please filter to view others...
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div class="roomsset">

                    <ul class="nav nav-rooms nav-stacked">
                        <li ng-repeat="room in rooms" ng-class="{ active: isSet(room.id) }">
                            <a href ng-click="setTab(room.id)">{{room.title}}</a>
                        </li>
                    </ul>


                    <div class="jumbotron">
                        <div ng-repeat="room in rooms" ng-show="isSet(room.id)">
                            <h1>{{room.title}}</h1>
                            <div ng-repeat="dev in room.devices">
                                    <span class="squared-input">
                                        <input type="checkbox" ng-model="dev.enabled" class="checkall" id="{{dev.id}}">
                                        <label for="{{dev.id}}"></label>
                                        {{dev.object}} ({{dev.title}})
                                    </span>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
            <div class="page-popup-buttons" ng-if="addAutoPage">
                <div class="alarm-popup-buttons-line">
                    <div class="alarm-popup-button -icon -away group-popup-btn autopagebntcancel"
                         ng-click="closeAddAutoPage()">
                        <div class="mdi mdi-cancel"></div>
                        Cancel
                    </div>
                    <div class="alarm-popup-button -icon -disarm group-popup-btn autopagebnt"
                         ng-click="addNewAutoPage(pageTitle,pageBg,pageIcon,rooms)">
                        <div class="mdi mdi-plus"></div>
                        Generate page
                    </div>
                </div>
            </div>

        </div>
    </div>

    <div class="alarm-popup d-flex jc-center ai-center" ng-if="addTile || editTile">

        <div class="alarm-popup-overlay" ng-click="closeEditTile()"></div>

        <div class="addtile-popup-container" ng-class="{'-no-code': !alarmEntity.attributes.code_format}">

            <div class="alarm-popup--close" ng-click="closeEditTile()">
                <i class="mdi mdi-close"></i>
            </div>

            <!--<div class="alarm-popup-state">
                <span>Editing tile</span>
            </div>-->

            <div class="d-flex jc-between">
                <div class="select-box">
                    <div class="df-center select-item">
                        <label for="select_1" class="select-title">Group</label>
                        <div class="select-wrap long">
                            <select ng-model="selectedItem" class="select-group"
                                    ng-options="group as group.title for group in activePage.groups">
                            </select>
                        </div>
                    </div>
                    <div class="df-center select-item">
                        <label for="select_1" class="select-title">Type Tile</label>
                        <div class="select-wrap long">
                            <select ng-model="selectedType" class="select-group"
                                    ng-change="changeTileType(selectedType,selectedItem)"
                                    ng-options="key as key for (key,val) in tileConfig">
                            </select>
                        </div>
                    </div>
                    <div class="df-center select-item-accent">

                        <label for="select_1" class="select-title">Device</label>
                        <div class="select-wrap long">
                            <ui-select ng-model="tileDeviceArray.selected" theme="selectize" ng-disabled="disabled"
                                       on-select="changeTileDevices($item)" style="width: 100%;">
                                <ui-select-match placeholder="Select or search a device...">{{$select.selected.name}}
                                    ({{$select.selected.title}})
                                </ui-select-match>
                                <ui-select-choices
                                        repeat="device.id as  device in (tileDeviceArray | filter: $select.search)">
                                    <span ng-bind-html="device.name | highlight: $select.search"></span>
                                    (
                                    <small ng-bind-html="device.title | highlight: $select.search"></small>
                                    )
                                </ui-select-choices>
                            </ui-select>
                        </div>

                    </div>
                    <div class="df-center">
                        <span class="hr">or</span>
                    </div>

                    <div class="df-center select-item-accent">
                        <label for="select_1" class="select-title">Object</label>
                        <div class="select-wrap long">
                            <ui-select ng-model="tileObjectArray.selected" theme="selectize" ng-disabled="disabled"
                                       on-select="changeTileObject($item)" style="width: 100%;">
                                <ui-select-match placeholder="Select or search a device...">{{$select.selected.name}}
                                    ({{$select.selected.name}})
                                </ui-select-match>
                                <ui-select-choices
                                        repeat="object.id as  object in (tileObjectArray | filter: $select.search)">
                                    <span ng-bind-html="object.name | highlight: $select.search"></span>
                                    (
                                    <small ng-bind-html="object.id | highlight: $select.search"></small>
                                    )
                                </ui-select-choices>
                            </ui-select>
                        </div>
                    </div>
                    <div ng-if="propertyShow(selectedType)" class="df-center select-item-accent">
                        <label for="select_1" class="select-title">Property</label>
                        <div class="select-wrap long">
                            <ui-select ng-model="tileDevicePropertyArray.selected" theme="selectize" ng-disabled="disabled"
                                       on-select="changeDevicesProperty($item)" style="width: 100%;">
                                <ui-select-match placeholder="Select or search a property...">{{$select.selected}}
                                </ui-select-match>
                                <ui-select-choices
                                        repeat="property in tileDevicePropertyArray | filter: $select.search">
                                    <span ng-bind-html="property | highlight: $select.search"></span>
                                </ui-select-choices>
                            </ui-select>
                        </div>
                    </div>

                    <div class="d-flex select-item jc-start ai-center f-wrap" tooltips tooltip-template="Size Tile">
                        <div class="select-title">Size</div>
                        <div class="df-center">
                            <div class="select-wrap short">
                                <select id="select_3" ng-model="selectedWidth" class="select-group"
                                        ng-change="changeTileWidth(selectedWidth)">
                                    <option ng-selected="selectedWidth==item.id" ng-repeat="item in sizes"
                                            ng-value="item.id">{{item.label}}
                                    </option>
                                </select></div>
                            <label for="select_3">Width</label>
                        </div>
                        <div class="df-center">
                            <div class="select-wrap short">
                                <select id="select_4" ng-model="selectedHeight" class="select-group"
                                        ng-change="changeTileHeight(selectedHeight)">
                                    <option ng-selected="selectedHeight==item.id" ng-repeat="item in sizes"
                                            ng-value="item.id">{{item.label}}
                                    </option>
                                </select>
                            </div>
                            <label for="select_4">Height</label>
                        </div>
                    </div>
                    <div class="df-center select-item" tooltips tooltip-template="Color Tile">
                        <label for="select_1" class="select-title">Color</label>
                        <div class="select-wrap long">
                            <color-picker ng-model="objJson.data.tile_color"></color-picker>
                        </div>
                    </div>
                </div>

                <div class="addtile-popup-input-container">
                    <div ng-jsoneditor ng-model="objJson.data" options="objJson.options"
                         style="height: 94%; min-height: 450px;"></div>
                    <div class="alarm-popup-filters">
                        <div class="alarm-popup-tabs">
                            <div class="alarm-popup-tabs__item active add-tile-tree" ng-click="changeOptions('tree')">
                                tree
                            </div>
                            <div class="alarm-popup-tabs__item add-tile-code" ng-click="changeOptions('code')">code
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="alarm-popup-buttons">
                <div ng-if="editTile" class="alarm-popup-buttons-line">
                    <div class="alarm-popup-button -icon -away" ng-click="closeEditTile()">
                        <div class="mdi mdi-cancel"></div>
                        Cancel
                    </div>
                    <div class="alarm-popup-button -icon -away" ng-click="removeTile()">
                        <div class="mdi mdi-trash-can"></div>
                        Remove
                    </div>
                    <div class="alarm-popup-button -icon -disarm" ng-click="editExistTile(selectedItem)">
                        <div class="mdi mdi-content-save"></div>
                        Save
                    </div>
                </div>
                <div ng-if="addTile" class="alarm-popup-buttons-line">
                    <div class="alarm-popup-button -icon -away" ng-click="closeAddTile()">
                        <div class="mdi mdi-cancel"></div>
                        Cancel
                    </div>
                    <div class="alarm-popup-button -icon -disarm" ng-click="addNewTile(jsonStringData,selectedItem)">
                        <div class="mdi mdi-plus"></div>
                        Add
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="alarm-popup d-flex jc-center ai-center" ng-if="editConfig">

        <div class="alarm-popup-overlay" ng-click="closeEditConfig()"></div>

        <div class="addtile-popup-container" ng-class="{'-no-code': !alarmEntity.attributes.code_format}">

            <div class="alarm-popup--close" ng-click="closeEditConfig()">
                <i class="mdi mdi-close"></i>
            </div>


            <div ng-jsoneditor ng-model="cofigJson.data" options="objJson.options"
                 style="height: 94%; min-height: 450px;"></div>
            <div class="alarm-popup-filters">
                <div class="alarm-popup-tabs">
                    <div class="alarm-popup-tabs__item active add-tile-tree" ng-click="changeOptions('tree')">tree</div>
                    <div class="alarm-popup-tabs__item add-tile-code" ng-click="changeOptions('code')">code</div>
                </div>
            </div>

            <div class="alarm-popup-buttons">
                <div ng-if="editConfig" class="alarm-popup-buttons-line">
                    <div class="alarm-popup-button -icon -away" ng-click="closeEditConfig()">
                        <div class="mdi mdi-cancel"></div>
                        Cancel
                    </div>
                    <div class="alarm-popup-button -icon -disarm" ng-click="editExistConfig(selectedItem)">
                        <div class="mdi mdi-content-save"></div>
                        Save
                    </div>
                </div>

            </div>
        </div>
    </div>


    <div class="datetime-popup" ng-if="activeDatetime && (dtEntity = getItemEntity(activeDatetime))">

        <div class="datetime-popup-overlay" ng-click="closeDatetime()"></div>

        <div class="datetime-popup-container">
            <div class="datetime-popup--close" ng-click="closeDatetime()">
                <i class="mdi mdi-close"></i>
            </div>

            <div class="datetime-popup-state">
                <span ng-bind="entityState(activeDatetime, dtEntity)"></span>
            </div>

            <div class="datetime-popup-input-container">
                <div class="datetime-popup-input">
                    <span class="datetime-popup-input--filled" ng-bind="getActiveDatetimeInput()"></span>
                    <!--
                    --><span class="datetime-popup-input--placeholder" ng-bind="getActiveDatetimePlaceholder()"></span>
                </div>
            </div>

            <div class="datetime-popup-buttons">
                <div class="datetime-popup-buttons-line" ng-repeat="line in [6, 3, 0] track by $index">
                    <div class="datetime-popup-button" ng-bind="button + line" ng-click="inputDatetime(button + line)"
                         ng-repeat="button in [1, 2, 3] track by $index"></div>
                </div>

                <div class="datetime-popup-buttons-line">
                    <div class="datetime-popup-button -warning" ng-click="clearCharDatetime()">
                        <div class="mdi mdi-arrow-left"></div>
                    </div>
                    <div class="datetime-popup-button" ng-click="inputDatetime(0)">0</div>

                    <div class="datetime-popup-button -success" ng-class="{'-disabled': !activeDatetimeValid()}"
                         ng-click="sendDatetime()">
                        <div class="mdi mdi-check"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="pages-menu" ng-class="pagesMenuClasses()">

        <div class="pages-menu--scroll-indicator"></div>

        <div class="pages-menu--aligner"></div>

        <div class="pages-menu--items">
            <div ng-repeat="page in pages track by $index" class="pages-menu--item" ng-click="openPage(page,$parent)"
                 ng-if="!isHidden(page)"
                 ng-class="{'-active': isPageActive(page)}">

                <i class="mdi" ng-class="page.icon"></i>
            </div>
            <div ng-repeat="page in pagesSetting track by $index" class="pages-menu--item"
                 ng-click="openPageSetting(page,$parent)" ng-if="!isHidden(page)"
                 ng-class="{'-active': isPageActive(page)}">

                <i class="mdi" ng-class="page.icon"></i>
            </div>
            <div class="pages-menu--item add-btn" ng-show="editingMode==true" ng-click="openAddPagePopup()">
                <i title="Add new page" class="mdi mdi-plus"></i>
            </div>
            <div class="pages-menu--item add-btn" ng-show="editingMode==true" ng-click="openAddAutoPagePopup()">
                <i title="Add new page" class="mdi mdi-auto-fix"></i>
            </div>
            <div ng-show="editingMode !== true" id="edit-tiles" class="pages-menu--item ng-hide"
                 ng-click="toggleEdit(this)">
                <i title="Edit configuration" class="mdi mdi-border-color"></i>
            </div>
            <div ng-show="editingMode === true" id="save-tiles" class="pages-menu--item" ng-click="saveConfig()">
                <i title="Save changes" class="mdi mdi-content-save"></i>
            </div>
        </div>


    </div>

    <div class="header" ng-if="header = getHeader()" ng-include="'header.html'"></div>

    <div class="pages" id="pages" ng-click="">
        <div class="page-overlay" ng-if="activeSelect" ng-click="closeActiveSelect()"></div>

        <div ng-repeat="page in pages track by $index" ng-class="{'-active': isPageActive(page)}"
             ng-if="shouldDrawPage(page) && !isHidden(page)"
             ng-style="pageStyles(page)" class="page" on-scroll on-scroll-model="page">

            <!-- legacy -->
            <div class="page-head" ng-if="page.head && headWarning()" ng-include="page.head"></div>

            <div class="header" ng-if="header = getHeader(page)" ng-include="'header.html'"></div>

            <div class="page-align"></div>

            <div ng-repeat="group in page.groups track by $index" ng-if="!isHidden(group)" class="group"
                 ng-style="groupStyles(group, page)">
                <div ng-bind="group.title" class="group-title"></div>
                <div class="hovermenu" ng-show="editingMode && !drag" context-menu="menuOptionsGroups"
                     context-menu-on="editingMode && click">
                    <i class="fa fa-big fa-ellipsis-h dropdown-toggle" data-toggle="dropdown" aria-hidden="true"
                       ng-click="editModeClick(page, item, entity,$parent,$event)"></i>
                </div>

                <div tile ng-repeat="item in group.items track by $index"></div>
            </div>
            <div class="group item add-btn" ng-show="editingMode && !drag" ng-click="openAddGroupPopup()">
                <i title="Add group" class="mdi mdi-plus"></i>
            </div>
        </div>
        <div ng-repeat="page in pagesSetting track by $index" ng-class="{'-active': isPageActive(page)}"
             ng-if="shouldDrawPage(page) && !isHidden(page)"
             ng-style="pageStyles(page)" class="page" on-scroll on-scroll-model="page">

            <!-- legacy -->
            <div class="page-head" ng-if="page.head && headWarning()" ng-include="page.head"></div>

            <div class="header" ng-if="header = getHeader(page)" ng-include="'header.html'"></div>

            <div class="page-align"></div>

            <div ng-repeat="group in page.groups track by $index" ng-if="!isHidden(group)" class="group"
                 ng-style="groupStyles(group, page)">
                <div ng-bind="group.title" class="group-title"></div>
                <div tile ng-repeat="item in group.items track by $index"></div>
            </div>

        </div>
    </div>
</div>

<div class="screensaver" ng-click="hideScreensaver()" ng-show="isShowed" ng-controller="Screensaver"
     ng-style="conf.styles">

    <div class="screensaver-slides" ng-if="isShowed">
        <div class="screensaver-slide" ng-style="getSlideStyle(slide)" ng-class="getSlideClasses($index, slide)"
             ng-repeat="slide in slides track by $index">
            <div class="screensaver-content--right-bottom" ng-if="slide.rightBottom">
                <div header-item ng-repeat="item in slide.rightBottom track by $index"></div>
            </div>
            <div class="screensaver-content--right-top" ng-if="slide.rightTop">
                <div header-item ng-repeat="item in slide.rightTop track by $index"></div>
            </div>
            <div class="screensaver-content--left-bottom" ng-if="slide.leftBottom">
                <div header-item ng-repeat="item in slide.leftBottom track by $index"></div>
            </div>
            <div class="screensaver-content--left-top" ng-if="slide.leftTop">
                <div header-item ng-repeat="item in slide.leftTop track by $index"></div>
            </div>
        </div>
    </div>

    <div class="screensaver-content" ng-if="isShowed">
        <div class="screensaver-content--right-bottom" ng-if="conf.rightBottom">
            <div header-item ng-repeat="item in conf.rightBottom track by $index"></div>
        </div>
        <div class="screensaver-content--right-top" ng-if="conf.rightTop">
            <div header-item ng-repeat="item in conf.rightTop track by $index"></div>
        </div>
        <div class="screensaver-content--left-bottom" ng-if="conf.leftBottom">
            <div header-item ng-repeat="item in conf.leftBottom track by $index"></div>
        </div>
        <div class="screensaver-content--left-top" ng-if="conf.leftTop">
            <div header-item ng-repeat="item in conf.leftTop track by $index"></div>
        </div>
    </div>
</div>


<div class="noties-container" ng-class="getNotiesClasses()" ng-controller="Noty" ng-cloak="">
    <div class="noty" ng-class="noty.getClasses()" ng-repeat="noty in getNoties() track by noty.id">
        <div class="noty-header">
            <div class="noty-title" ng-if="noty.title" ng-bind="noty.title"></div>
            <div class="noty-close" ng-click="noty.remove()">
                <i class="mdi mdi-close"></i>
            </div>
        </div>
        <div class="noty-content">
            <div class="noty-icon" ng-if="noty.icon">
                <i class="mdi" ng-class="noty.icon"></i>
            </div>

            <div class="noty-message" ng-bind-html="noty.message"></div>
        </div>
        <div class="noty-lifetime" ng-if="noty.lifetime">
            <div class="noty-lifetime-line" ng-style="noty.getLifetimeStyles()"></div>
        </div>
    </div>

    <div class="noties-button" ng-if="getNoties().length > 1" ng-click="clearAll()">
        Clear all
    </div>
</div>


<!-- HEAD TEMPLATE -->

<script type="text/ng-template" id="head.html">
    <div class="page-head-content">
        <div class="page-head--left">
            <div class="page-head--time" ng-style="clockStyles()">
                <clock></clock>
            </div>
        </div>
        <div class="page-head--right">
        </div>
    </div>
</script>

<script type="text/ng-template" id="header.html">
    <div class="header-content" ng-style="header.styles">
        <div class="header--left">
            <div header-item ng-repeat="item in header.left track by $index"></div>
        </div>
        <div class="header--right">
            <div header-item ng-repeat="item in header.right track by $index"></div>
        </div>
    </div>
</script>


<!-- HEADER ITEMS TEMPLATE -->

<script type="text/ng-template" id="header-items.html">
    <div class="header-item" ng-class="'-' + item.type" ng-style="item.styles">
        <div ng-if="item.type === HEADER_ITEMS.TIME">
            <clock></clock>
        </div>
        <div ng-if="item.type === HEADER_ITEMS.DATE">
            <date format="item.format"></date>
        </div>
        <div ng-if="item.type === HEADER_ITEMS.DATETIME">
            <clock></clock>
            <date format="item.dateFormat"></date>
        </div>
        <div ng-if="item.type === HEADER_ITEMS.CUSTOM_HTML">
            <div ng-bind-html="item.html"></div>
        </div>
        <div ng-if="item.type === HEADER_ITEMS.WEATHER">
            <div class="header-weather--icon-container">
                <div class="header-weather--icon"
                     ng-if="(_icon = getWeatherIcon(item, {}))">
                    <div class="wu " ng-class="'wu-' + _icon"></div>
                </div>
                <div class="header-weather--icon-image"
                     ng-if="(_imgStyles = getWeatherImageStyles(item, {}))">
                    <div ng-style="_imgStyles"></div>
                </div>
            </div>

            <div class="header-weather--temperature" ng-if="item.fields.temperature">
                <span ng-bind="getWeatherField('temperature', item, {})"></span>
                <span ng-bind="getWeatherField('temperatureUnit', item, {})"></span>
            </div>

            <div class="header-weather--summary" ng-if="item.fields.summary">
                <span ng-bind="getWeatherField('summary', item, {})"></span>
            </div>
        </div>
    </div>
</script>


<!-- TILE TEMPLATE -->

<script type="text/ng-template" id="tile.html">
    <div ng-style="itemStyles(page, item, entity)" context-menu="menuOptions" context-menu-on="click ,item.setting"
         class="item"
         jqyoui-draggable="{index: {{$index}}, onStart:'dragStart(item, $parent.$parent.$parent.group,$parent,editingMode)', onStop:'dragStop(item, $parent.$parent.$parent.group,$parent,editingMode)'}"
         data-drag="{{editingMode && item.type !== TYPES.DROPPLACE }}"
         data-drop="item.type === TYPES.DROPPLACE"
         jqyoui-droppable="{index: {{$index}}, onOver:'dragOver()',onOut:'dragOut()',  onDrop:'dragDrop(item,$parent.$parent.$parent.group)'}"
         data-jqyoui-options="{revert: 'invalid'}"
         ng-click="entityClick(page, item, entity,$parent,$event)"
         on-long-press="entityLongClick($event, page, item, entity)"
         ng-if="(entity = getItemEntity(item)) && !isHidden(item, entity)"
         ng-class="itemClasses(item)">
        <div class="item-clickable"></div>

        <div ng-if="item.bg || item.bgSuffix" class="item-background"
             ng-style="itemBgStyles(item, entity)"></div>

        <div class="item-title" ng-bind="_title"
             ng-if="(_title = entityTitle(item, entity))"></div>

        <div class="item-subtitle" ng-bind="_subtitle"
             ng-if="(_subtitle = entitySubtitle(item, entity))"></div>

        <div class="item-state" ng-bind="_state"
             ng-if="(_state = entityState(item, entity))"></div>

        <div class="item-slides-container" ng-if="item.slides.length">
            <div class="item-slides" ng-class="'-c' + item.slides.length"
                 ng-if="item.slides.length" ng-style="slidesStyles(item, $index)">
                <div class="item-slide" ng-repeat="slide in item.slides track by $index"
                     ng-style="slideStyles(slide, item, entity)"></div>
            </div>
        </div>

        <div ng-if="item.type === TYPES.DEVICE_TRACKER"
             class="item-entity-container -below">

            <div class="item-slides-container" ng-if="hasTrackerCoords(entity)">
                <div class="item-slides" ng-class="trackerSlidesClass(item, entity)"
                     ng-style="slidesStyles(item, $index)">

                    <div class="item-slide -map"
                         ng-repeat="zoom in trackerZoomLevels(item, entity) track by $index"
                         ng-style="slideMapStyles(item, page, entity, zoom, entity.state)"></div>
                </div>
            </div>
        </div>


        <div ng-if="item.type === TYPES.DEVICE_TRACKER"
             class="item-entity-container -below">

            <div class="item-entity">
            <input type="text" ng-bind="entityValue(item, entity)"
                   class="item-entity--value">
            </div>
        </div>




        <div ng-if="item.type === TYPES.SENSOR"
             class="item-entity-container">
            <div class="item-entity">
            <span ng-bind="entityValue(item, entity)"
                  class="item-entity--value"></span>
                <span ng-if="(_unit = entityUnit(item, entity))"
                      class="item-entity--unit" ng-bind="_unit"></span>
            </div>
        </div>

        <div ng-if="item.type === TYPES.TERMOSTAT"
             class="item-entity-container at-multirange-slider">

        <div class="d-flex jc-center ai-center h-100">
            <ui-timepicker ng-model="ecoTemp" item="item" entity="entity" title="eco" class="eco termostat_circle" value="entityValueTermostat(item, entity,'ecoTargetValue')"></ui-timepicker>
            <div data-v-f16bb266="" class="termostat_data"><div class="termostat_temp item-entity--value " ng-bind="entityValueTermostat(item, entity,'value')"><span class="display-2">˚C</span></div>
                <p class="caption">Текущая температура</p>
                <div data-v-f16bb266="">
                    <button data-v-f16bb266="" type="button" class="text-none v-btn v-btn--round v-btn--small theme--dark" style="background-color: rgb(239, 83, 80); border-color: rgb(239, 83, 80);">
                        <div class="v-btn__content">Текущий режим: Обычный</div>
                    </button>
                    <div data-v-f16bb266="" class="v-menu">
                        <div data-v-f16bb266="" class="v-menu__content theme--light" style="min-width: 140px; top: 620px; left: 881px; transform-origin: left top; z-index: 8; display: none;">
                            <div data-v-f16bb266="" role="list" class="v-list theme--light">
                                <div data-v-f16bb266="" role="listitem"><a class="v-list__tile v-list__tile--link theme--light">
                                        <div data-v-f16bb266="" class="v-list__tile__title">Обычный</div></a></div>
                                <div data-v-f16bb266="" role="listitem"><a class="v-list__tile v-list__tile--link theme--light"><div data-v-f16bb266="" class="v-list__tile__title">Эко</div></a></div><div data-v-f16bb266="" role="listitem"><a class="v-list__tile v-list__tile--link theme--light"><div data-v-f16bb266="" class="v-list__tile__title">Выкл</div></a></div></div></div></div></div>
                <div ng-if="!item.controlsEnabled" ng-click="openTermostatSliders($event, item, entity)" class="controlsTermostat">
                    <i class="mdi mdi-big-arrow mdi-chevron-double-down"></i>
                </div>
                <div ng-if="item.controlsEnabled" ng-click="closeTermostatSliders($event, item, entity)">
                    <i class="mdi mdi-big-arrow mdi-chevron-double-up"></i>
                </div>
            </div>
            <ui-timepicker ng-model="standartTemp" item="item" entity="entity" class="termostat_circle" title="standart" value="entityValueTermostat(item, entity,'normalTargetValue')"></ui-timepicker>
        </div>

            <div ng-if="item.controlsEnabled" class="sliders_termostat">
                <div class="d-flex ai-center" model="val_sl" ng-repeat="val_sl in sliders_termostat">
                    <div class="termostat_day" style="width 100%;">
                        {{val_sl['title']}}
                    </div>
                    <div class="termostat_slider">
                        <slider step="30">
                            <slider-range model="cl.p" ng-repeat="cl in probs[val_sl['id']]">
                                <div class="slider-handle" ng-bind-html="cl.symbol"></div>
                                <div class="slider-label" ng-if="!$last" ng-class-even="'range'"><span
                                            class="range_text d-flex" ng-class-even="'right'">{{ (Math.trunc(cl.p / 60)) + ":" + cl.p % 60  }}</span>
                                </div>
                            </slider-range>

                        </slider>
                        <div class="clock_text d-flex">
                            <span class="range_text"><ins>0</ins></span>
                            <span class="range_text"><ins>3</ins></span>
                            <span class="range_text"><ins>6</ins></span>
                            <span class="range_text"><ins>9</ins></span>
                            <span class="range_text"><ins>12</ins></span>
                            <span class="range_text"><ins>15</ins></span>
                            <span class="range_text"><ins>18</ins></span>
                            <span class="range_text"><ins>21</ins></span>
                            <span class="range_text"><ins>24</ins></span>
                        </div>
                    </div>
                    <div class="slider_button d-flex">
                        <button ng-click="addItem(val_sl['id'])"><i class="mdi mdi-plus"></i></button>
                        <button ng-click="removeItem(val_sl['id'])"><i class="mdi mdi-minus"></i></button>
                    </div>
                </div>
            </div>
        </div>
        <div ng-if="item.type === TYPES.SWITCH"
             class="item-entity-container">

            <div class="item-entity">
            <span class="item-entity--icon mdi"
                  ng-class="entityIcon(item, entity)"></span>
            </div>
        </div>

        <div ng-if="item.type === TYPES.LOCK"
             class="item-entity-container">

            <div class="item-entity">
            <span class="item-entity--icon mdi"
                  ng-class="entityIcon(item, entity)"></span>
            </div>
        </div>

        <div ng-if="item.type === TYPES.COVER"
             class="item-entity-container">

            <div class="item-cover">
                <div class="item-cover--button -open"
                     ng-class="{'-disabled': entity.state === 'open'}"
                     ng-click="sendCover('open_cover', item, entity)">
                    <i class="mdi mdi-arrow-up"></i>
                </div>

                <div class="item-cover--button -stop"
                     ng-click="sendCover('stop_cover', item, entity)">
                    <i class="mdi mdi-stop"></i>
                </div>

                <div class="item-cover--button -close"
                     ng-class="{'-disabled': entity.state === 'closed'}"
                     ng-click="sendCover('close_cover', item, entity)">
                    <i class="mdi mdi-arrow-down"></i>
                </div>
            </div>
        </div>

        <div ng-if="item.type === TYPES.COVER_TOGGLE"
             class="item-entity-container">

            <div class="item-entity">
            <span class="item-entity--icon mdi"
                  ng-class="entityIcon(item, entity)"></span>
            </div>
        </div>

        <div ng-if="item.type === TYPES.FAN"
             class="item-entity-container">

            <div class="item-entity" ng-if="(_icon = entityIcon(item, entity))"
                 ng-class="{'-with-select': entity.attributes.speed_list}">
                <span class="item-entity--icon mdi" ng-class="_icon"></span>
            </div>

            <div class="item-fan">
                <div class="item-fan--speed" ng-if="entity.attributes.speed_list"
                     ng-click="openFanSpeedSelect($event, item)">
                    <span ng-bind="entity.attributes.speed"></span>
                </div>
            </div>

            <div ng-if="selectOpened(item)" class="item-select"
                 ng-style="itemSelectStyles(entity, entity.attributes.speed_list)">

                <div class="item-select--option"
                     ng-repeat="option in entity.attributes.speed_list track by $index"
                     ng-class="{'-active': option === entity.attributes.speed}"
                     ng-click="setFanSpeed($event, item, entity, option)">
                    <span ng-bind="option"></span>
                </div>
            </div>
        </div>

        <div ng-if="item.type === TYPES.CUSTOM"
             class="item-entity-container">

            <div ng-if="item.customHtml"
                 ng-bind-html="item.customHtml"></div>

            <div ng-if="!item.customHtml" class="item-entity">
            <span class="item-entity--icon mdi"
                  ng-class="entityIcon(item, entity)"></span>
            </div>

        </div>

        <div ng-if="item.type === TYPES.SCRIPT"
             class="item-entity-container">

            <div class="item-entity">
            <span class="item-entity--icon mdi"
                  ng-class="entityIcon(item, entity)"></span>
            </div>
        </div>

        <div ng-if="item.type === TYPES.AUTOMATION"
             class="item-entity-container">

            <div class="item-entity">
            <span class="item-entity--icon mdi"
                  ng-class="entityIcon(item, entity)"></span>
            </div>
        </div>

        <div ng-if="item.type === TYPES.VACUUM"
             class="item-entity-container">

            <div class="item-entity">
            <span class="item-entity--icon mdi"
                  ng-class="entityIcon(item, entity)"></span>
            </div>
        </div>

        <div ng-if="item.type === TYPES.SENSOR_ICON"
             class="item-entity-container">
            <div class="item-entity">
            <span class="item-entity--icon mdi"
                  ng-class="entityIcon(item, entity)"></span>
            </div>
        </div>

        <div ng-if="item.type === TYPES.INPUT_BOOLEAN"
             class="item-entity-container">

            <div class="item-entity">
            <span class="item-entity--icon mdi"
                  ng-class="entityIcon(item, entity)"></span>
            </div>
        </div>

        <div ng-if="item.type === TYPES.LIGHT"
             class="item-entity-container">

            <div ng-if="!item.controlsEnabled">
                <div ng-if="entity.state !== 'off'">
                    <div class="item-button -center-right"
                         ng-click="increaseBrightness($event, item, entity)">
                        <i class="mdi mdi-plus"></i>
                    </div>
                    <div class="item-button -bottom-right"
                         ng-click="decreaseBrightness($event, item, entity)">
                        <i class="mdi mdi-minus"></i>
                    </div>
                </div>
                <div class="item-entity">
               <span class="item-entity--icon mdi"
                     ng-class="entityIcon(item, entity)"></span>
                </div>
            </div>
            <div ng-if="item.controlsEnabled" class="item-entity-sliders"
                 ng-click="preventClick($event)">
                <div ng-repeat="slider in item.sliders track by $index"
                     ng-if="(_c = getLightSliderConf(slider, entity))"
                     class="item-slider-container">

                    <div class="item-slider-title" ng-if="slider.title">
                        <span ng-bind="slider.title"></span>:
                        <span ng-bind="getLightSliderValue(slider, _c)"></span>
                    </div>

                    <div class="item-slider">
                        <input type="range" ng-model="_c.value" value="{{ _c.value }}"
                               ng-change="lightSliderChanged(slider, item, entity, _c)"
                               step="{{ _c.step }}" min="{{ _c.min }}" max="{{ _c.max }}">
                    </div>
                </div>

                <div class="item-entity--back-button"
                     ng-click="closeLightSliders($event, item, entity)">
                    <i class="mdi mdi-chevron-left"></i> Back
                </div>
            </div>
        </div>

        <div ng-if="item.type === TYPES.TEXT_LIST"
             class="item-entity-container">
            <div class="item-list">
                <div class="item-list--item"
                     ng-repeat="line in item.list track by $index">
                    <div class="item-list--name">
                        <i class="mdi" ng-class="listField('icon', item, line)" ng-if="line.icon"></i>
                        <span ng-bind="listField('title', item, line)"></span>
                    </div>
                    <div class="item-list--value">
                        <span ng-bind="listField('value', item, line)"></span><!--
               --><span ng-bind="listField('unit', item, line)"></span>
                    </div>
                </div>
            </div>
        </div>

        <div ng-if="item.type === TYPES.INPUT_NUMBER"
             class="item-entity-container">
            <div>
                <div class="item-button -center-right"
                     ng-click="increaseNumber($event, item, entity)">
                    <i class="mdi mdi-plus"></i>
                </div>
                <div class="item-button -bottom-right"
                     ng-click="decreaseNumber($event, item, entity)">
                    <i class="mdi mdi-minus"></i>
                </div>
            </div>

            <div class="item-entity">
            <span ng-bind="entityValue(item, entity)"
                  class="item-entity--value"></span>
                <span ng-if="(_unit = entityUnit(item, entity))"
                      class="item-entity--unit" ng-bind="_unit"></span>
            </div>
        </div>


        <div ng-if="item.type === TYPES.INPUT_SELECT"
             class="item-entity-container">
            <div ng-if="selectOpened(item)" class="item-select"
                 ng-style="itemSelectStyles(entity, entity.attributes.options)">
                <div class="item-select--option"
                     ng-repeat="option in entity.attributes.options track by $index"
                     ng-class="{'-active': option === entity.state}"
                     ng-click="setSelectOption($event, item, entity, option)">
                    <span ng-bind="option"></span>
                </div>
            </div>
            <div class="item-triangle"></div>
            <div class="item-entity -select">
            <span class="item-entity--value">
               <span ng-bind="entityValue(item, entity)"></span>
            </span>
                <span ng-if="(_unit = entityUnit(item, entity))"
                      class="item-entity--unit" ng-bind="_unit"></span>
            </div>
        </div>

        <div ng-if="item.type === TYPES.INPUT_DATETIME"
             class="item-entity-container">
            <div class="item-entity">
            <span ng-bind="entityValue(item, entity)"
                  class="item-entity--value -datetime"></span>
            </div>
        </div>


        <div ng-if="item.type === TYPES.CAMERA"
             class="item-entity-container -below">
            <div class="item-camera">
                <camera item="item" entity="entity"
                        freezed="!isPageActive(page) || activeCamera"></camera>
            </div>
        </div>


        <div ng-if="item.type === TYPES.CAMERA_THUMBNAIL"
             class="item-entity-container -below">
            <div class="item-camera">
                <camera-thumbnail freezed="!isPageActive(page) || activeCamera"
                                  item="item" entity="entity"></camera-thumbnail>
            </div>
        </div>

        <div ng-if="item.type === TYPES.SCENE"
             class="item-entity-container">

            <div class="item-entity">
            <span class="item-entity--icon mdi"
                  ng-class="entityIcon(item, entity)"></span>
            </div>
        </div>

        <div ng-if="item.type === TYPES.SLIDER"
             class="item-entity-container" ng-class="{'-slider-bottom': item.bottom}">

            <div class="item-entity">
            <span ng-bind="entityValue(item, entity)"
                  class="item-entity--value"></span>
                <span ng-if="(_unit = entityUnit(item, entity))"
                      class="item-entity--unit" ng-bind="_unit"></span>
            </div>

            <div class="item-slider" ng-if="(_c = getSliderConf(item, entity))">
                <input type="range" ng-model="_c.value"
                       ng-change="sliderChanged(item, entity, _c)"
                       step="{{ _c.step }}" min="{{ _c.min }}" max="{{ _c.max }}">
            </div>

        </div>

        <div ng-if="item.type === TYPES.PROGRESS"
             class="item-entity-container" ng-class="{'-progress-bottom': item.bottom}">

            <div class="item-entity">
            <span ng-bind="entityValue(item, entity)"
                  class="item-entity--value"></span>
                <span ng-if="(_unit = entityUnit(item, entity))"
                      class="item-entity--unit" ng-bind="_unit"></span>
            </div>
            <svg viewBox="0 0 46 46" class="circular-chart orange">
                <path fill="none" stroke="{{item.background}}" stroke-width="2" d="M23 5.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                <path fill="none" stroke="{{item.color}}" stroke-width="2" stroke-linecap="round"
                      stroke-dasharray="{{item.value}}, 100" d="M23 5.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"></path>
            </svg>
        </div>

        <div ng-if="item.type === TYPES.GRAPH"
             class="item-entity-container" ng-class="{'-progress-bottom': item.bottom}">
            <nvd3 options="item.options" data="item.data"></nvd3>
        </div>


        <div ng-if="item.type === TYPES.DROPPLACE"
             class="item-entity-container">
            <div class="item-entity">
          <span ng-bind="entityValue(item, entity)"
                class="item-entity--value" style="font-size: 16px;"></span>
            </div>
        </div>

        <div ng-if="item.type === TYPES.IFRAME" class="item-entity-container">

            <div ng-show="!editingMode" class="item-iframe">
                <iframe ng-src="{{ item.url }}" iframe-tile="item" frameborder="0"></iframe>
            </div>
            <div ng-show="editingMode" class="item-entity">
                <span>IFRAME</span>
            </div>
        </div>


        <div ng-if="item.type === TYPES.DOOR_ENTRY" class="item-entity-container">

            <div class="item-entity">
                <span class="item-entity--icon mdi" ng-class="entityIcon(item, entity)"></span>
            </div>
        </div>


        <div ng-if="item.type === TYPES.ALARM" class="item-entity-container">

            <div class="item-entity">
                <span class="item-entity--icon mdi" ng-class="entityIcon(item, entity)"></span>
            </div>
        </div>


        <div ng-if="item.type === TYPES.WEATHER" class="item-entity-container">
            <div class="weather">
                <div class="weather-icon-container">
                    <div class="weather-icon" ng-if="(_icon = getWeatherIcon(item, entity))">
                        <div class="wu " ng-class="'wu-' + _icon"></div>
                    </div>
                    <div class="weather-icon-image" ng-if="(_imgStyles = getWeatherImageStyles(item, entity))">
                        <div ng-style="_imgStyles"></div>
                    </div>
                </div>

                <div class="weather-temperature" ng-if="item.fields.temperature">
                    <span ng-bind="getWeatherField('temperature', item, entity)"></span>
                    <span ng-bind="getWeatherField('temperatureUnit', item, entity)"></span>
                </div>

                <div class="weather-line" ng-if="item.fields.highTemperature">
                    <span class="weather-line--small-label"
                          ng-bind="getWeatherField('highTemperatureLabel', item, entity) || 'High'"></span>
                    <span ng-bind="getWeatherField('highTemperature', item, entity)"></span>
                    <span ng-bind="getWeatherField('highTemperatureUnit', item, entity)"></span>
                </div>

                <div class="weather-line" ng-if="item.fields.lowTemperature">
                    <span class="weather-line--small-label"
                          ng-bind="getWeatherField('lowTemperatureLabel', item, entity) || 'Low'"></span>
                    <span ng-bind="getWeatherField('lowTemperature', item, entity)"></span>
                    <span ng-bind="getWeatherField('lowTemperatureUnit', item, entity)"></span>
                </div>

                <div class="weather-line -items">
        <span ng-if="item.fields.humidity" class="weather-item">
          <i class="mdi mdi-water"></i>
          <span ng-bind="getWeatherField('humidity', item, entity)"></span>
            <!--
                 --><span ng-bind="getWeatherField('humidityUnit', item, entity)"></span>
        </span>

                    <span ng-if="item.fields.windSpeed" class="weather-item">
          <i class="mdi mdi-weather-windy"></i>
          <span ng-bind="getWeatherField('windSpeed', item, entity)"></span>
                        <!--
                             --><span ng-bind="getWeatherField('windSpeedUnit', item, entity)"></span>
        </span>
                </div>

                <div class="weather-line" ng-repeat="line in item.fields.list">
                    <span ng-bind="getWeatherLine(line, item. entity)"></span>
                </div>

                <!-- DEPRECATED -->
                <div class="weather-line" ng-if="item.fields.apparentTemperature">
                    Feels like
                    <span ng-bind="getWeatherField('apparentTemperature', item, entity)"></span>
                    <span ng-bind="getWeatherField('apparentTemperatureUnit', item, entity)"></span>
                </div>

                <div class="weather-line" ng-if="item.fields.pressure">
                    Pressure
                    <span ng-bind="getWeatherField('pressure', item, entity)"></span>
                    <span ng-bind="getWeatherField('pressureUnit', item, entity)"></span>
                </div>

                <div class="weather-line" ng-if="item.fields.pollen">
                    Pollen
                    <span ng-bind="getWeatherField('pollen', item, entity)"></span>
                </div>

                <div class="weather-line" ng-if="item.fields.precipProbability">
                    <span ng-bind="getWeatherField('precipProbability', item, entity)"></span>
                    <!--
                        --><span ng-bind="getWeatherField('precipProbabilityUnit', item, entity)"></span>
                    chance of rain
                </div>
                <!-- ///DEPRECATED -->
            </div>
        </div>

        <div ng-if="item.type === TYPES.WEATHER_LIST" class="item-entity-container">
            <div class="weather-list">
                <table>
                    <tr class="weather-list-header" ng-hide="item.hideHeader">
                        <th>
                            <span ng-bind="itemField('dateTitle', item, entity) || 'Date'"></span>
                        </th>
                        <th></th>
                        <th>
                            <span ng-bind="itemField('primaryTitle', item, entity) || 'Forecast'"></span>
                        </th>
                        <th class="weather-list-header--secondary">
                            <span ng-bind="itemField('secondaryTitle', item, entity)"></span>
                        </th>
                    </tr>
                    <tr ng-repeat="line in item.list track by $index">
                        <td class="weather-list-date">
                            <div ng-bind="weatherListField('date', line, item, entity)"></div>
                        </td>
                        <td class="weather-list-icon-container">
                            <div class="weather-list-icon" ng-if="(_icon = weatherListIcon(line, item, entity))">
                                <div class="wu " ng-class="'wu-' + _icon"></div>
                            </div>
                            <div class="weather-list-icon-image"
                                 ng-if="(_imgStyles = weatherListImageStyles(line, item, entity))">
                                <div ng-style="_imgStyles"></div>
                            </div>
                        </td>
                        <td class="weather-list--primary">
                            <div ng-bind="weatherListField('primary', line, item, entity)"></div>
                        </td>
                        <td class="weather-list--secondary">
                            <div ng-bind="weatherListField('secondary', line, item, entity)"></div>
                        </td>
                    </tr>
                </table>
            </div>
        </div>

        <div ng-if="item.type === TYPES.CLIMATE" class="item-entity-container">
            <div>
                <div class="item-button -center-right" ng-if="entity.attributes.temperature && entity.state !== 'off'"
                     ng-click="increaseClimateTemp($event, item, entity)">
                    <i class="mdi mdi-plus"></i>
                </div>
                <div class="item-button -bottom-right" ng-if="entity.attributes.temperature && entity.state !== 'off'"
                     ng-click="decreaseClimateTemp($event, item, entity)">
                    <i class="mdi mdi-minus"></i>
                </div>
            </div>

            <div class="item-climate">
                <div class="item-climate--target">
                    <span ng-bind="climateTarget(item, entity)"></span>
                    <span ng-if="(_unit = entityUnit(item, entity))" class="item-climate--target--unit"
                          ng-bind="_unit"></span>
                </div>
                <div class="item-climate--mode" ng-if="entity.attributes.operation_mode" ng-click="openSelect(item)">
                    <span ng-bind="entity.attributes.operation_mode"></span>
                </div>
            </div>

            <div ng-if="selectOpened(item)" class="item-select"
                 ng-style="itemSelectStyles(entity, entity.attributes.operation_list)">

                <div class="item-select--option" ng-repeat="option in entity.attributes.operation_list track by $index"
                     ng-class="{'-active': option === entity.state}"
                     ng-click="setClimateOption($event, item, entity, option)">
                    <span ng-bind="option"></span>
                </div>
            </div>
        </div>


        <div ng-if="item.type === TYPES.MEDIA_PLAYER" class="item-entity-container">

            <div class="media-player-table" ng-class="{'-has-state': _state, '-has-subtitle': _subtitle}">
                <table>
                    <tr>
                        <td class="media-player-table--td-main-button">
                            <div class="media-player--main-button" ng-if="entity.state !== 'off'">
              <span class="mdi mdi-pause" ng-if="entity.state === 'playing'"
                    ng-click="sendPlayer('media_pause', item, entity)"></span>

                                <span class="mdi mdi-stop" ng-if="entity.state === 'playing'"
                                      ng-click="sendPlayer('media_stop', item, entity)"></span>

                                <span class="mdi mdi-play" ng-if="entity.state === 'stopped'"
                                      ng-click="sendPlayer('media_play', item, entity)"></span>

                                <span class="mdi mdi-play" ng-if="entity.state === 'paused'"
                                      ng-click="sendPlayer('media_play', item, entity)"></span>

                                <span class="mdi mdi-play" ng-if="entity.state === 'idle'"
                                      ng-click="sendPlayer('media_play', item, entity)"></span>

                            </div>
                        </td>
                        <td colspan="2" class="media-player-table--td-buttons">
                            <div class="media-player--buttons">
                                <div class="media-player--button -prev" ng-if="entity.state !== 'off'"
                                     ng-click="sendPlayer('media_previous_track', item, entity)">
                                    <i class="mdi mdi-skip-previous"></i>
                                </div>

                                <div class="media-player--button -next" ng-if="entity.state !== 'off'"
                                     ng-click="sendPlayer('media_next_track', item, entity)">
                                    <i class="mdi mdi-skip-next"></i>
                                </div>


                                <div class="media-player--button -power" ng-if=" entity.state === 'off'"
                                     ng-click="sendPlayer('turn_on', item, entity)">
                                    <i class="mdi mdi-power"></i>
                                </div>

                                <div class="media-player--button -power" ng-if=" entity.state !== 'off'"
                                     ng-click="sendPlayer('turn_off', item, entity)">
                                    <i class="mdi mdi-power"></i>
                                </div>
                            </div>
                        </td>
                    </tr>

                    <tr class="media-player-table--space">
                        <td colspan="3"></td>
                    </tr>

                    <tr class="media-player-table--source">
                        <td colspan="3" class="media-player-table--td-source">
                            <div class="media-player--source" ng-click="openSelect(item)"
                                 ng-if="entity.attributes.source_list.length && !item.hideSource">
                                <span ng-bind="entity.attributes.source || 'Source'"></span>
                            </div>
                        </td>
                    </tr>

                    <tr <? /*ng-if="shouldShowVolumeSlider(entity) && (_c = getVolumeConf(item, entity))"*/ ?>>
                        <td colspan="3" class="media-player-table--td-volume">
                            <div class="media-player--volume">
                                <input type="range" ng-model="_c.value" ng-change="volumeChanged(item, entity, _c)"
                                       step="{{ _c.step }}"
                                       min="{{ _c.min }}" max="{{ _c.max }}">
                            </div>
                        </td>
                    </tr>

                    <tr ng-if="shouldShowVolumeButtons(entity)">
                        <td colspan="3" class="media-player-table--td-volume-buttons">
                            <div class="media-player--button -volume_down"
                                 ng-click="sendPlayer('volume_down', item, entity)">
                                <i class="mdi mdi-volume-minus"></i>
                            </div>

                            <div class="media-player--button -volume_up"
                                 ng-click="sendPlayer('volume_up', item, entity)">
                                <i class="mdi mdi-volume-plus"></i>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td colspan="2"></td>
                        <td class="media-player-table--td-mute">
                            <div ng-if="entity.state !== 'off' && !item.hideMuteButton">
                                <div>
                                    <div class="media-player--button -mute" ng-if="entity.attributes.is_volume_muted"
                                         ng-click="mutePlayer(false, item, entity)">
                                        <i class="mdi mdi-volume-mute"></i>
                                    </div>

                                    <div class="media-player--button -mute" ng-if="!entity.attributes.is_volume_muted"
                                         ng-click="mutePlayer(true, item, entity)">
                                        <i class="mdi mdi-volume-high"></i>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>

            <div ng-if="selectOpened(item)" class="item-select"
                 ng-style="itemSelectStyles(entity, entity.attributes.source_list)">

                <div class="item-select--option" ng-repeat="option in entity.attributes.source_list track by $index"
                     ng-class="{'-active': option === entity.attributes.source}"
                     ng-click="setSourcePlayer($event, item, entity, option)">
                    <span ng-bind="option"></span>
                </div>
            </div>
        </div>


    </div>
</script>


<link rel="stylesheet" async href="https://cdn.materialdesignicons.com/2.7.94/css/materialdesignicons.min.css">

</body>

</html>
