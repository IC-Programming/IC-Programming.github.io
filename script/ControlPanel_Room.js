/* Copyright © Imesh Chamara 2019 */
var ic_p_sta_ico = document.getElementById("ic_p_sta_ico");
var ic_p_sta_dis = document.getElementById("ic_p_sta_dis");
var ic_p_lig1 = document.getElementById("ic_p_lig1");
var ic_p_lig2 = document.getElementById("ic_p_lig2");
var ic_p_lig3 = document.getElementById("ic_p_lig3");
var ic_p_lig4 = document.getElementById("ic_p_lig4");
var ic_p_fan1 = document.getElementById("ic_p_fan1");
var ic_p_fan2 = document.getElementById("ic_p_fan2");
var ic_p_acc = document.getElementById("ic_p_acc");
var ic_p_acc_i = document.getElementById("ic_p_acc_i");
var ic_p_acc_na = document.getElementById("ic_p_acc_na");
var ic_p_log = document.getElementById("ic_p_log");
var ic_p_log_u = document.getElementById("ic_p_log_u");
var ic_p_log_p = document.getElementById("ic_p_log_p");
var ic_p_log_n = document.getElementById("ic_p_log_n");
var ic_p_itm = document.getElementById("ic_p_itm");
var ic_p_load = document.getElementById("ic_p_load");
var ic_p_fai = document.getElementById("ic_p_fai");
var ic_p_fai_msg = document.getElementById("ic_p_fai_msg");
var ic_p_fai_btn = document.getElementById("ic_p_fai_btn");
var ic_p_logout = document.getElementById("ic_p_logout");
var ic_p_login = document.getElementById("ic_p_login");
ic_p_lig1.onclick = function (){if(access == 0)return;setData("0",SwiAct(ic_p_lig1));};
ic_p_lig2.onclick = function (){if(access == 0)return;setData("1",SwiAct(ic_p_lig2));};
ic_p_lig3.onclick = function (){if(access == 0)return;setData("2",SwiAct(ic_p_lig3));};
ic_p_lig4.onclick = function (){if(access == 0)return;setData("3",SwiAct(ic_p_lig4));};
ic_p_fan1.onclick = function (){if(access == 0)return;setData("4",SwiAct(ic_p_fan1));};
ic_p_fan2.onclick = function (){if(access == 0)return;setData("5",SwiAct(ic_p_fan2));};
var ic_p_sta_icocls = [ "fa-sync-alt", "fa-check-circle", "fa-times-circle", "fa-lock", "fa-eye-slash", "fa-dizzy"];
var ic_p_acc_icls = ["fa-user-circle", "fa-user-tie", "fa-user-secret"];
var UsDa = null;
var UsTy = 0;
var AC = -1, DC = -1;
var DontLoadData = true;
var dataupdate = null;
var access = 0;
var data = null;
var update_speed_a = 0;
var update_speed_m = 0;
var DataUpdate_hand = null;
var status_ = -1;
/*Please use the secondary server as api server*/
/*Because my servers has limited web traffic*/
var rootURL = loadRoot();/*"http://ic-tech-s2.dx.am/";*/
var http_connection_fails = 0;
HttpReq_XHR_Data("GET", rootURL + "api/ControlPanel.php?ty=user&ac=get", null, function (res, Status) {
	res = JSON.parse(res);
	if(res.success != true)
	{
		if(res.error != null && res.error != undefined) ReloadError(res.error);
		return;
	}
	DataUpdate_hand = setInterval(DataUpdate, 1500);
	update_speed_m = 0;
	UsDa = res.response;
	setSta(1);
	SetUser();
	resetOk();
});
function HideElements()	{
	ic_p_log.style.display = "none";
	ic_p_itm.style.display = "none";
	ic_p_acc.style.display = "none";
	ic_p_load.style.display = "none";
	ic_p_fai.style.display = "none";
}
function ShowError(msg)	{
	HideElements();
	ic_p_fai.style.display = "block";
	DontLoadData = true;
	ic_p_fai_msg.innerText = msg;
	setSta(5);
	dataupdate = null;
	access = 0;
}
function ReloadError(msg)	{
	HideElements();
	ic_p_fai.style.display = "block";
	ic_p_fai_msg.innerText = msg;
	ic_p_fai_btn.innerText = "Reload";
	ic_p_fai_btn.onclick = function(){location.reload();};
	DontLoadData = true;
	dataupdate = null;
	setSta(5);
	access = 0;
}
function ShowLoading()	{
	HideElements();
	ic_p_load.style.display = "block";
	DontLoadData = true;
	setSta(0);
	dataupdate = null;
	access = 0;
}
function setSta(st)		{
	if(status_ == st)
		return;
	status_ = st;
	if(st == 0)			ic_p_sta_dis.innerText = "Loading";
	else if(st == 1)	ic_p_sta_dis.innerText = "Online";
	else if(st == 2)	ic_p_sta_dis.innerText = "Offline";
	else if(st == 3)	ic_p_sta_dis.innerText = "Locked";
	else if(st == 4)	ic_p_sta_dis.innerText = "Closed";
	else				ic_p_sta_dis.innerText = "Error";
	for(var i=0; i<6; i++)	ic_p_sta_ico.classList.remove(ic_p_sta_icocls[i]);
	if(st >= 0 && st <= 4)	ic_p_sta_ico.classList.add(ic_p_sta_icocls[st]);
	else 					ic_p_sta_ico.classList.add(ic_p_sta_icocls[5]);
}
function loadRoot()		{
    var str = document.URL;
    var pos = 0;
    var ind = str.indexOf("/", pos);
    while (ind < str.length && ind >= 0) {
        pos = ind + 1;
        if (str.substr(ind - 1, 1) != ":" && str.substr(ind - 1, 1) != "/") {
            str = str.substr(0, ind) + "/";
            ind = -1;
        }
        else	ind = str.indexOf("/", pos);
    }
    return str;
}
function HttpReq_XHR_Data(meth, url, data, call)	{
	var xhr;
	if (window.XMLHttpRequest)	xhr = new XMLHttpRequest();
	else						xhr = new ActiveXObject("Microsoft.XMLHTTP");
	/*xhr.open(meth, url + ((url.indexOf("?") >= 0 ? "&" : "?") + "t=" + new Date().getTime()));*/
	if(url.indexOf("?") >= 0)	url += "&";
	else 						url += "?";
	url += "t=" + new Date().getTime();
	xhr.open(meth, url);
	if (data != undefined && data != null)	xhr.setRequestHeader("IC-Web-Data", atob(data));
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4 && xhr.status != 0) {
			http_connection_fails = 0;
			if(xhr.response) {
				try {
					JSON.parse(xhr.response);
					call(xhr.response, xhr.status);
				} catch(e) {
					errorcal();
				}
			}
			else	errorcal();
			function errorcal(){call("{\"success\":false,\"error\":\"Server response error\"}", xhr.status);}
		}
	};
	xhr.onerror = function (e) {
		if(e.target.status == 0)
		{
			http_connection_fails++;
			if(http_connection_fails >= 10 && DontLoadData != true)
			{
				ReloadError("The Webpage can't connect to the server. Try again in a few moments.");
				setSta(2);
			}
		}
		else console.log(e);
	};
	xhr.send(null);
}
function SetUser()		{
	for(var i=0; i<3; i++)	ic_p_acc_i.classList.remove(ic_p_acc_icls[i]);
	ic_p_acc_i.classList.add(ic_p_acc_icls[UsDa.type]);
	ic_p_acc_na.innerText = UsDa.name;
	/*ic_p_logout.style.display =UsDa.type == 0? "none" : "block";
	ic_p_login.style.display =UsDa.type == 0? "block" : "none";*/
	if(UsDa.type == 0)
	{
		ic_p_logout.style.display ="none";
		ic_p_login.style.display ="block";
	}
	else
	{
		ic_p_logout.style.display ="block";
		ic_p_login.style.display ="none";
	}
}
function SwiAct(el, v)	{
	if(v == undefined || v == null)	v = !el.classList.contains("fa-toggle-on");
	var rem, add;
	if(v != false)	{rem = "fa-toggle-off";add = "fa-toggle-on";}
	else			{rem = "fa-toggle-on";add = "fa-toggle-off";}
	el.classList.remove(rem);
	el.classList.add(add);
	return v;
}
function accclick()		{
	if(ic_p_log.style.display == "none" || ic_p_log.style.display == "")	ic_p_log.style.display = "block";
	else	ic_p_log.style.display = "none";
	if(ic_p_log.style.display == "block")
	ic_p_log_n.style.display = "none";
}
function logout()		{
	HttpReq_XHR_Data("GET", rootURL + "api/ControlPanel.php?ty=user&ac=logout", null, function (res, Status) {
		ShowLoading();
		if(res == "" || res == null || res == undefined || (res = JSON.parse(res)).success != true)
		{
			if(res != "" && res.error != null && res.error != undefined) ShowError(res.error);
			return;
		}
		UsDa = res.response;
		setSta(1);
		SetUser();
		resetOk();
	});
}
function login()		{
	if(ic_p_log_u.value == "")
	{
		ic_p_log_n.style.display = "block";
		return;
	}
	ShowLoading();
	HttpReq_XHR_Data("GET", rootURL + "api/ControlPanel.php?ty=user&ac=login&" + encodeURI("user=" + ic_p_log_u.value + "&pass=" + ic_p_log_p.value), null, function (res, Status) {
		if(res == "" || res == null || res == undefined || (res = JSON.parse(res)).success != true)
		{
			if(res != "" && res.error != null && res.error != undefined) ShowError(res.error);
			return;
		}
		/*DontLoadData = false;
		ic_p_itm.style.display = "block";
		ic_p_acc.style.display = "flex";
		UsDa = res.response;
		SetUser();*/
		document.getElementById("ic_p_log_f").submit();
	});
}
function resetOk()		{
	DontLoadData = false;
	ic_p_log.style.display = "none";
	ic_p_itm.style.display = "block";
	ic_p_acc.style.display = "flex";
	ic_p_fai.style.display = "none";
	ic_p_load.style.display = "none";
}
function setData(n, v)	{
	if(v == 0 || v == false || v == null || v == undefined)	v = "0";
	else	v = "1";
	HttpReq_XHR_Data("GET", rootURL + "api/ControlPanel.php?ty=data&ac=set&" + encodeURI("in=" + n + "&va=" + v), null, function (res, Status) {
		if(res == "" || res == null || res == undefined || (res = JSON.parse(res)).success != true)
		{
			if(res != "" && res.error != undefined && res.error != null) ShowError(res.error);
			return;
		}
	});
}
function DataUpdate()	{
	if(DontLoadData == true) return;
	HttpReq_XHR_Data("GET", rootURL + "api/ControlPanel.php?ty=data&ac=update", null, function (res, Status) {
		if(res == "" || res == null || res == undefined || (res = JSON.parse(res)).success != true)
		{
			if(res != "" && res.error != undefined && res.error != null) ShowError(res.error);
			return;
		}
		var _dataupdate = res.response.update;
		if(dataupdate != null && _dataupdate[0] == dataupdate[0] && _dataupdate[1] == dataupdate[1])
		{
			update_speed_a++;
			if(update_speed_m < 2 && update_speed_a > 8)
			{
				update_speed_a = 0;
				/*update_speed_m = update_speed_m == 0 ? 1 : 2;*/
				if(update_speed_m == 0) update_speed_m = 1;
				else					update_speed_m = 2;
				clearInterval(DataUpdate_hand);
				/*DataUpdate_hand = setInterval(DataUpdate, update_speed_m == 1 ? 3000 : 6000);*/
				if(update_speed_m == 1)	DataUpdate_hand = setInterval(DataUpdate, 3000);
				else					DataUpdate_hand = setInterval(DataUpdate, 6000);
			}
			return;
		}
		if(update_speed_m != 0)
		{
			update_speed_m = 0;
			clearInterval(DataUpdate_hand);
			DataUpdate_hand = setInterval(DataUpdate, 1500);
		}
		dataupdate = _dataupdate;
		HttpReq_XHR_Data("GET", rootURL + "api/ControlPanel.php?ty=data&ac=get", null, function (res, Status) {
			if(res == "" || res == null || res == undefined || (res = JSON.parse(res)).success != true)
			{
				if(res != "" && res.error != undefined && res.error != null) ShowError(res.error);
				return;
			}
			data = res.response;
			/*setSta(data.access == 1 ? 3 : (data.access == 2 ? 1 : 5));*/
			if(data.access == 1)		setSta(3);
			else if(data.access == 2)	setSta(1);
			else						setSta(5);
			if(data.access == 2)	access = 1;
			else					access = 0;
			if(data.access == 0)
			{
				ReloadError("This page was blocked by the administrator. Try again in a few moments.");
				document.getElementById("ic_p_err_bi").style.display = "block";
				setSta(4);
			}
			else
			{
				SwiAct(ic_p_lig1, data.data[0] != 0);
				SwiAct(ic_p_lig2, data.data[1] != 0);
				SwiAct(ic_p_lig3, data.data[2] != 0);
				SwiAct(ic_p_lig4, data.data[3] != 0);
				SwiAct(ic_p_fan1, data.data[4] != 0);
				SwiAct(ic_p_fan2, data.data[5] != 0);
			}
		});
	});
}
