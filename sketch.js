let vehicles = [];
let food = [];
let poison = [];
let murationrate = 0.01

let debug;

function setup() {
    createCanvas(1200, 575);
    for (let i = 0; i < 10; i++) {
        let x = random(width);
        let y = random(height);
        vehicles.push(new Vehicle(x, y));
    }

    for (let i = 0; i < 70; i++) {
        let x = random(width);
        let y = random(height);
        food.push(createVector(x, y));
    }
    for (let i = 0; i < 50; i++) {
        let x = random(width);
        let y = random(height);
        poison.push(createVector(x, y));
    }

    debug = createCheckbox();
}

function mousePressed() {
    vehicles.push(new Vehicle(mouseX, mouseY));
}

function mouseDragged() {
    vehicles.push(new Vehicle(mouseX, mouseY));
}

function draw() {
    background(51);

    // random chance to add new foods or poisons
    if (random(1) < 0.1) {
        let x = random(width);
        let y = random(height);
        food.push(createVector(x, y));
    }
    if (random(1) < 0.01) {
        let x = random(width);
        let y = random(height);
        poison.push(createVector(x, y));
    }

    for (let i = 0; i < food.length; i++) {
        fill(0, 255, 0);
        noStroke();
        ellipse(food[i].x, food[i].y, 4, 4);
    }
    for (let i = 0; i < poison.length; i++) {
        fill(255, 0, 0);
        noStroke();
        ellipse(poison[i].x, poison[i].y, 4, 4);
    }

    for (let i = vehicles.length - 1; i >= 0; i--) {
        vehicles[i].boundaries();
        vehicles[i].behaviors(food, poison);
        vehicles[i].update();
        vehicles[i].display();

        let clone = vehicles[i].clone();
        if (clone != null) {
            vehicles.push(clone);
        }

        if (vehicles[i].dead()) {
            let x = vehicles[i].position.x;
            let y = vehicles[i].position.y;
            food.push(createVector(x, y));
            vehicles.splice(i, 1);
        }
    }
}