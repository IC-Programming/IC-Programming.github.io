<?php
/* Copyright © Imesh Chamara 2019 */
//error_reporting(E_ALL);
//ini_set('display_errors', TRUE);
//ini_set('display_startup_errors', TRUE);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header('WebServer: IC-Tech Server; Copyright (c) Imesh Chamara 2019');
_main();
function _main()					{
	$type = $_REQUEST["ty"];
	$action = $_REQUEST["ac"];
	$index = $_REQUEST["in"];
	$value = $_REQUEST["va"];
	$bot = $_REQUEST["bot"];
	$bot = $bot == true || $bot == "true" || $bot == "1";
	if($bot == true)	$coid = null;
	else				$coid = initCookie();
	InitFiles();
	if($type == null)			SendError("Requesting no data type", 4);
	else if($action == null)	SendError("Requesting no action", 5);
	else if($type == "id" && $action == "get")		{
		$id = InitID($coid);
		SendData("\"id\":\"".$coid."\"");
	}
	else if($type == "user" && $action == "login")	{
		$id = InitID($coid);
		$user = $_REQUEST["user"];
		$pass = $_REQUEST["pass"];
		if($user == null)	SendError("Requesting no User account", 6);
		else if($pass == null)	SendError("Requesting User account with no Password", 7);
		$data = json_decode(ReadFile_("ControlPanel/users.json"));
		$len = count($data);
		$ind = -1;
		for($i=0; $i<$len && $ind == -1; $i++)	if($data[$i]->user == $user) $ind = $i;
		//escaping from brute-force attack
		//with 2 seconds
		//*default is 10 seconds
		usleep(2000000);
		if($ind == -1 || $data[$ind]->pass != $pass)	SendError("User account or password did match", 8);
		WriteFile_("ControlPanel/min_1/0".$coid, "{\"user\":\"".$data[$ind]->user."\",\"ac\":".$data[$ind]->access.",\"co\":0}");
		SendData("\"user\":\"".$data[$ind]->user."\",\"name\":\"".$data[$ind]->name."\",\"type\":".$data[$ind]->type);
		/*SendData("\"user\":\"".$data[$ind]->user."\",\"name\":\"".$data[$ind]->name."\",\"type\":".$data[$ind]->type.",\"token\":\"".base64_encode($coid.":".$data[$ind]->pass)."\"");*/
	}
	else if($type == "user" && $action == "get")	{
		$id = InitID($coid);
		$user = ReadFile_($id);
		if($user == "")	SendData("\"user\":null,\"name\":\"Guest User\",\"type\":0");/*SendData("\"user\":null,\"name\":\"Guest User\",\"type\":0,\"token\":null");*/
		$user = json_decode($user);
		$user = $user->user;
		$ind = -1;
		$data = json_decode(ReadFile_("ControlPanel/users.json"));
		$len = count($data);
		for($i=0; $i<$len && $ind == -1; $i++)	if($data[$i]->user == $user) $ind = $i;
		if($ind == -1)	SendError("User account not found", 9);
		//SendData("\"user\":\"".$data[$ind]->user."\",\"name\":\"".$data[$ind]->name."\",\"type\":".$data[$ind]->type.",\"token\":\"".base64_encode($coid.":".$data[$ind]->pass)."\"");
		SendData("\"user\":\"".$data[$ind]->user."\",\"name\":\"".$data[$ind]->name."\",\"type\":".$data[$ind]->type);
	}
	else if($type == "user" && $action == "logout")	{
		$id = InitID($coid);
		$user = ReadFile_($id);
		if($user != "")	WriteFile_($id, "");
		SendData("\"user\":null,\"name\":\"Guest User\",\"type\":0,\"token\":null");
	}
	else if($type == "data" && $action == "update")	{
		$id = InitID($coid);
		$main = json_decode(ReadFile_("ControlPanel/main.json"));
		$data = ReadFile_($id);
		$ac = -1;
		$dc = -1;
		if($data == "")
		{
			$ac = $main->access_code;
			$dc = $main->access == 0 ? -1 : $main->data_code;
		}
		else
		{
			$users = json_decode(ReadFile_("ControlPanel/users.json"));
			$data = json_decode($data);
			$ind = -1;
			$len = count($users);
			for($i=0; $i<$len && $ind == -1; $i++)	if($users[$i]->user == $data->user) $ind = $i;
			$users = $users[$ind];
			if(($users->access == -1 && $data->ac != $main->access) || ($users->access != -1 && $data->ac != $users->access))
			{
				$data->co++;
				$data->ac = $users->access == -1 ? $main->access : $users->access;
				WriteFile_($id,json_encode($data));
			}
			$ac = $data->co;
			$dc = ($users->access == -1 ? $main->access : $users->access) == 0 ? -1 : $main->data_code;
		}		
		SendData("\"update\":[".$ac.",".$dc."]");
	}
	else if($type == "rd" && $action == "get")	{
		if($bot != true)	$id = InitID($coid);
		$main = json_decode(ReadFile_("ControlPanel/main.json"));
		if($bot != true)
		{
			$data = ReadFile_($id);
			$ac = getUserAccess($id, $main, $data, false);
			SendData_(json_encode(array("rd" => ($ac == 0 ? null : $main->robot_data))));
		}
		else
		{
			SendData_Bot("rd ".$main->robot_data);
		}
	}
	else if($type == "ra" && $action == "get")	{
		$id = InitID($coid);
		$main = json_decode(ReadFile_("ControlPanel/main.json"));
		$data = ReadFile_($id);
		$ac = getUserAccess($id, $main, $data, false);
		SendData_(json_encode(array("ra" => $ac)));
	}
	else if($type == "rd" && $action == "set")	{
		$id = InitID($coid);
		$value = (int)(($value == "" || $value == null || $value == false || $value == 0 || strpos("012345678", $value) === false) ? "0" : $value);
		$main = json_decode(ReadFile_("ControlPanel/main.json"));
		$data = ReadFile_($id);
		$ac = getUserAccess($id, $main, $data, false);
		if($ac < 2)	SendError("Access Denied", 13);
		if($main->access != $value)
		{
			$main->robot_data = $value;
			$main->robot_data_code++;
			WriteFile_("ControlPanel/main.json", json_encode($main));
		}
		SendData("\"rd\":".$value);
	}
	else if($type == "data" && $action == "get")	{
		$id = InitID($coid);
		$main = json_decode(ReadFile_("ControlPanel/main.json"));
		$data = ReadFile_($id);
		$ac = getUserAccess($id, $main, $data);
		SendData_(json_encode(array("access" => $ac,"data" => ($ac == 0 ? null : $main->data))));
	}
	else if($type == "data" && $action == "set")	{
		$id = InitID($coid);
		$value = ($value == "" || $value == null || $value == false || $value == 0) ? 0 : 1;
		if($index == null || $index == "" || ($index != "a" && strpos("012345", $index) === false))
			SendError("Requesting for invalid index", 11);
		$main = json_decode(ReadFile_("ControlPanel/main.json"));
		$data = ReadFile_($id);
		$ac = getUserAccess($id, $main, $data);
		if($index == "a")
		{
			if($ac != 3)	SendError("Access Denied", 12);
			if($main->access != $value)
			{
				$main->access = $value;
				$main->access_code++;
				WriteFile_("ControlPanel/main.json", json_encode($main));
			}
			SendData("\"access\":".$value);
		}
		else
		{
			$index = (int)$index;
			if($ac < 2)	SendError("Access Denied", 13);
			if($main->data[$index] != $value)
			{
				$main->data[$index] = $value;
				$main->data_code++;
				WriteFile_("ControlPanel/main.json", json_encode($main));
			}
			SendData("\"data_".$index."\":".$value);
		}
		SendError("System has gone for wrong direction", 14);
	}
	else if($type == "server" && $action == "get")	SendData_(json_encode(array(
		"name" => "IC-Tech Server",
		"version" => 2.1,
		"version2" => "201904020013",
		"update" => "201904152306",
		"ResponseType" => "ICJD2",
		"Programmer" => array(
			"name" => "Imesh Chamara",
			"emails" => array("imesh1chamara@gmail.com","ic.imesh.chamara@gmail.com"),
			"phone" => array("+94717401880","+94758117557"),
			"links" => array("https://about.me/imesh.chamara/","https://github.com/IC-Programming/","https://www.instagram.com/imeshchamara/","https://www.youtube.com/channel/UCjOItCJ9TyNphWlEoUR7cIw/")
		)
	)));
	else											SendError("No function for the request", 10);
}
function initCookie()				{
	if(!isset($_COOKIE["ic_visitor"]))return SetId();
	return $_COOKIE["ic_visitor"];
}
function generateRandomString()		{
	$length = rand(16, 32);
	$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	$charactersLength = strlen($characters);
	$randomString = '';
	for ($i = 0; $i < $length; $i++)	$randomString .= $characters[rand(0, $charactersLength - 1)];
	return $randomString;
}
function ReadFile_($name)			{
	$file = fopen($name, "r");
	if($file == false)		SendError("Error in opening file", 1);
	$filesize_ = filesize($name);
	if($filesize_ < 0)		SendError("Error in opening file", 2);
	else if($filesize_ == 0)		$filedata_ = "";
	else	$filedata_ = fread($file, $filesize_);
	fclose($file);
	return $filedata_;
}
function WriteFile_($name, $data)	{
	$file = fopen($name, "w");
	if($file == false)		SendError("Error in opening file", 3);
	$filedata = fwrite($file, $data);
	fclose($file);
}
function InitFiles()				{
	$filedata = (int)ReadFile_("ControlPanel/time_min");
	$time_now = time();
	if($filedata < $time_now)
	{
		$different = (int)(($time_now - $filedata) / 60);
		if($different >= 5)
		{
			$files = scandir("ControlPanel/min_1");
			$len = count($files);
			for($i=0;$i<$len;$i++)	if($files[$i] != "." && $files[$i] != "..")	unlink("ControlPanel/min_1/".$files[$i]);
			WriteFile_("ControlPanel/time_min" , $time_now + 60);
		}
		else if($different > 0)
		{
			$files = scandir("ControlPanel/min_1");
			$len = count($files);
			for($i=0;$i<$len;$i++)
			{
				if($files[$i] == "." || $files[$i] == "..")	continue;
				$min = (int)substr($files[$i], 0, 1) + $different;
				if($min <= 5)
				{
					$id = substr($files[$i], 1, strlen($files[$i]) - 1);
					rename("ControlPanel/min_1/".$files[$i], "ControlPanel/min_1/".$min.$id);
				}
				else	unlink("ControlPanel/min_1/".$files[$i]);
			}
			WriteFile_("ControlPanel/time_min" , $time_now + 60);
		}
	}
}
function SendError($Msg,$code)		{
	echo "{\"success\": false,\"error\":\"$Msg\",\"code\":$code}";
	http_response_code(500);
	exit();
}
function BoolStr($boo)				{
	return ($boo?"true":"false");
}
function SendData($response, $success = true, $response_code = 200)	{
	echo "{\"success\":".BoolStr($success).",\"response\":{".$response."}}";
	http_response_code(200);
	exit();
}
function SendData_($response, $success = true)	{
	echo "{\"success\":".BoolStr($success).",\"response\":".$response."}";
	http_response_code(200);
	exit();
}
function SendData_Bot($response, $success = true)	{
	echo "<ic ".($success == true ? "1" : "0")." ".$response." >";
	http_response_code(200);
	exit();
}
function ID_Ex($id)					{
	for($i=0;$i<6;$i++)	if(file_exists("ControlPanel/min_1/".$i.$id))	return "ControlPanel/min_1/".$i.$id;
	return null;
}
function SetId()					{
	while(ID_Ex($coid_ = generateRandomString()) != null)	;
	$t = time();
	$file = "ControlPanel/visitor/data/".date('Y.m.d', $t);
	if(!file_exists($file))	WriteFile_($file, date('l jS \of F Y h:i:s A',$t)."\n");
	WriteFile_($file, date('h:i:s A',$t)."\t".$coid_."\n".ReadFile_($file));
	WriteFile_("ControlPanel/visitor/count", (int)ReadFile_("ControlPanel/visitor/count") + 1);
	WriteFile_("ControlPanel/min_1/0".$coid_, "");
	setcookie("ic_visitor", $coid_, time() + (60 * 60 * 24), "/");
	return $coid_;
}
function InitID($coid_)				{
	$id = ID_Ex($coid_);
	if($id == null)
	{
		$coid_ = SetId();
		$id = "ControlPanel/min_1/0".$coid_;
	}
	else if($id != "ControlPanel/min_1/0".$coid_)
	{
		rename($id, "ControlPanel/min_1/0".$coid_);
		$id = "ControlPanel/min_1/0".$coid_;
	}
	return $id;
}
function getUserAccess($id, $main, $data, $mode = true)	{
	if($data == "")		return ($mod == true ? $main->access : $main->robot_access);
	else
	{
		$data = json_decode(json_decode(ReadFile_("ControlPanel/users.json")));
		$ind = -1;
		$len = count($users);
		for($i=0; $i<$len && $ind == -1; $i++)	if($users[$i]->user == $data->user) $ind = $i;
		$users = $users[$ind];
		if($mod != true)	return ($users->robot_access == -1 ? $main->robot_access : $users->robot_access);
		if(($users->access == -1 && $data->ac != $main->access) || ($users->access != -1 && $data->ac != $users->access))
		{
			$data->co++;
			$data->ac = $users->access == -1 ? $main->access : $users->access;
			WriteFile_($id,json_encode($data));
		}
		return $data->ac;
	}
}
?>
