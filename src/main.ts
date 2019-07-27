import p5 from "p5";
import * as formula from "./formula";
import { Random } from "./random";
import { range, wrap } from "./math";
import { Vector } from "./vector";

export let p: p5;

const random = new Random();
const variables: any = {};

function setup() {
  p.createCanvas(200, 100);
  p.noStroke();
  p.background(0);
  generateFormulas();
  p.mouseClicked = generateFormulas;
}

let formulas: formula.Formula[];
let shapes: any[];
let t = 0;

function generateFormulas() {
  formulas = range(7).map(() => formula.generate(random));
  formulas[1] = formula.swapSinCos(formulas[0]);
  formulas[3] = formula.swapSinCos(formulas[2]);
  shapes = range(random.getInt(1, 10)).map(() => {
    return { pos: new Vector(), size: new Vector(), color: [0, 0, 0] };
  });
  t = 0;
}

function draw() {
  p.fill(0, 20);
  p.rect(0, 0, p.width, p.height);
  variables["t"] = t;
  shapes.forEach((s, i) => {
    variables["i"] = i;
    s.pos
      .set(
        formula.calc(formulas[0], variables),
        formula.calc(formulas[1], variables)
      )
      .wrap(-p.width / 2, p.width / 2, -p.height / 2, p.height / 2);
    s.size
      .set(
        formula.calc(formulas[2], variables),
        formula.calc(formulas[3], variables)
      )
      .wrap(1, p.width / 10, 1, p.height / 10);
    s.color[0] +=
      (wrap(formula.calc(formulas[4], variables), 0, 100) - s.color[0]) * 0.1;
    s.color[1] +=
      (wrap(formula.calc(formulas[5], variables), 0, 100) - s.color[0]) * 0.1;
    s.color[2] +=
      (wrap(formula.calc(formulas[6], variables), 0, 100) - s.color[0]) * 0.1;
    p.fill(150 - s.color[0], 150 - s.color[1], 150 - s.color[2], 100);
    p.rect(
      s.pos.x + p.width / 2 - s.size.x / 2,
      s.pos.y + p.height / 2 - s.size.y / 2,
      s.size.x,
      s.size.y
    );
  });
  t += 1 / 60;
}

new p5((_p: p5) => {
  p = _p;
  p.setup = setup;
  p.draw = draw;
});
