let vehicles = [];
let food = [];
let poison = [];

function setup() {
    createCanvas(600, 400);
    for (let i = 0; i < 10; i++) {
        let x = random(width);
        let y = random(height);
        vehicles.push(new Vehicle(x, y));
    }

    for (let i = 0; i < 100; i++) {
        let x = random(width);
        let y = random(height);
        food.push(createVector(x, y));
    }
    for (let i = 0; i < 100; i++) {
        let x = random(width);
        let y = random(height);
        poison.push(createVector(x, y));
    }
}

function draw() {
    background(51);
    if (random(1) < 0.05) {
        let x = random(width);
        let y = random(height);
        food.push(createVector(x, y));
    }

    for (let i = 0; i < food.length; i++) {
        fill(0, 255, 0);
        noStroke();
        ellipse(food[i].x, food[i].y, 8, 8);
    }
    for (let i = 0; i < poison.length; i++) {
        fill(255, 0, 0);
        noStroke();
        ellipse(poison[i].x, poison[i].y, 8, 8);
    }

    for (let i = vehicles.length - 1; i >= 0; i--) {
        vehicles[i].behaviors(food, poison);
        vehicles[i].update();
        vehicles[i].display();
        console.log(vehicles[i].health)

        if (vehicles[i].dead()) {
            vehicles.splice(i, 1);
        }
    }
}