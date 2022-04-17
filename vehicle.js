class Vehicle {
    constructor(x, y) {
        this.acceleration = createVector(0, 0);
        this.velocity = createVector(0, -2);
        this.position = createVector(x, y);
        this.r = 6;
        this.maxspeed = 5;
        this.maxforce = 0.5;
    }

    // method to update location
    update() {
        // update velocity
        this.velocity.add(this.acceleration);
        // limit speed
        this.velocity.limit(this.maxspeed);
        this.position.add(this.velocity);
        // reset acceleration to 0 in each cycle
        this.acceleration.mult(0);
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    eat(list) {
        let record = Infinity;
        let closestIndex = -1;
        for (let i = 0; i < list.length; i++) {
            let distance = this.position.dist(list[i]);
            if (distance < record) {
                record = distance;
                closestIndex = i;
            }
        }

        // if vehicle rouched the list item
        if (record < 5) {
            list.splice(closestIndex, 1);
        }
        else if (closestIndex >= 0) {
            this.seek(list[closestIndex]);
        }
    }

    // method that calculates the steering force
    // steer = desired - velocity
    seek(target) {
        let desired = p5.Vector.sub(target, this.position);

        // scale to max speed
        desired.setMag(this.maxspeed);

        // steering
        let steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxforce);

        this.applyForce(steer);
    }

    display() {
        let angle = this.velocity.heading() + PI / 2;

        translate(this.position.x, this.position.y);
        rotate(angle);

        fill(127);
        stroke(200);
        strokeWeight(1);
        beginShape();
        vertex(0, -this.r * 2);
        vertex(-this.r, this.r * 2);
        vertex(this.r, this.r * 2);
        endShape(CLOSE);
    }
}