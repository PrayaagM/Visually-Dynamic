class PointMass {

    constructor(orbitalRing, size, angularVelocity, mass) {
        
        // Diameter of Mass in Pixels 
        //          USED FOR DRAWING PURPOSES
        this.size = size;

        // Radius of Mass in Meters
        //          USED FOR PHYSICS CALCULATIONS (IN FUTURE FOR ROLLING MOTION)
        this.radius = this.size / 2 / 60;

        this.orbit = orbitalRing;

        this.objectMass = mass;

        this.origin = {"x": orbitalRing.x, 
                       "y": orbitalRing.y};

        // Angular Velocity of point mass about this.origin measured in radians per frame.
        this.angularVelocity = angularVelocity;               
        
        // Initializing Position (initial position is at the bottom of the ring)
        this.position = {"x" : this.origin.x,
                         "y" : this.origin.y + (this.orbit.size / 2 - this.size / 2)};

        // Initializing Linear Velocity in meters per frame           
        this.velocity = this.orbit.radius * this.angularVelocity;
        
        // Initial Angle (CCW, 0 radians from positive x-axis => - PI / 2 radians at bottom of ring)
        this.theta = 3 * HALF_PI;

        // Declaring the minimum speed that the mass requires based on the radius of the ring
        //      (in meters per second)
        this.minimumVel = sqrt(this.orbit.radius * 9.81);

        // Declaring the minimum angular speed that the mass requires based on the radius of the ring
        //      (in radians per second)
        this.minimumAngVel = this.minimumVel / this.orbit.radius;

    }

    drawPoint() {
        strokeWeight(2);
        stroke(51);
        fill(0);
        ellipse(this.position.x, this.position.y, this.size);
    }


    updatePosition() {

        this.position.x = this.origin.x + cos(this.theta) * (this.orbit.size / 2 - this.size / 2);
        this.position.y = this.origin.y - sin(this.theta) * (this.orbit.size / 2 - this.size / 2);


    }

    updateVelocity() {

        this.velocity = this.orbit.radius * this.angularVelocity;
    }

    updateAngularVelocity() {

        this.angularVelocity = this.velocity / this.orbit.radius;

    }

    showMass(state) {
        if (state == true) {
            // MAKE THIS A P5JS DIV AND THEN USE .remove() WHEN STATE IS FALSE
            textSize(11);
            fill(255);
            rectMode(RADIUS);
            text(this.objectMass, this.position.x - 5, this.position.y - 5, this.radius, this.radius);
        } 
    }
}