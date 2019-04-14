<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("WebServer: IC-Tech Server; Copyright (c) Imesh Chamara 2019");
_main();
function _main()					{
	
	$DoNotCreateAccounts = false;
	
	$action = $_REQUEST["ac"];
	$email = $_REQUEST["email"];
	$name = $_REQUEST["name"];
	$user = $_REQUEST["user"];
	$pass = $_REQUEST["pass"];
	$id = $_REQUEST["id"];
	if($action == null)	SendError("Requesting no action", 1);
	else if($action == "signup")	{
		if($DoNotCreateAccounts == true)	SendError("Administrator Closed the process", 15);
		if($email == null)					SendError("Requesting with no email", 2);
		else if($name == null)				SendError("Requesting with no Name", 3);
		else if($user == null)				SendError("Requesting with no UserName", 4);
		else if($pass == null)				SendError("Requesting with no Password", 5);
		$users = ReadFile_("ControlPanel/users.json");
		$users = json_decode($users);
		$len = count($users);
		for($i=0;$i<$len;$i++)	if($users[$i]->email == $email)	SendError("The email already have an account", 15);
		$users = scandir("account");
		$len = count($users);
		for($i=0;$i<$len;$i++)	if($users[$i] != ".." && $users[$i] != "." && json_decode(ReadFile_("account/".$users[$i]))->email == $email)	SendError("The email already have an account", 16);
		$FromName = "IC-Tech";
		$FromEmail = "admin@ic-tech.dx.am";
		$ReplyTo = $FromEmail;
		$Subject = 'Confirm your e-mail address';
		$ToEmail = "ic.imesh.chamara@gmail.com";//$email;
		while(ID_Ex($id = generateRandomString()) != null)	;
		WriteFile_("account/enc_".$id, json_encode(array("id"=>$id,"email"=>$email,"user"=>$user,"name"=>$name,"pass"=>$pass,"time"=>date('l jS \of F Y h:i:s A', time()))));
		$ActiveLink = 'http://ic-tech.dx.am/api/account.php?ac=confirm&id='.$id;
		if(($Content = file_get_contents("Email.html")) === false)	SendError("System files are not opening", 6);
		$Content = str_replace("{{{IC.REP-EMAIL}}}", $ToEmail, $Content);
		$Content = str_replace("{{{IC.REP-LINK}}}", $ActiveLink, $Content);
		$Headers = "MIME-Version: 1.0\n";
		$Headers .= "Content-type: text/html; charset=iso-8859-1\n";
		$Headers .= "From: ".$FromName." <".$FromEmail.">\n";
		$Headers .= "Reply-To: ".$ReplyTo."\n";
		$Headers .= "X-Sender: <".$FromEmail.">\n";
		$Headers .= "X-Mailer: PHP\n"; /*PHP/'.phpversion()*/
		$Headers .= "X-Priority: 1\n";
		$Headers .= "Return-Path: <".$FromEmail.">\n";  
		if(!mail($ToEmail, $Subject, $Content, $Headers))	SendError("Emails are not sending", 7);
		SendData_(json_encode(array("email"=>$email,"user"=>$user,"name"=>$name)));
	}
	else if($action == "confirm")	{
		if($id == null)										SendError("Requesting with no id", 12);
		else if(file_exists("account/ec_".$id))				SendError("Account already confirmed", 13);
		else if(file_exists("account/enc_".$id) == false)	SendError("Account not found", 14);
		rename("account/enc_".$id, "account/ec_".$id);
		$users = ReadFile_("ControlPanel/users.json");
		$users = json_decode($users);
		$len = count($users);
		$user = ReadFile_("account/ec_".$id);
		$user = json_decode($user);
		$users[$len] = array("user"=>$user->user,"name"=>$user->name, "pass"=>$user->pass);
		WriteFile_("ControlPanel/users.json", json_encode($users));
		SendData_(json_encode(array("user"=>$user->user,"name"=>$user->name)));
	}
	else if($type == "server" && $action == "get")	SendData_(json_encode(array(
		"name" => "IC-Tech Server",
		"version" => 2,
		"version2" => "201904102313",
		"update" => "201904110445",
		"ResponseType" => "ICJD2",
		"Programmer" => array(
			"name" => "Imesh Chamara",
			"emails" => array("imesh1chamara@gmail.com","ic.imesh.chamara@gmail.com"),
			"phone" => array("+94717401880","+94758117557"),
			"links" => array("https://about.me/imesh.chamara/","https://github.com/IC-Programming/","https://www.instagram.com/imeshchamara/","https://www.youtube.com/channel/UCjOItCJ9TyNphWlEoUR7cIw/")
		)
	)));
	else											SendError("No function for the request", 11);
}
function SendData_($response, $success = true)	{
	echo "{\"success\":".BoolStr($success).",\"response\":".$response."}";
	http_response_code(200);
	exit();
}
function ID_Ex($id)					{
	if(file_exists("account/ec_".$id))	return "account/ec_".$id;
	else if(file_exists("account/enc_".$id))	return "account/enc_".$id;
	return null;
}
function ReadFile_($name)			{
	$file = fopen($name, "r");
	if($file == false)		SendError("Error in opening file", 8);
	$filesize_ = filesize($name);
	if($filesize_ < 0)		SendError("Error in opening file", 9);
	else if($filesize_ == 0)		$filedata_ = "";
	else	$filedata_ = fread($file, $filesize_);
	fclose($file);
	return $filedata_;
}
function BoolStr($boo)				{
	return ($boo?"true":"false");
}
function WriteFile_($name, $data)	{
	$file = fopen($name, "w");
	if($file == false)		SendError("Error in opening file", 10);
	$filedata = fwrite($file, $data);
	fclose($file);
}
function generateRandomString()		{
	$length = rand(24, 32);
	$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	$charactersLength = strlen($characters);
	$randomString = '';
	for ($i = 0; $i < $length; $i++)	$randomString .= $characters[rand(0, $charactersLength - 1)];
	return $randomString;
}
function SendError($Msg,$code)		{
	echo "{\"success\": false,\"error\":\"$Msg\",\"code\":$code}";
	http_response_code(500);
	exit();
}
?>
