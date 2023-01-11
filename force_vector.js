class Force {

    constructor(object, magnitude, direction, colour) {
        // Represents the object the force acts on
        this.object = object;

        // Represents the magnitude of the force in Newtons
        this.mag = magnitude;

        // Represents the direction of the force as an angle in radians where theta = 0 represents
        // a force straight to the right, and the angle increases positively in a counter clockwise direction.
        this.dir = direction;

        // A string representing the colour of the vector
        this.colour = colour

    }
    // MAKE DRAW FORCE UNIQUE TO EACH FORCE CLASS
    drawForce() {

        let lx1 = this.object.position.x;
        let ly1 = this.object.position.y;
        let lx2 = lx1 + this.mag * sin(this.dir);
        let ly2 = ly1 + this.mag * cos(this.dir);

        let tx1 = lx2 - this.object.radius / 8 - 10;
        let ty1 = ly2;
        let tx2 = lx2 + this.object.radius / 8 + 10;
        let ty2 = ly2;
        let tx3 = lx1;
        let ty3 = ly2 + 20 * cos(this.dir);

        
        stroke(this.colour);
        fill(this.colour);
        line(lx1, ly1, lx2, ly2);
        //triangle(tx1, ty1, tx2, ty2, tx3, ty3);
    }

}

class GravityForce extends Force {

    constructor(object, magnitude, direction, colour) {
        super(object, magnitude, direction, colour);

    }

    updateMagnitude() {
        this.mag = this.object.objectMass * 9.81;
    }

}


class NormalForce extends Force {

    constructor(object, magnitude, direction, colour) {
        super(object, magnitude, direction, colour);
    }


    drawForce() {
        let lx1 = this.object.position.x;
        let ly1 = this.object.position.y;
        let lx2 = lx1 + this.mag / 2 * sin(this.dir + PI);
        let ly2 = ly1 + this.mag / 2 * cos(this.dir + PI);

        stroke(this.colour);
        fill(this.colour);
        line(lx1, ly1, lx2, ly2);

    }

    updateMagnitude() {

        // (mv^2) / r
        const centripetal_force = this.object.objectMass * ((this.object.velocity * 60) ** 2) / this.object.orbit.radius
        this.mag = centripetal_force + this.object.objectMass * 9.81 * cos(this.dir);


    }

    updateDir() {
        this.dir += this.object.angularVelocity;
        while (this.dir >= TWO_PI) {
            this.dir -= TWO_PI;
        }
        
    }

}


class FrictionForce extends Force {

    constructor(object, magnitude, direction, colour) {
        super(object, magnitude, direction, colour);
        
    }

    updateMagnitude() {
        this.mag = this.object.objectMass * 9.81 * sin(this.dir - HALF_PI);

    }
    
    updateDir() {
        let goingUp = this.object.position.x >= this.object.origin.x;

        if (goingUp) {
            this.dir = this.object.theta + PI;
        } else {
            this.dir = this.object.theta - PI;
        }
    }

}