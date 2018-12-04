/* Copyright © Imesh Chamara 2018 */
function HttpReq_XHR(meth, url, data, call) {
	var xhr;
	if (window.XMLHttpRequest) {
		xhr = new XMLHttpRequest();
	} else {
		xhr = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xhr.open(meth, url);
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			call(xhr.response, xhr.status);
		}
	};
	xhr.send(data);
}
function HttpReq_XHR_Data(meth, url, data, call) {
	var xhr;
	if (window.XMLHttpRequest) {
		xhr = new XMLHttpRequest();
	} else {
		xhr = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xhr.open(meth, url);
	if (data != undefined && data != null)
		xhr.setRequestHeader("IC-Web-Data", atob(data));
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			call(xhr.response, xhr.status);
		}
	};
	xhr.send(null);
}
function HttpReq_Ajax(meth, url, ty, data, call, head) {
	$.ajax({
		type: meth,
		url: url,
		headers:head,
		data: data,
		dataType: ty,
		cache: false,
		success: function (data) {
			if (data.message) {
				call(data, -1);
			}
			else {
				call(data, 0);
			}
		},
		error: function (data) {
			if (data.status == 200 && data.readyState == 4 && data.responseText) {
				call(data.responseText, 0);
			}
			else {
				call(data, -1);
			}
		}
	});
}
