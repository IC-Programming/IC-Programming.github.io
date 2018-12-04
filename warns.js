function warnAdd(id, text) {
	var str = "<div id=\"warn_" + id + "\" class=\"warn warn-1\"><span class=\"warn-l\">" + text + "</span><div class=\"butX\" onclick=\"delclk(\'warn_" + id + "\');\"/></div>";
	document.getElementById("root").innerHTML += str;
}
function delclk(id) {
	document.getElementById(id).remove();
}
