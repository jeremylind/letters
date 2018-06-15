import lettersInit from './letters';
import './app.scss';

var container = window.document.getElementById('canvas');
var viewportHeight = window.innerHeight;
var animationTriggered = false;

window.addEventListener('load', function () {
	triggerAnimation();
})

window.addEventListener('scroll', function(event) {
	triggerAnimation();
});

function triggerAnimation() {
	var canvasPosition = percentInView(container);
	if (canvasPosition > 0.5 && animationTriggered == false) {
		animationTriggered = true;
		lettersInit();
	}
}

function percentInView(element) {
	var distanceToTop = element.getBoundingClientRect().top;
	return ((viewportHeight - distanceToTop) / viewportHeight);

}