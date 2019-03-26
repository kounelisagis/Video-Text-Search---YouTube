<?php
header('Access-Control-Allow-Origin: mySite.com/');

$video_id = (string)$_POST["video_id"]; 

$url = "myServer.com/get_options?video_id=" . $video_id;
$html = file_get_contents($url);

echo $html;
?>