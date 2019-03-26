<?php
header('Access-Control-Allow-Origin: mySite.com/');

$video_id = (string)$_POST["video_id"]; 
$keyword = (string)$_POST["keyword"]; 
$name = (string)$_POST["name"]; 
$lang_code = (string)$_POST["lang_code"]; 

$url = "myServer.com/get_times?video_id=" . $video_id . "&keyword=" . $keyword . "&name=" . $name . "&lang_code=" . $lang_code;
$html = file_get_contents($url);

echo $html;
?>