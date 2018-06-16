import percentInView from './index';

var rollerWords = window.document.getElementById('roller-chrome').getElementsByClassName('roll-phrase');
var rollerWordsCount = rollerWords.length;
var wordSegmentLength = rollerWordsCount - 2;

var scrollerOffset = 0.33;

export default function scrollInit() {
	var position = setScale(percentInView(), 1 / (1 - scrollerOffset), scrollerOffset);
	for (var i = rollerWords.length - 1; i >= 0; i--) {
		var wordPosition = setScale2(position, 5, i * 9 / 10);
		rollerWords[i].style.top = getPosition(wordPosition) + '%';
		rollerWords[i].style.opacity = getOpacity(wordPosition);
		rollerWords[i].style.filter = 'blur(' + getBlur(wordPosition) + 'px)';
		rollerWords[i].style.transform = 'translate(-50%, -50%) scale(' + getSize(wordPosition) + ')';
	}
}

function trim(number, max, min) {
	if (max || min) {
		return Math.min(Math.max(number, min), max);
	}
	if (max) {
		return Math.min(number, max);
	}
	if (min) {
		return Math.max(number, min);
	}
	return number;
}

function setScale(x, slope, offset) {
	var scale = slope * (x - offset);
	return scale;
}

function setScale2(x, slope, offset) {
	var scale = (slope * x) - offset;
	return scale;
}

function getPosition(x) {
	var position = 2 * Math.sin( (x - 0.5) / Math.PI ) + 0.5;
	return (1 - position) * 100;
}

function getOpacity(x) {
	var position = -4 * Math.pow((x - 0.5), 2) + 1;
	position = setScale(position, 0.5, -1);
	return trim(position, 1, 0);
}

function getSize(x) {
	var position = -2 * Math.pow((x - 0.5), 2) + 1;
	position = setScale(position, 0.5, -1);
	return trim(position, 1, 0);
}

function getBlur(x) {
	var position = -4 * Math.pow((x - 0.5), 2) + 1;
	position = setScale(position, 0.5, -1);
	return trim((1 - position), 1, 0) * 5;
}

