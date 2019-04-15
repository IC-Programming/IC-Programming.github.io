/* Copyright © Imesh Chamara 2019 */
var ic_p_sta_ico = document.getElementById("ic_p_sta_ico");
var ic_p_sta_dis = document.getElementById("ic_p_sta_dis");
var ic_p_acc = document.getElementById("ic_p_acc");
var ic_p_acc_i = document.getElementById("ic_p_acc_i");
var ic_p_acc_na = document.getElementById("ic_p_acc_na");
var ic_p_log = document.getElementById("ic_p_log");
var ic_p_log_u = document.getElementById("ic_p_log_u");
var ic_p_log_p = document.getElementById("ic_p_log_p");
var ic_p_log_n = document.getElementById("ic_p_log_n");
var ic_p_load = document.getElementById("ic_p_load");
var ic_p_fai = document.getElementById("ic_p_fai");
var ic_p_fai_msg = document.getElementById("ic_p_fai_msg");
var ic_p_fai_btn = document.getElementById("ic_p_fai_btn");
var ic_p_logout = document.getElementById("ic_p_logout");
var ic_p_login = document.getElementById("ic_p_login");

var IC_RobotControl =	{
	keymap: {},
	canvas : null,
	lstvalue : -1,
	value : 0,
	onChanged : null,
	/*car : new Image(),*/
	init : function ()		{
		this.canvas = document.getElementById("IC_RobotControl_canvas");
        this.canvas.width = 480;
        this.canvas.height = 480;
		/*this.car.src = "http://localhost:9999/1450414843.png";*/
        this.context = this.canvas.getContext("2d");
		this.x = 0;
		this.y = 0;
		this.cx = 0;
		this.cy = 0;
		this.ox = -1;
		this.oy = -1;
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		document.onkeydown  = function (e)		{
			e = e || event;
			if(e.target.nodeName == "INPUT")return;
			var key = IC_RobotControl.keyman(e.keyCode);
			if(key != 0)
			{
				e.preventDefault();
				IC_RobotControl.keymap[key] = true;
				IC_RobotControl.keyupdate();
				return false;
			}
		};
		document.onkeyup  = function (e)		{
			e = e || event;
			if(e.target.nodeName == "INPUT")return;
			var key = IC_RobotControl.keyman(e.keyCode);
			if(key != 0)
			{
				IC_RobotControl.keymap[key] = false;
				IC_RobotControl.keyupdate();
				e.preventDefault();
				return false;
			}
		};
		this.canvas.onmousedown = function(e)	{
			e = e || event;
			e.preventDefault();
			IC_RobotControl.keymap[5] = (e.buttons & 1) == 1;
			mouse(e);
		};
		document.onmouseup = function(e)		{
			e = e || event;
			IC_RobotControl.keymap[5] = (e.buttons & 1) == 1;
			if(!IC_RobotControl.keymap[5])
			{
				IC_RobotControl.x = (IC_RobotControl.width / 3);
				IC_RobotControl.y = (IC_RobotControl.height / 3);
				IC_RobotControl.value = 0;
				IC_RobotControl.draw();
			}
		};
		document.onmousemove = mouse;
		this.canvas.addEventListener("touchstart", onTouch, false);
		this.canvas.addEventListener("touchend", onTouch, false);
		this.canvas.addEventListener("touchcancel", onTouch, false);
		this.canvas.addEventListener("touchmove", onTouch, false);
		IC_RobotControl.x = (IC_RobotControl.width / 3);
		IC_RobotControl.y = (IC_RobotControl.height / 3);
		IC_RobotControl.value = 0;
		this.draw();
		function onTouch(evt)	{
			evt.preventDefault();
			if (evt.touches.length > 1 || (evt.type == "touchend" && evt.touches.length > 0))
				return;
			var newEvt = document.createEvent("MouseEvents");
			var type = null;
			var touch = null;
			switch (evt.type)	{
			case "touchstart":
				type = "mousedown";
				touch = evt.changedTouches[0];
			break;
			case "touchmove":
				type = "mousemove";
				touch = evt.changedTouches[0];
			break;
			case "touchend":
				type = "mouseup";
				touch = evt.changedTouches[0];
			break;
			}
			newEvt.initMouseEvent(type, true, true, evt.target.ownerDocument.defaultView, 0, touch.screenX, touch.screenY, touch.clientX, touch.clientY, evt.ctrlKey, evt.altKey, evt.shiftKey, evt.metaKey, 0, null);
			evt.target.ownerDocument.dispatchEvent(newEvt);
		}
		function mouse(e)	{
			if (IC_RobotControl.keymap[5])	{
				IC_RobotControl.x = (e.clientX - IC_RobotControl.canvas.offsetLeft) - ((IC_RobotControl.width / 3) / 2);
				IC_RobotControl.y = (e.clientY - IC_RobotControl.canvas.offsetTop) - ((IC_RobotControl.height / 3) / 2);
				if(IC_RobotControl.x < 0)										IC_RobotControl.x = 0;
				else if(IC_RobotControl.x > (IC_RobotControl.width / 3) * 2)	IC_RobotControl.x = (IC_RobotControl.width / 3) * 2;
				if(IC_RobotControl.y < 0)										IC_RobotControl.y = 0;
				else if(IC_RobotControl.y > (IC_RobotControl.height / 3) * 2)	IC_RobotControl.y = (IC_RobotControl.height / 3) * 2;
				var _X = (IC_RobotControl.x + ((IC_RobotControl.width / 3) / 2)) / (IC_RobotControl.width / 3),
				_Y = (IC_RobotControl.y + ((IC_RobotControl.height / 3) / 2)) / (IC_RobotControl.height / 3);
				if(_X >= 2 && _Y >= 2)		IC_RobotControl.value = 6;
				else if(_X >= 2 && _Y <= 1)	IC_RobotControl.value = 4;
				else if(_X >= 2 && _Y <= 2)	IC_RobotControl.value = 5;
				else if(_X <= 1 && _Y >= 2)	IC_RobotControl.value = 8;
				else if(_X <= 1 && _Y <= 1)	IC_RobotControl.value = 2;
				else if(_X <= 1 && _Y <= 2)	IC_RobotControl.value = 1;
				else if(_Y >= 2)	IC_RobotControl.value = 7;
				else if(_Y <= 1)	IC_RobotControl.value = 3;
				else if(_Y <= 2)	IC_RobotControl.value = 0;
				/*var dx = IC_RobotControl.x - (IC_RobotControl.width / 3),
				dy = IC_RobotControl.y - (IC_RobotControl.width / 3),
				dist = Math.sqrt(dx * dx + dy * dy);
				if(dist < (IC_RobotControl.height / 3))*/
				IC_RobotControl.draw();
			}
		};
	},
	keyman : function(num)	{
		if(num == 37 || num == 65) return 1;
		else if(num == 38 || num == 87)	return 2;
		else if(num == 39 || num == 68)	return 3;
		else if(num == 40 || num == 83)	return 4;
		else if(num > 47 && num < 58)	return (num - 38);
		else if(num > 95 && num < 106)	return (num - 86);
		return 0;
	},
	keyupdate : function()	{
		IC_RobotControl.x = (IC_RobotControl.width / 3);
		IC_RobotControl.y = (IC_RobotControl.height / 3);
		if(IC_RobotControl.keymap[1])		IC_RobotControl.x -= IC_RobotControl.x;
		else if(IC_RobotControl.keymap[3])	IC_RobotControl.x += IC_RobotControl.x;
		if(IC_RobotControl.keymap[2])		IC_RobotControl.y -= IC_RobotControl.y;
		else if(IC_RobotControl.keymap[4])	IC_RobotControl.y += IC_RobotControl.y;
		if(IC_RobotControl.keymap[1] && IC_RobotControl.keymap[2])		IC_RobotControl.value = 2;
		else if(IC_RobotControl.keymap[1] && IC_RobotControl.keymap[4])	IC_RobotControl.value = 8;
		else if(IC_RobotControl.keymap[3] && IC_RobotControl.keymap[2])	IC_RobotControl.value = 4;
		else if(IC_RobotControl.keymap[3] && IC_RobotControl.keymap[4])	IC_RobotControl.value = 6;
		else if(IC_RobotControl.keymap[1])								IC_RobotControl.value = 1;
		else if(IC_RobotControl.keymap[2])								IC_RobotControl.value = 3;
		else if(IC_RobotControl.keymap[3])								IC_RobotControl.value = 5;
		else if(IC_RobotControl.keymap[4])								IC_RobotControl.value = 7;
		else															IC_RobotControl.value = 0;
		IC_RobotControl.draw();
	},
	clear : function()		{
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	draw : function()		{
		if(IC_RobotControl.lstvalue != IC_RobotControl.value && IC_RobotControl.onChanged != null)
		{
			IC_RobotControl.lstvalue = IC_RobotControl.value;
			IC_RobotControl.onChanged(IC_RobotControl.value);
		}
		IC_RobotControl.clear();
		var _X = IC_RobotControl.width / 3;
		var _Y = IC_RobotControl.height / 3;
        ctx = this.context;
		
		ctx.beginPath();
		ctx.fillStyle = "#e8e8e8";
		var __X=0,__Y=0;
		if(IC_RobotControl.value == 0)		{__X=_X;	__Y=_Y;		}
		else if(IC_RobotControl.value == 1)	{__X=0;		__Y=_Y;		}
		else if(IC_RobotControl.value == 2)	{__X=0;		__Y=0;		}
		else if(IC_RobotControl.value == 3)	{__X=_X;	__Y=0;		}
		else if(IC_RobotControl.value == 4)	{__X=_X*2;	__Y=0;		}
		else if(IC_RobotControl.value == 5)	{__X=_X*2;	__Y=_Y;		}
		else if(IC_RobotControl.value == 6)	{__X=_X*2;	__Y=_Y*2;	}
		else if(IC_RobotControl.value == 7)	{__X=_X;	__Y=_Y*2;	}
		else if(IC_RobotControl.value == 8)	{__X=0;		__Y=_Y*2;	}
		/*ctx.rect(__X, __Y, _X, _Y);*/
		ctx.ellipse(__X + (_X / 2), __Y + (_Y / 2), _X / 2, _Y / 2, 0, 0, 7);
		ctx.closePath();
		ctx.fill();
		
		ctx.strokeStyle = "#00f";
		ctx.beginPath();
		ctx.setLineDash([5, 5]);
		for(var i=0; i<4; i++)	{
			ctx.moveTo(i * _X, 0);
			ctx.lineTo(i * _X, 3 * _Y);
			ctx.moveTo(0, i * _Y);
			ctx.lineTo(3 * _X, i * _Y);
		}
		ctx.stroke();
		ctx.strokeStyle = "#f00";
		ctx.beginPath();
		ctx.ellipse(IC_RobotControl.width / 2, IC_RobotControl.height / 2, IC_RobotControl.width / 6 * 2, IC_RobotControl.height / 6 * 2, 0, 0, 7);
		ctx.stroke();
		ctx.beginPath();
		ctx.ellipse(IC_RobotControl.width / 2, IC_RobotControl.height / 2, IC_RobotControl.width / 2, IC_RobotControl.height / 2, 0, 0, 7);
		ctx.stroke();
		ctx.beginPath();
		ctx.ellipse(IC_RobotControl.width / 2, IC_RobotControl.height / 2, IC_RobotControl.width / 6, IC_RobotControl.height / 6, 0, 0, 7);
		ctx.stroke();
		ctx.setLineDash([]);
		
		ctx.beginPath();
		ctx.fillStyle = "#000";
		ctx.ellipse(IC_RobotControl.x + (_X / 2), IC_RobotControl.y + (_Y / 2), _X / 2, _Y / 2, 0, 0, 7);
		ctx.closePath();
		ctx.fill();
	}/*,
	update : function()		{
		IC_RobotControl.x += IC_RobotControl.cx;
		IC_RobotControl.y += IC_RobotControl.cy;
		if(IC_RobotControl.ox == IC_RobotControl.x && IC_RobotControl.oy == IC_RobotControl.y)	return;
		IC_RobotControl.keyupdate();
		IC_RobotControl.ox = IC_RobotControl.x;
		IC_RobotControl.oy = IC_RobotControl.y;
	},
	start : function()		{
		this.interval = setInterval(this.update, 20);
	},
	stop : function()		{
		clearInterval(interval);
	}*/
};
var ic_p_sta_icocls = [ "fa-sync-alt", "fa-check-circle", "fa-times-circle", "fa-lock", "fa-eye-slash", "fa-dizzy"];
var ic_p_acc_icls = ["fa-user-circle", "fa-user-tie", "fa-user-secret"];
var UsDa = null;
var UsTy = 0;
var AC = -1;
var DontLoadData = true;
var dataupdate = null;
var access = 0;
var data = null;
var DataUpdate_hand = null;
var status_ = -1;
/*Please use the secondary server as api server*/
/*Because my servers has limited web traffic*/
var rootURL = loadRoot();/*"http://ic-tech-s2.dx.am/";*/
var http_connection_fails = 0;
function HideElements()		{
	ic_p_log.style.display = "none";
	ic_p_acc.style.display = "none";
	ic_p_load.style.display = "none";
	ic_p_fai.style.display = "none";
	IC_RobotControl.canvas.style.display = "none";
}
function ShowError(msg)		{
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
function ShowLoading()		{
	HideElements();
	ic_p_load.style.display = "block";
	DontLoadData = true;
	setSta(0);
	dataupdate = null;
	access = 0;
}
function setSta(st)			{
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
function loadRoot()			{
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
function resetOk()		{
	DontLoadData = false;
	ic_p_log.style.display = "none";
	ic_p_acc.style.display = "flex";
	ic_p_fai.style.display = "none";
	ic_p_load.style.display = "none";
	IC_RobotControl.canvas.style.display = "block";
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
function DataUpdate()	{
	if(DontLoadData) return;
	HttpReq_XHR_Data("GET", rootURL + "api/ControlPanel.php?ty=ra&ac=get", null, function (res, Status) {
		res = JSON.parse(res);
		if(res.success != true)
		{
			if(res.error != null && res.error != undefined) ShowError(res.error);
			return;
		}
		data = res.response;
		access = data.ra;
		if(access == 0)
		{
			ReloadError("This page was blocked by the administrator. Try again in a few moments.");
			document.getElementById("ic_p_err_bi").style.display = "block";
			setSta(4);
		}
		else		setSta(1);
	});
}
function start()		{
	IC_RobotControl.init();
	ShowLoading();
	HttpReq_XHR_Data("GET", rootURL + "api/ControlPanel.php?ty=user&ac=get", null, function (res, Status) {
		res = JSON.parse(res);
		if(res.success != true)
		{
			if(res.error != null && res.error != undefined) ReloadError(res.error);
			return;
		}
		DataUpdate_hand = setInterval(DataUpdate, 4000);
		UsDa = res.response;
		setSta(1);
		SetUser();
		resetOk();
	});
	IC_RobotControl.onChanged = function (value)
	{
		if(access == 0)	return;
		HttpReq_XHR_Data("GET", rootURL + "api/ControlPanel.php?ty=rd&ac=set&va=" + value, null, function (res, Status) {
			res = JSON.parse(res);
			if(res.success != true)
			{
				if(res.error != null && res.error != undefined) ShowError(res.error);
				return;
			}
		});
	};
}