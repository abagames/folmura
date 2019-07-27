import p5 from "p5";
import * as formula from "./formula";
import { Random } from "./random";
import { range, wrap } from "./math";
import { Vector } from "./vector";

export let p: p5;

const random = new Random();
const xFunc = formula.generate(random);
const yFunc = formula.generate(random);
const variables: any = {};
const shapes = range(10).map(() => {
  return { pos: new Vector() };
});

let t = 0;

function setup() {
  p.noStroke();
  p.background(0);
}

function draw() {
  p.fill(0, 20);
  p.rect(0, 0, p.width, p.height);
  variables["t"] = t;
  shapes.forEach((s, i) => {
    variables["i"] = i;
    variables["x"] = s.pos.x;
    variables["y"] = s.pos.y;
    s.pos.set(formula.calc(xFunc, variables), formula.calc(yFunc, variables));
    p.fill(200, 100);
    p.rect(
      wrap(s.pos.x + p.width / 2, 0, p.width),
      wrap(s.pos.y + p.height / 2, 0, p.height),
      10,
      10
    );
  });
  t++;
}

new p5((_p: p5) => {
  p = _p;
  p.setup = setup;
  p.draw = draw;
});
