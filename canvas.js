const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
var maxWidth = window.innerWidth;
var maxHeight = window.innerHeight;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var squareField = {};
var listOfCircle = [];

//response canvas
window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

//function constructor
function Circle(x, y, dx, dy, radius, color) {
  this.x = x;
  this.y = y;
  this.canBoom = false;
  this.dx = dx;
  this.dy = dy;
  this.normalDx = dx;
  this.normalDy = dy;
  this.radius = radius;
  this.normalRadius = radius;
  this.color = color;
}

//added method to my object Circle via prototype
Circle.prototype = {
  display: function () {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    c.strokeStyle = this.color;
    c.fillStyle = this.color;
    c.closePath();
    c.stroke();
    c.fill();
  },
  move: function () {
    if (this.x + this.radius > maxWidth || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.radius > maxHeight || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }
    this.x += this.dx;
    this.y += this.dy;
    this.display();
  },

  checkCollision: function (squarePossition) {
    let { xStart, xEnd, yStart, yEnd } = squarePossition;
    if (
      this.x >= xStart &&
      this.x <= xEnd &&
      this.y >= yStart &&
      this.y <= yEnd
    ) {
      this.canBoom = true;
      this.radius < 40 ? (this.radius += 3) : null;
    } else {
      this.canBoom = false;
      if (Math.abs(this.dx) > Math.abs(this.normalDx)) {
        this.dx = this.dx * 0.5;
        this.dy = this.dx * 0.5;
      }
      this.radius > this.normalRadius
        ? (this.radius -= this.normalRadius / 2)
        : null;
    }
  },
  boom: function () {
    if (this.canBoom) {
      this.dx = this.dx * 100;
      this.dy = this.dy * 100;
    }
  },
};

//creating 1000 circles
for (let x = 0; x < 1000; x++) {
  const dx = (Math.random() - 0.5) * 2;
  const dy = (Math.random() - 0.5) * 2;
  const color = `rgb(${Math.random() * 255},${Math.random() * 255},${
    Math.random() * 255
  },0.5)`;
  const radius = Math.random() * 10;
  const x = Math.floor(Math.random() * (maxWidth - radius - radius) + radius);
  const y = Math.floor(Math.random() * (maxHeight - radius - radius) + radius);
  listOfCircle.push(new Circle(x, y, dx, dy, radius, color));
}

//created square object around cursor
canvas.onmousemove = function (e) {
  squareField = {
    xStart: e.clientX - 60,
    xEnd: e.clientX + 60,
    yStart: e.clientY - 60,
    yEnd: e.clientY + 60,
  };
};

canvas.onclick = function () {
  for (let circle in listOfCircle) {
    listOfCircle[circle].boom();
  }
};
//animation function
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);
  for (let circle in listOfCircle) {
    listOfCircle[circle].move();
    listOfCircle[circle].checkCollision(squareField);
  }
}
animate();
