import p5 from "p5";

let p: p5;

function setup() {}

function draw() {
  p.clear();
  p.rect(10, 20, 30, 40);
}

new p5((_p: p5) => {
  p = _p;
  p.setup = setup;
  p.draw = draw;
});
