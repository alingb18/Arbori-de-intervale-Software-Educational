function setup() {
  createCanvas(1000, 1000); // Create a canvas of 400x400 pixels
}

function draw() {
  background(0);
  if (mouseIsPressed) {
    fill(0);
  } else {
    fill(255);
  }
  ellipse(mouseX, mouseY, 50, 50);
}