<?php
// error_reporting(E_ALL);
// ini_set('display_errors', 1);

session_start();
require 'vendor/autoload.php';

use Core\Core;

$app = new Core;


if(!isset($_SESSION['rule']) and !isset($_COOKIE['uniq']))
{
	$_SESSION['rule']=0;
	
	$expire = time() + (365 * 24 * 60 * 60);
	setcookie('uniq', session_id(), $expire, '/');
	
	$route = (!isset($_GET['page'])) ? 'index' : $_GET['page'];
	$app->route($route);
	unset($_SESSION['rule']);
	//$app->start();
}
else
if(!isset($_SESSION['rule']) and isset($_COOKIE['uniq']))
{
	$expire = time() + (365 * 24 * 60 * 60);
	setcookie('uniq', $_COOKIE['uniq'], $expire, '/');
	
	$app->start();
	$route = (!isset($_GET['page'])) ? 'index' : $_GET['page'];
	$app->route($route);
}
else
if(isset($_SESSION['rule']) and isset($_COOKIE['uniq']))
{
	$route = (!isset($_GET['page'])) ? 'index' : $_GET['page'];
	$app->route($route);
}






foreach($app->logs as $log)
{
	echo "<script>console.log(". json_encode($log) . ");</script>";
}

?>