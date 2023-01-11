class Ring {
    constructor(centerX, centerY, size) {
        this.x = centerX;
        this.y = centerY;

        // Diameter of Ring in Pixels.
        this.size = size;

        // Radius of Ring in Meters.
        this.radius = size / 2 / 20;

    }

    drawRing() {
        strokeWeight(4);
        stroke(51);
        noFill();
        strokeWeight(10);
        rectMode(CENTER);
        point(this.x, this.y);
        ellipse(this.x, this.y, this.size);

    }
};
