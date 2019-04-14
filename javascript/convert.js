/* Copyright © Imesh Chamara 2019 */
var txtin = document.getElementById("txtin");
var txtout = document.getElementById("txtout");
var logBtn = document.getElementById("logBtn");
var logKey = document.getElementById("logKey");
var hostLocation = document.location.origin;
var dataset1 = null;
var dataset2 = null;
txtin.oninput = changed;
var logWait = null;
var onresize_State = 0;
function changed() {
    if (dataset1 == null || dataset2 == null)
        return;
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
function match1(str, mo) {
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
	server.onreadystatechange = function () {
		if (server.readyState == 4) {
			var JS = JSON.parse(server.responseText);
			fn(JS, server);
		}
	};
	server.send(null);
}
Getdataset(function (JS1, server1) {
    dataset1 = JS1["IC.WebSite.Page_Convert.DataSet_1"].Data;
    Getdataset(function (JS2, server2) {
        dataset2 = JS2["IC.WebSite.Page_Convert.DataSet_2"].Data;
		txtin.value = "imeaSh chaamara nirmaaNaya karana ladha akShara parivarthana \"Web\" pituva.\nmemagin pasuven si\\nhala \"Unicode\" akShara labaa gatha hAka.";
		changed();
		document.getElementById("ic-p-cont").style.display = "table";
		document.getElementById("ic-p-load").style.display = "none";
		auto_grow(txtin);
		auto_grow(txtout);
    }, "/api/convert/DataSet_2.json");
}, "/api/convert/DataSet_1.json");
document.body.onresize = onresize;
function onresize()
{
	if(dataset1 == null || dataset2 == null)
	{
		return;
	}
	if((onresize_State == 0) || (onresize_State == 1 && document.body.offsetWidth > 540) || (onresize_State == 2 && document.body.offsetWidth <= 540))
	{
		changed();
		auto_grow(txtin);
		auto_grow(txtout);
		if(document.body.offsetWidth > 540)
		{
			onresize_State = 2;
		}
		else
		{
			onresize_State = 1;
		}
	}
}
function auto_grow(element) {
	if(document.body.offsetWidth > 540) return;
    txtout.style.height = "5px";
    txtout.style.height = (txtout.scrollHeight)+"px";
    txtin.style.height = "5px";
    txtin.style.height = (txtin.scrollHeight)+"px";
}
