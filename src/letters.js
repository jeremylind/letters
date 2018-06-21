import decomp from 'poly-decomp';
import Pathseg from 'pathseg';
import Matter from 'matter-js';

// module aliases
var Engine = Matter.Engine,
	Render = Matter.Render,
	World = Matter.World,
	Composites = Matter.Composites,
	MouseConstraint = Matter.MouseConstraint,
	Mouse = Matter.Mouse,
	Common = Matter.Common,
	Events = Matter.Events,
	Bodies = Matter.Bodies,
	Body = Matter.Body,
	Vector = Matter.Vector,
	Vertices = Matter.Vertices,
	Sleeping = Matter.Sleeping;


// App configuration
var container = window.document.getElementById('canvas');
// export var canvasWidth = container.clientWidth;
// export var canvasHeight = container.clientHeight;
export var canvasWidth = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;
export var canvasHeight = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;
var pixelRatio = window.devicePixelRatio;
var letterFlytime = 45;
var letterHangtime = 180,
	letterRows,
	letters;

// App Infrastructure
var engine,
	render;

// Config options for letter bodies
var fillStyle = '#7a0709',
	lineWidth = false,
	strokeStyle = 'transparent',
	restitution = 0,
	density = 0.2

var letterPartsOptions = {
	render: {
		fillStyle: fillStyle,
		lineWidth: lineWidth,
		strokeStyle: strokeStyle
	},
	restitution: restitution,
	density: density
}

// Responsive functions
var resizeTimer;
window.addEventListener('resize', function(e) {
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(function() {
		canvasWidth = container.clientWidth;
		canvasHeight = container.clientHeight;
		
		Render.stop(render);
		World.clear(engine.world);
		Engine.clear(engine);
		render.canvas.remove();
		render.canvas = null;
		render.context = null;
		render.textures = {};

		lettersInit();
	          
	}, 250);
});

//Letter Generators
function pathA (x, y) {
	var verticiesA = [
		Bodies.fromVertices(x - 4.468, y, Vertices.fromPath('9.04 0 0 23.9 5.29 23.9 11.65 5.89 14.42 0 9.04 0'), letterPartsOptions),
		Bodies.fromVertices(x + 4.468 , y, Vertices.fromPath('17.91 23.9 23.36 23.9 14.42 0 9.04 0 11.65 5.89 17.91 23.9'), letterPartsOptions),
		Bodies.fromVertices(x, y + 4.668, Vertices.fromPath('19.91 14.66 3.49 14.66 2.01 18.57 21.36 18.57 19.91 14.66'), letterPartsOptions)
	]
	var pathA = Body.create({
		parts: verticiesA,
		label: 'A'
	});
	return pathA;
}

function pathW (x, y) {
	var verticiesW = [ 
		Bodies.fromVertices(x - 9.873, y, Vertices.fromPath('0 0 5.25 0 9.04 16.27 11.65 23.9 6.33 23.9 0 0'), letterPartsOptions),
		Bodies.fromVertices(x - 3.447, y, Vertices.fromPath('6.33 23.9 11.65 23.9 15.63 7.63 18.17 0 13.25 0 9.04 16.27 6.33 23.9'), letterPartsOptions),
		Bodies.fromVertices(x + 3.447, y, Vertices.fromPath('13.25 0 18.17 0 22.26 16.47 24.97 23.9 19.75 23.9 15.63 7.63 13.25 0'), letterPartsOptions),
		Bodies.fromVertices(x + 9.873, y, Vertices.fromPath('26.24 0 31.39 0 24.97 23.9 19.75 23.9 22.26 16.47 26.24 0'), letterPartsOptions)
	]
	var pathW = Body.create({
		parts: verticiesW,
		label: 'W'
	});
	return pathW;
}

function pathE (x, y) {
	var verticiesE = [
		//vertical
		Bodies.rectangle(x - 6.44, y, 5.26, 23.9, letterPartsOptions),
		// top
		Bodies.rectangle(x, y - 9.74, 17.87, 4.43, letterPartsOptions),
		// middle
		Bodies.rectangle(x, y, 15.83, 4.08, letterPartsOptions),
		// bottom
		Bodies.rectangle(x, y + 9.74, 18.14, 4.43, letterPartsOptions),
	]
	var pathE = Body.create({
		parts: verticiesE,
		label: Common.choose(['E', 'E1'])
	});
	return pathE;
}

function pathS (x, y) {
	var pathS = Bodies.circle(x, y, 12.5, {
		render: {
			fillStyle: 'transparent',
			lineWidth: lineWidth,
			strokeStyle: strokeStyle,
			sprite: {
				texture: 'img/path-s.svg'
			}
		},
		restitution: restitution,
		density: density,
		label: 'S'
	});
	return pathS;
}

function pathO (x, y) {
	var pathO = Bodies.circle(x, y, 13.5, {
		render: {
			fillStyle: 'transparent',
			lineWidth: lineWidth,
			strokeStyle: strokeStyle,
			sprite: {
				texture: 'img/path-o.svg'
			}
		},
		restitution: restitution,
		density: density,
		label: 'O'
	});
	return pathO;
}

function pathM (x, y) {
	var verticiesM = [
		Bodies.fromVertices(x - 10.37, y + 0.1, Vertices.fromPath('0 23.9 4.92 23.9 4.99 7.13 4.25 0 0 0 0 23.9'), letterPartsOptions),
		Bodies.fromVertices(x - 4, y, Vertices.fromPath('14.89 23.9 12.98 16.43 7.4 0 3.7 0 4.99 7.13 10.84 23.9 14.89 23.9'), letterPartsOptions),
		Bodies.fromVertices(x + 4, y, Vertices.fromPath('10.84 23.9 14.89 23.9 20.82 6.96 22.38 0 18.34 0 12.98 16.43 10.84 23.9'), letterPartsOptions),
		Bodies.fromVertices(x + 10.37, y + 0.25, Vertices.fromPath('25.74 23.9 25.74 0 21.5 0 20.82 6.96 20.82 23.9 25.74 23.9'), letterPartsOptions)
	]
	var pathM = Body.create({
		parts: verticiesM,
		label: 'M'
	});
	return pathM;
}

function choosePath (x, y) {
	var path = Common.choose('AWESOME'.split(''));
	switch(path) {
		case 'A':
			return pathA(x, y);
		case 'W':
			return pathW(x, y);
		case 'E':
			return pathE(x, y);
		case 'S':
			return pathS(x, y);
		case 'O':
			return pathO(x, y);
		case 'M':
			return pathM(x, y);
	}
}

function makeLetters() {
	return Composites.stack(50, -(letterRows * 125), letterRows, letterRows, ((canvasWidth - 100) / (letterRows + 1)), 100, function(x, y) {
		var randX = x + Common.random(-40,40);
		var randY = y + Common.random(-40,40)
		var path = choosePath(randX, randY);
		Body.applyForce(path, {x: randX, y: randY}, { x: Common.random(-0.1, 0.1), y: Common.random(-0.1, 0.1)});
		return path;
	})
}

function getDistance(x1, y1, x2, y2) {
	var a = x1 - x2;
	var b = y1 - y2;

	var c = Math.sqrt( a*a + b*b );
	return c;
}

function getForce(x1, y1, x2, y2) {
	var vector = {x: x2 - x1, y: y2 - y1};
	return Vector.div(vector, 90);
}

function restoreLetter(letter, letterMass, letterInertia) {
	var explosionPosition = {x: letter.position.x + Common.random(-3, 3), y: letter.position.y + Common.random(-1, -2)};
	var explosionForce = {x: Common.random(-4, 4), y: Common.random(-2, -4)};
	Body.setStatic(letter, false);
	Body.setMass(letter, letterMass);
	Body.setInertia(letter, letterInertia);
	Body.applyForce(letter, explosionPosition, explosionForce);
}

function letterSelect(mousePosition) {
	var word = ['A', 'W', 'E', 'S', 'O', 'M', 'E1']
	var awesome = [];
	word.forEach(function(letter, i) {

		var letterSet = letters.bodies.filter(function(value) {
			if (value.label == letter && value.isStatic === false) {
				return true;
			}
			return false;
		});
		var randomLetter = letterSet[Math.floor(Math.random() * (letterSet.length))];
		awesome.push(randomLetter);
	});

	awesome.forEach(function(letter, i) {
		setTimeout(function() {
			letterControl(mousePosition, letter);
		}, 150 * i);
	});
}

function getLetterOffset(label) {
	switch(label) {
		case 'A':
			return { x: -75.401, y: -19 };
		case 'W':
			return { x: -48.963, y: -20 };
		case 'E':
			return { x: -22.787, y: -20 };
		case 'S':
			return { x: 0.62, y: -20 };
		case 'O':
			return { x: 24, y: -20 };
		case 'M':
			return { x: 51.45, y: -20 };
		case 'E1':
			return { x: 76.5, y: -20 };
	}
}

function letterControl(mousePosition, letter) {
	Sleeping.set(letter, false);
	var letterPosition = {x: letter.position.x, y: letter.position.y };
	var letterMass = letter.mass;
	var letterInertia = letter.inertia;
	var letterAngle = letter.angle;
	var letterLabel = letter.label;
	var letterOffset = getLetterOffset(letterLabel);
	var mousePositionOffset = mousePosition.x + letterOffset.x;
	var counter = 0;

	Body.setStatic(letter, true);
	Events.on(engine, 'beforeUpdate', function moveLetter() {
		if (counter < letterFlytime) {
			counter += 1;
			var frame = (Math.pow(counter, 4) / Math.pow(letterFlytime, 4)) * letterFlytime;
			var vector = { x: letterPosition.x - (((letterPosition.x - mousePositionOffset) / letterFlytime) * frame), y: letterPosition.y - (((letterPosition.y - (mousePosition.y + letterOffset.y)) / letterFlytime)) * frame };
			var angle = letterAngle + ((counter / letterFlytime) * (0 - letterAngle));
			Body.setPosition(letter, vector);
			Body.setAngle(letter, angle);
			return;
		}
		Events.off(engine, 'beforeUpdate', moveLetter);
		setTimeout( function() {
			restoreLetter(letter, letterMass, letterInertia);
		}, (letterHangtime * 10));
	});
	container.addEventListener('click', letterClick);
}

var letterClick = function (e) {
	container.removeEventListener('click', letterClick);
	letterSelect({x: e.pageX - this.offsetLeft, y: e.pageY - this.offsetTop});
}

export default function lettersInit() {
	engine = Engine.create();
	engine.timing.timeScale = 0.85;
	engine.enableSleeping = true;
	render = Render.create({
		element: container,
		engine: engine,
		options: {
			width: canvasWidth,
			height: canvasHeight,
			wireframes: false,
			showSleeping: false,
			pixelRatio: pixelRatio,
			background: 'transparent'
		}
	});

	// Sizing for letter composite
	var letterCount = Math.min((canvasWidth / 100) * 20, 225);
	letterRows = Math.round(Math.sqrt(letterCount));

	// create static objects
	var wallOptions = {
		fillStyle: 'transparent',
		lineWidth: false,
		strokeStyle: 'transparent',
	}
	var ground = Bodies.rectangle(canvasWidth / 2, canvasHeight + 5, canvasWidth, 10, { isStatic: true, render: wallOptions });
	var leftWall = Bodies.rectangle(-5, canvasHeight * 2.5, 5, canvasHeight * 5, { isStatic: true, render: wallOptions });
	Body.rotate(leftWall, -0.261799, {x: 0, y: canvasHeight});
	var rightWall = Bodies.rectangle(canvasWidth, canvasHeight * 2.5, 1, canvasHeight * 5, { isStatic: true, render: wallOptions });
	Body.rotate(rightWall, 0.261799, {x: canvasWidth, y: canvasHeight});
	letters = makeLetters();

	container.addEventListener('click', letterClick);

	function repelLetters(mouseLocation) {
		letters.bodies.forEach( function(ball) {
			var distance = getDistance(mouseLocation.x, mouseLocation.y, ball.position.x, ball.position.y );
			if (distance < 100) {
				Body.applyForce(ball, {x: mouseLocation.x, y: mouseLocation.y}, getForce(mouseLocation.x, mouseLocation.y, ball.position.x, ball.position.y));
			}
		});
	}

	container.addEventListener('mousemove', function(e) {
		var mouseLocation = {x: e.pageX - this.offsetLeft, y: e.pageY - this.offsetTop};
		repelLetters(mouseLocation);
	});

	container.addEventListener('touchmove', function(e) {
		var mouseLocation = {x: e.pageX - this.offsetLeft, y: e.pageY - this.offsetTop};
		repelLetters(mouseLocation);
	});

	// render.canvas.addEventListener('mousedown', function (event) {
	// 	letterSelect({x: event.x, y: event.y});
	// });

	World.bounds = {min: { x: -Infinity, y: -Infinity }, max: { x: canvasWidth * 2, y: canvasHeight * 2 }}
	// add all of the bodies to the world
	World.add(engine.world, [ground, leftWall, rightWall, letters]);

	// keep the mouse in sync with rendering
	// render.mouse = mouse;

	// run the engine
	Engine.run(engine);

	Render.run(render);
	
}

// init();
