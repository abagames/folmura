import p5 from "p5";
import * as gcc from "gif-capture-canvas";
import * as formula from "./formula";
import { Random } from "./random";
import { range, wrap } from "./math";
import { Vector } from "./vector";

export let p: p5;

const isCapturing = false;
const seedRandom = new Random();
const random = new Random();
const variables: any = {};
let renderer;

function setup() {
  renderer = p.createCanvas(500, 250);
  p.colorMode(p.HSB);
  p.background(0);
  const seed = loadFromUrl();
  if (seed == null) {
    nextFormulas();
  } else {
    random.setSeed(seed);
    generateFormulas();
  }
  p.touchStarted = nextFormulas;
  if (isCapturing) {
    gcc.setOptions({ capturingFps: 60, durationSec: 2 });
  }
}

type FormulaRange = {
  min: number;
  max: number;
  targetMin: number;
  targetMax: number;
  frameMin: number;
  frameMax: number;
};

type Shape = {
  pos: Vector;
  size: Vector;
  color: number[];
};

let formulas: formula.Formula[];
let formulaRanges: FormulaRange[];
let shapes: Shape[];
let t = 0;

function nextFormulas() {
  const seed = seedRandom.getInt(0, 999999999);
  saveAsUrl(seed);
  random.setSeed(seed);
  generateFormulas();
  return false;
}

function generateFormulas() {
  formulas = range(7).map(() => formula.generate(random));
  if (random.get() < 0.5) {
    formulas[1] = formula.swapSinCos(formulas[0]);
  }
  if (random.get() < 0.5) {
    formulas[3] = formula.swapSinCos(formulas[2]);
  }
  formulaRanges = formulas.map(() => {
    return {
      min: -1,
      max: 1,
      targetMin: -1,
      targetMax: 1,
      frameMin: 1,
      frameMax: -1
    };
  });
  formulaRanges[0].targetMin = -p.width / 2;
  formulaRanges[0].targetMax = p.width / 2;
  formulaRanges[1].targetMin = -p.height / 2;
  formulaRanges[1].targetMax = p.height / 2;
  formulaRanges[2].targetMin = 1;
  formulaRanges[2].targetMax = p.width / 8;
  formulaRanges[3].targetMin = 1;
  formulaRanges[3].targetMax = p.height / 8;
  formulaRanges[4].targetMin = 0;
  formulaRanges[4].targetMax = 360;
  formulaRanges[5].targetMin = 50;
  formulaRanges[5].targetMax = 100;
  formulaRanges[6].targetMin = 50;
  formulaRanges[6].targetMax = 100;
  shapes = range(random.getInt(10, 100)).map(() => {
    return { pos: new Vector(), size: new Vector(), color: [0, 0, 0] };
  });
  variables["a"] = random.getInt(2, 10);
  variables["b"] = random.getInt(2, 10);
  t = 0;
}

function draw() {
  p.fill(0, 20);
  p.noStroke();
  p.rect(0, 0, p.width, p.height);
  variables["t"] = t;
  shapes.forEach((s, i) => {
    variables["i"] = i;
    s.pos.set(
      adjustFormulaValue(
        formulaRanges[0],
        formula.calc(formulas[0], variables)
      ),
      adjustFormulaValue(formulaRanges[1], formula.calc(formulas[1], variables))
    );
    s.size.set(
      adjustFormulaValue(
        formulaRanges[2],
        formula.calc(formulas[2], variables)
      ),
      adjustFormulaValue(formulaRanges[3], formula.calc(formulas[3], variables))
    );
    s.color[0] +=
      wrap(
        adjustFormulaValue(
          formulaRanges[4],
          formula.calc(formulas[4], variables)
        ) - s.color[0],
        -180,
        180
      ) * 0.1;
    s.color[1] +=
      (adjustFormulaValue(
        formulaRanges[5],
        formula.calc(formulas[5], variables)
      ) -
        s.color[1]) *
      0.1;
    s.color[2] +=
      (adjustFormulaValue(
        formulaRanges[6],
        formula.calc(formulas[6], variables)
      ) -
        s.color[2]) *
      0.1;
    p.stroke(wrap(s.color[0], 0, 360), s.color[1], s.color[2], 0.5);
    p.strokeWeight(p.max((s.size.x + s.size.y) / 2, 1));
    if (i > 0) {
      const ps = shapes[i - 1];
      p.line(
        ps.pos.x + p.width / 2,
        ps.pos.y + p.height / 2,
        s.pos.x + p.width / 2,
        s.pos.y + p.height / 2
      );
    }
  });
  formulaRanges.forEach(fr => {
    adjustFormulaRange(fr);
  });
  t += 1 / 60;
  if (isCapturing) {
    gcc.capture(renderer.canvas);
  }
}

function adjustFormulaValue(fr: FormulaRange, v: number) {
  if (isNaN(v)) {
    return 0;
  }
  if (v < fr.frameMin) {
    fr.frameMin = v;
  }
  if (v > fr.frameMax) {
    fr.frameMax = v;
  }
  return (
    ((v - fr.min) / (fr.max - fr.min)) * (fr.targetMax - fr.targetMin) +
    fr.targetMin
  );
}

function adjustFormulaRange(fr: FormulaRange) {
  fr.min += (fr.frameMin - fr.min) * (fr.frameMin < fr.min ? 0.1 : 0.01);
  fr.max += (fr.frameMax - fr.max) * (fr.frameMax > fr.max ? 0.1 : 0.01);
  if (fr.max <= fr.min) {
    fr.max = fr.min + 0.01;
  }
  fr.frameMin = fr.max;
  fr.frameMax = fr.min;
}

function saveAsUrl(seed: number) {
  const baseUrl = window.location.href.split("?")[0];
  let url = `${baseUrl}?s=${seed}`;
  try {
    window.history.replaceState({}, "", url);
  } catch (e) {
    console.log(e);
  }
}

function loadFromUrl() {
  const query = window.location.search.substring(1);
  if (query == null) {
    return undefined;
  }
  let params = query.split("&");
  let seedStr: string;
  for (let i = 0; i < params.length; i++) {
    const param = params[i];
    const pair = param.split("=");
    if (pair[0] === "s") {
      seedStr = pair[1];
    }
  }
  if (seedStr == null) {
    return undefined;
  }
  return Math.floor(Number(seedStr));
}

new p5((_p: p5) => {
  p = _p;
  p.setup = setup;
  p.draw = draw;
});
