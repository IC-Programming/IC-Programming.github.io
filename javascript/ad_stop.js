/* Copyright © Imesh Chamara 2018 */
document.onload = function () {
	document.querySelectorAll("img").forEach(function (a, b) {
		console.log(a);
		if (a.getAttribute('alt') == "www.000webhost.com") {
			a.parentElement.parentElement.style.display = "none";
		}
	});
};
document.querySelectorAll("img").forEach(function (a, b) {
	console.log(a);
	if (a.getAttribute('alt') == "www.000webhost.com") {
		a.parentElement.parentElement.style.display = "none";
	}
});