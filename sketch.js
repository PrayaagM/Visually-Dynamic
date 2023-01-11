let canvas;
let running = true;
let ring;
let mass;
let centerX;
let centerY;
let canvasWidth;
let canvasHeight;
let highlight; // Booelan to indicate whether the minimum speed text should be highlighted or not.
let showMagnitudes = true; // Boolean to indicate whether or not the magnitude of the three forces should be shown or not.
let inputs = {
			"angVelInput" : null,
			"velInput" : null,
			"massSlider" : null
		};


let inputButtons = {
					"angVelButton" : null,
        	        "velButton" : null,
				};


let ringSize = 550;
// The Ring is {ringsize / 30} meters = 20 meters wide.	
// i.e., The scale is 30 pixels = 1 meter.			

// Initial Angular Velocity in radians per second.
let angVel = 1; 

// Maximum Speeds in rad/s and m/s.
let maximumAngSpeed = 20;
let maximumSpeed = 137.5;

// Initial Mass in Kilograms
let initialMass = 5;

// Force Vectors
let gravity;
let normal;
let friction;

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function setup() {
	
	running = true;
	centerX = windowWidth / 2;
	centerY = windowHeight * 0.8 / 2;


	canvas = createCanvas(windowWidth, windowHeight * 0.8);
	canvas.style('z-index', 1); 
	background('white');

	ring = new Ring(centerX, centerY, ringSize);
	mass = new PointMass(ring, 50, angVel / 60, initialMass);
	
	gravity = new GravityForce(mass, initialMass * 9.81, 0, 'green');
	normal = new NormalForce(mass, 5, 0, 'blue');
	friction = new FrictionForce(mass, 5, - HALF_PI, 'red');

	// inputs.angVelInput = createInput();
	// inputs.angVelInput.position(centerX + 0.6 * ring.size, centerY - 0.175 * ring.size);
	// inputButtons.angVelButton = createButton("Update");
	// inputButtons.angVelButton.position(centerX + 0.89 * ring.size, centerY - 0.175 * ring.size);
	// inputButtons.angVelButton.mousePressed(updateAngularVelocity);
	
	
	// inputs.velInput = createInput();
	// inputs.velInput.position(centerX + 0.6 * ring.size, centerY - 0.04 * ring.size);
	// inputButtons.velButton = createButton("Update");
	// inputButtons.velButton.position(centerX + 0.89 * ring.size, centerY - 0.04 * ring.size);
	// inputButtons.velButton.mousePressed(updateVelocity);

	// inputs.massSlider = createSlider(1, 20, 10);
	// inputs.massSlider.position(centerX + 0.6 * ring.size, centerY + 0.080 * ring.size);

}

function draw() {
	centerX = windowWidth / 4;
	centerY = windowHeight / 4;
	fill(255);
	background("light gray");
	rectMode(CENTER);
	rect(centerX, centerY, canvasWidth, canvasHeight);

	stroke(50);
	strokeWeight(1);
	noFill();

	ring.drawRing();
	mass.drawPoint();
	
	gravity.drawForce();
	friction.drawForce();
	normal.drawForce();

	let minSpeedElement = document.getElementById("minimumSpeed");
	let maxSpeedElement = document.getElementById("maximumSpeed");
	if (highlight) {
		minSpeedElement.style.color = "red";
		maxSpeedElement.style.color = "red";
	} else {
		maxSpeedElement.style.color = "black";
		minSpeedElement.style.color = "black";
	}
	minSpeedElement.innerHTML = `Minimum Speed Required: ${round(mass.minimumVel, 2)} m/s = ${round(mass.minimumAngVel, 2)} rad/s`;
	maxSpeedElement.innerHTML = `Speed Capped at ${maximumSpeed} m/s = ${maximumAngSpeed} rad/s`;

	let value = document.getElementById("massSlider").value;
	mass.objectMass = value;
	mass.size = 10 * mass.objectMass;
	document.getElementById("mass").innerHTML = `Mass: ${mass.objectMass} kg`;

	// stroke(0);
	// strokeWeight(0.5);
	// textSize(15);
	// fill(0);
	if (running) {
		normal.updateMagnitude();
		normal.updateDir();

		gravity.updateMagnitude();

		friction.updateDir();
		friction.updateMagnitude();

		document.getElementById("Radius").innerHTML = `Ring's Radius: ${round(ring.radius, 2)}m`;
		document.getElementById("angVel").innerHTML = `Angular Velocity: ${round(mass.angularVelocity * 60, 2)} rad/s`
		document.getElementById("vel").innerHTML = `Velocity: ${round(mass.velocity * 60, 2)} m/s`

		let centripetal_force = mass.objectMass * ((mass.velocity * 60) ** 2) / ring.radius;
		document.getElementById("Centripetal").innerHTML = `Centripetal Force (mv^2/R): ${round(centripetal_force, 2)} N`;
		document.getElementById("angle").innerHTML = `Angle Theta: ${round(normal.dir, 2)}`

		let magnitudes;
		if (showMagnitudes) {
			magnitudes = { 
							"Weight" : [round(gravity.mag, 2), gravity.colour], 
							"Normal" : [round(normal.mag, 2), normal.colour],
							"Friction" : [round(friction.mag, 2), friction.colour]};
		} else magnitudes = ["", "", ""];

		Object.keys(magnitudes).forEach((label) => {
			let element = document.getElementById(label);
			element.innerHTML = `${label} (N): ${magnitudes[label][0]}`;
			element.style.color = magnitudes[label][1];
			console.log(magnitudes[label][1]);
		});

		

		// textSize(20);
		// fill(gravity.colour);
		// text(`Weight: ${magnitudes[0]} N`, centerX - ring.size, 200);
		// fill(normal.colour);
		// text(`Normal Force: ${magnitudes[1]} N`, centerX - ring.size, 240);
		// fill(friction.colour);
		// text(`Frictional Force: ${magnitudes[2]} N`, centerX - ring.size, 280);

		// fill('black')
		// let centripetal_force = mass.objectMass * ((mass.velocity * 60) ** 2) / ring.radius;
		// text(`Centripetal Force (mv^2/R): ${round(centripetal_force, 2)} N`, centerX - ring.size, 320);

		// text(`Angle Theta: ${round(normal.dir, 2)}`, centerX - ring.size, 360);


		mass.theta += mass.angularVelocity;
		if (mass.theta >= TWO_PI) mass.theta -= TWO_PI;
		if (mass.theta < 0) mass.theta += TWO_PI; 
		mass.updatePosition();
		}

	if (!running) {
		fill(0);
		stroke(0);
		strokeWeight(1);
		drawingContext.setLineDash([5, 15]);
		line(ring.x,ring.y,mass.position.x,mass.position.y);
		line(ring.x, ring.y, ring.x, ring.y + ring.size / 2);
		drawingContext.setLineDash([]);
		strokeWeight(0.2);
		text(`θ=${round(normal.dir, 2)}`, ring.x + 20, ring.y);
	}

	//mass.objectMass = inputs.massSlider.value();
	//mass.size = mass.objectMass * 5;

}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
  }

function playPause() {
	if (running) {
		running = false;
		document.getElementsByClassName("PlayPauseButton")[0].innerHTML = "Play";

	} else {
		running = true;

		document.getElementsByClassName("PlayPauseButton")[0].innerHTML = "Pause";
	}
}


function updateAngularVelocity() {
	let value = document.getElementById("angVelInput").value;
	if (running) {
		if (!(isNaN(value) || value == "")) {
			value = parseFloat(value);
			if ((abs(value) >= mass.minimumAngVel) && (abs(value) <= maximumAngSpeed)) {
				mass.angularVelocity = value / 60;
				mass.updateVelocity();
				document.getElementById("angVelInput").value = null;
			}
			else {
				highlight = true;
				setTimeout(() => {highlight = false}, 2500);
				//let inputtedAngVel = abs(value);
				//alert(`${inputtedAngVel} rad/s = ${inputtedAngVel * ring.radius} m/s, which is less than the minimum speed.`);
			}
	}
		
	}

}

function updateVelocity() {
	let value = document.getElementById("velInput").value;
	if (running == true) {
		if (!(isNaN(value) || value == "")) {
			value = parseFloat(value);

			if ((abs(value) >= mass.minimumVel) && (abs(value) <= maximumSpeed)) {
				mass.velocity = value / 60;
				mass.updateAngularVelocity();
				document.getElementById("velInput").value = null;
			} else {
				highlight = true;
				setTimeout(() => {highlight = false}, 2500);

				
				//let inputtedVel = abs(parseFloat(value));
				//alert(`${inputtedVel} m/s is less than the minimum speed.`);
			}
		}
	}
}

function updateObjectMass() {
	let value = document.getElementById("massSlider").value;
	mass.objectMass = value;
	mass.size = 5 * mass.objectMass;
}

// oninput = "updateObjectMass()"