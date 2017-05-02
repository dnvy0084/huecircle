import Main from './Main';

var canvas;

window.onload = init;
window.onresize = resize;

function init() {
	canvas = document.querySelector('#main_view');
	
	resize();
	new Main();
}

function resize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}
