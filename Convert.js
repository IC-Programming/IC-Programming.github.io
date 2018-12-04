var txtin = document.getElementById("txtin");
var txtout = document.getElementById("txtout");
var logBtn = document.getElementById("logBtn");
var logKey = document.getElementById("logKey")
var hostLocation = document.location.origin;
var dataset1 = null;
var dataset2 = null;
txtin.oninput = changed;
var logWait = null;
function changed() {
	if (dataset1 == null || dataset2 == null)
		GetData(() => {
			changed();
		});
	else {
		var str1 = txtin.value;
		var str2 = "";
		while (str1 != "") {
			var ma = match1(str1, 1);
			if (ma[0] != -1) {
				str1 = str1.substring(ma[1], str1.length);
				str2 += dataset1[ma[0]][2];
				if (dataset1[ma[0]][1] == 1) {
					ma = match1(str1, 2);
					if (ma[0] != -1) {
						str1 = str1.substring(ma[1], str1.length);
						str2 += dataset2[ma[0]][1];
					}
				}
			}
			else {
				var str3 = str1.substring(0, 2);
				var pos = 0;
				if (str3 != "\"\"" && str3.startsWith("\"")) {
					var ind = str1.indexOf("\"", 1);
					while (ind >= 0) {
						pos = ind;
						var str3 = str1.substring(ind, ind + 2);
						if (str3 != "\"\"" && str3.startsWith("\"")) {
							ind = -2;
						}
						else
							ind = str1.indexOf("\"", ind + 1);
					}
					if (ind != -2) {
						pos == 0;
					}
				}
				if (str3 == "\"\"" && pos == 0) {
					str2 += str1.substring(0, 1);
					str1 = str1.substring(2, str1.length);
				}
				else {
					str2 += str1.substring(pos != 0 ? 1 : 0, pos != 0 ? pos : 1);
					str1 = str1.substring(pos + 1, str1.length);
				}
			}
		}
		txtout.value = str2;
	}
}
function match1(str, mo)
{
	var datas = [];
	var datasCount = 0;
	for (var i = 0; i < (mo == 1? dataset1: dataset2).length; i++)
	{
		if (str.startsWith(mo == 1 ? dataset1[i][0] : dataset2[i][0])) {
			datas[datasCount] = [i, (mo == 1 ? dataset1[i][0] : dataset2[i][0]).length];
			datasCount++;
		}
	}
	var Max = [-1, -1];
	for (var i = 0; i < datasCount; i++)
		if (datas[i][1] > Max[1])
			Max = datas[i];
	return Max;
}
function Getdataset(fn, link) {
	var server = new XMLHttpRequest();
	server.open("GET", hostLocation + link);
	server.onreadystatechange = () => {
		if (server.readyState == 4) {
			var JS = JSON.parse(server.responseText);
			fn(JS, server);
		}
	}
	server.send(null);
}
function GetData(fn)
{
	Getdataset((JS1, server1) => 
	{
		dataset1 = JS1["IC.WebSite.Page_Convert.DataSet_1"].Data;
		Getdataset((JS2, server2) => 
		{
			dataset2 = JS2["IC.WebSite.Page_Convert.DataSet_2"].Data;
			fn();
		}, "/api/convert/DataSet_2.json"); 
	}, "/api/convert/DataSet_1.json");
}
function login()
{
	logBtn.style.display = "none";
	logWait = setInterval(()=>
	{
		logBtn.style.display = "block";
	}, 2000);
	Getdataset((JS1, server1) => 
	{
		var keys = JS1["IC.WebSite.Page_Convert.TempKeys"].Data;
		var keyMatch = 0;
		for(var i=0; i<keys.length; i++)
			if(logKey.value == keys[i])
				keyMatch = 1;
		if(keyMatch == 0)
			logKey.style.border = "2px solid rgb(204, 28, 0)";
		else
			document.getElementById("logfrm").style.display = "none";
	}, "/api/convert/temp_keys.json")
}
function logKeyIn()
{
	if(logKey.style.border == "2px solid rgb(204, 28, 0)")
		logKey.style.border = "solid 2px #007acc";
}
