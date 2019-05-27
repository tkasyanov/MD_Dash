<?php
chdir(dirname(__FILE__) . '/../');
include_once("./config.php");
include_once("./lib/loader.php");
include_once("./load_settings.php");


function isJSON($string)
{
    return ((is_string($string) && (is_object(json_decode($string)) || is_array(json_decode($string))))) ? true : false;
}

$method = $_SERVER['REQUEST_METHOD'];
$input = (file_get_contents('php://input'));


if ($method == "POST"):
    if (isJSON($input)) {
        $Record = SQLSelectOne('SELECT * FROM sboard ');
        $Record['config'] = $input;
        $result = SQLUpdateInsert('sboard', $Record);
        print_r($result);
    }
endif;
if ($method == "GET"):
    $Record = SQLSelectOne('SELECT * FROM sboard ');

    $setting = array();
    $info = false;
    $setting["config"] = json_decode($Record["CONFIG"], true);
    if ($setting["config"] == null) $setting["config"]["pages"] = array();
    if ($setting["config"]["customTheme"] ==null) $setting["config"]["customTheme"]= "win10";
    if ((int)$setting["config"]["tileSize"]>0) $setting["config"]["tileSize"] = 150;
    if ($setting["config"]["tileSize"]<75 && (int)$setting["config"]["tileSize"]>0) $setting["config"]["tileSize"] = 75;

    $setting["config"]["tileMargin"] = 6;
    print_r(json_encode($setting));
endif;
?>