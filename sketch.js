let vehicle;

function setup() {
    createCanvas(400, 300);
    vehicle = new Vehicle(width / 2, height / 2);
}

function draw() {
    background(51);

    let target = createVector(mouseX, mouseY);

    fill(127);
    stroke(200);
    strokeWeight(2);
    ellipse(target.x, target.y, 48, 48);

    vehicle.seek(target);
    vehicle.update();
    vehicle.display();
}