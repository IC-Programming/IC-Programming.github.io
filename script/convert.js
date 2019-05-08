/* Copyright © Imesh Chamara 2019 */
var txtin = document.getElementById("txtin");
var txtout = document.getElementById("txtout");
var logBtn = document.getElementById("logBtn");
var logKey = document.getElementById("logKey");
var ic_p_fai = document.getElementById("ic_p_fai");
var ic_p_cont = document.getElementById("ic-p-cont");
var ic_p_load = document.getElementById("ic-p-load");
var hostLocation = document.location.origin;
var dataset1 = null;
var dataset2 = null;
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
            if (str3 != "\"\"" && str3.indexOf("\"") == 0) {
                var ind = str1.indexOf("\"", 1);
                while (ind >= 0) {
                    pos = ind;
                    var str3 = str1.substring(ind, ind + 2);
                    ind = (str3 != "\"\"" && str3.indexOf("\"") == 0) ? -2 : str1.indexOf("\"", ind + 1);
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
	for (var i = 0; i < (mo == 1 ? dataset1: dataset2).length; i++)
	{
		if (str.indexOf(mo == 1 ? dataset1[i][0] : dataset2[i][0]) == 0) {
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
function ReloadError(msg)	{
	ic_p_cont.style.display = "none";
	ic_p_load.style.display = "none";
	ic_p_fai.style.display = "block";
	ic_p_fai_msg.innerText = msg;
	ic_p_fai_btn.onclick = function(){location.reload();};
}
function Getdataset(fn, addr) {
	var url = hostLocation + addr;
	var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
	xhr.open("GET", url + ((url.indexOf("?") >= 0 ? "&" : "?") + "t=" + new Date().getTime()));
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4 && xhr.status != 0) {
			if(xhr.response) {
				try {
					fn(JSON.parse(xhr.response));
				} catch(e) {
					ReloadError("Server response error. (EC: 0xA2 >>> " + e + " <)");
				}
			}
			else
				ReloadError("Server response error. (EC: 0xA1)");
		}
	};
	xhr.onerror = function (e) {
		if(e.target.status == 0)
		{
			ReloadError("The Webpage can't connect to the server. Try again in a few moments.");
		}
		else console.log(e);
	};
	xhr.send(null);
}
function onresize()
{
	if(dataset1 == null || dataset2 == null)
		return;
	if((onresize_State == 0) || (onresize_State == 1 && document.body.offsetWidth > 540) || (onresize_State == 2 && document.body.offsetWidth <= 540))
	{
		changed();
		auto_grow(txtin);
		auto_grow(txtout);
		onresize_State = document.body.offsetWidth > 540 ? 2 : 1;
	}
}
function auto_grow(element) {
	if(document.body.offsetWidth > 540) return;
    txtout.style.height = "5px";
    txtout.style.height = (txtout.scrollHeight)+"px";
    txtin.style.height = "5px";
    txtin.style.height = (txtin.scrollHeight)+"px";
}

Getdataset(function (JS1) {
    dataset1 = JS1["IC.WebSite.Page_Convert.DataSet_1"].Data;
    Getdataset(function (JS2) {
        txtin.oninput = changed;
		txtin.value = "imeaSh chaamara nirmaaNaya karana ladha akShara parivarthana \"Web\" pituva.\nmemagin pasuven si\\nhala \"Unicode\" akShara labaa gatha hAka.";
		dataset2 = JS2["IC.WebSite.Page_Convert.DataSet_2"].Data;
		changed();
		document.getElementById("ic-p-cont").style.display = "table";
		document.getElementById("ic-p-load").style.display = "none";
		auto_grow(txtin);
		auto_grow(txtout);
    }, "/api/convert/DataSet_2.json");
}, "/api/convert/DataSet_1.json");
document.body.onresize = onresize;
