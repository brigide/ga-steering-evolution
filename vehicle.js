class Vehicle {
    constructor(x, y) {
        this.acceleration = createVector(0, 0);
        this.velocity = createVector(0, -2);
        this.position = createVector(x, y);
        this.r = 4;
        this.maxspeed = 2;
        this.maxforce = 0.3;

        this.health = 1;

        this.dna = [];
        this.dna[0] = random(-2, 2); //food weight -> repealing or atracting
        this.dna[1] = random(-2, 2); //poison weight
        this.dna[2] = random(10, 100); //food perception -> in pixels
        this.dna[3] = random(10, 100); //poison perception
    }

    // method to update location
    update() {
        this.health -= 0.005;
        
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

    behaviors(target, avoid) {
        let steerTarget = this.eat(target, 0.2, this.dna[2]);
        let steerAvoid = this.eat(avoid, -0.5, this.dna[3]);

        steerTarget.mult(this.dna[0]);
        steerAvoid.mult(this.dna[1]);

        this.applyForce(steerTarget);
        this.applyForce(steerAvoid);
    }

    eat(list, nutrition, perception) {
        let record = Infinity;
        let closestIndex = -1;
        for (let i = 0; i < list.length; i++) {
            let distance = this.position.dist(list[i]);
            if (distance < record && distance < perception) {
                record = distance;
                closestIndex = i;
            }
        }

        // if vehicle rouched the list item
        if (record < 5) {
            list.splice(closestIndex, 1);
            this.health += nutrition;
            //if (this.health > 1) { this.health = 1; }
        }
        else if (closestIndex >= 0) {
            return this.seek(list[closestIndex]);
        }
        return createVector(0, 0);
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

        return steer;
    }

    dead() {
        return this.health < 0;
    }

    display() {
        // Draw a triangle rotated in the direction of velocity
        let angle = this.velocity.heading() + PI / 2;

        push();
        translate(this.position.x, this.position.y);
        rotate(angle);

        if (debug.checked()) {
            strokeWeight(3);
            stroke(0, 255, 0);
            noFill();
            line(0, 0, 0, -this.dna[0] * 25);
            strokeWeight(2);
            ellipse(0, 0, this.dna[2] * 2);
            stroke(255, 0, 0);
            line(0, 0, 0, -this.dna[1] * 25);
            ellipse(0, 0, this.dna[3] * 2);
        }

        let gr = color(0, 255, 0);
        let rd = color(255, 0, 0);
        let col = lerpColor(rd, gr, this.health);

        fill(col);
        stroke(col);
        strokeWeight(1);
        beginShape();
        vertex(0, -this.r * 2);
        vertex(-this.r, this.r * 2);
        vertex(this.r, this.r * 2);
        endShape(CLOSE);

        pop();
    }

    boundaries() {
        let d = 25;

        let desired = null;

        if (this.position.x < d) {
            desired = createVector(this.maxspeed, this.velocity.y);
        } 
        else if (this.position.x > width - d) {
            desired = createVector(-this.maxspeed, this.velocity.y);
        }

        if (this.position.y < d) {
            desired = createVector(this.velocity.x, this.maxspeed);
        } 
        else if (this.position.y > height - d) {
            desired = createVector(this.velocity.x, -this.maxspeed);
        }

        if (desired !== null) {
            desired.normalize();
            desired.mult(this.maxspeed);
            let steer = p5.Vector.sub(desired, this.velocity);
            steer.limit(this.maxforce);
            this.applyForce(steer);
        }
    }
}