global.decomp = require('poly-decomp');

import './app.scss';
import lettersInit from './letters';
import scrollInit from './scroller';

var container = window.document.getElementById('canvas');
var viewportHeight = window.innerHeight;
var animationTriggered = false;
var cursorIcon = window.document.getElementById('cursor-hint');

window.addEventListener('load', function () {
	triggerAnimation();
	scrollInit();
})

window.addEventListener('scroll', function(event) {
	triggerAnimation();
	scrollInit();
});

function triggerAnimation() {
	var canvasPosition = percentInView();
	if (canvasPosition > 0.8 && animationTriggered == false) {
		animationTriggered = true;
		if (GetIEVersion() === 0) {
			lettersInit();
			cursorIcon.classList.add('visible');
		}
	}
}

export default function percentInView() {
	var distanceToTop = container.getBoundingClientRect().top;
	var percent = (viewportHeight - distanceToTop) / viewportHeight;
	return percent;

}

function GetIEVersion() {
  var sAgent = window.navigator.userAgent;
  var Idx = sAgent.indexOf("MSIE");

  // If IE, return version number.
  if (Idx > 0) 
    return parseInt(sAgent.substring(Idx+ 5, sAgent.indexOf(".", Idx)));

  // If IE 11 then look for Updated user agent string.
  else if (!!navigator.userAgent.match(/Trident\/7\./)) 
    return 11;

  else
    return 0; //It is not IE
}