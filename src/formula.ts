import { p } from "./main";
import { Random } from "./random";
import { range } from "./math";

export type Formula = {
  func: Function;
  args?: Formula[];
  value?: number | string;
};

export function generate(random: Random, depth = 0): Formula {
  const r = random.get();
  const dr = depth / 3;
  if (r < 0.5 * dr) {
    return {
      func: variable,
      value: random.select(["t", "t", "i", "a", "b", "c"])
    };
  } else {
    const funcs = [
      [plus, 2],
      [minus, 2],
      [times, 2],
      [divide, 2],
      [sin, 1],
      [sin, 1],
      [cos, 1],
      [cos, 1],
      [exp, 1],
      [pow, 2],
      [noise, 1]
    ];
    const fa = random.select(funcs);
    const func = fa[0];
    const args = range(fa[1]).map(() => generate(random, depth + 1));
    return { func, args };
  }
}

export function calc(formula: Formula, variables) {
  return formula.func(formula, variables);
}

export function swapSinCos(f: Formula) {
  return {
    func: f.func === sin ? cos : f.func === cos ? sin : f.func,
    args: f.args == null ? undefined : f.args.map(f => swapSinCos(f)),
    value: f.value
  };
}

function variable(formula: Formula, variables) {
  return variables[formula.value];
}

function plus(formula: Formula, variables) {
  return calc(formula.args[0], variables) + calc(formula.args[1], variables);
}

function minus(formula: Formula, variables) {
  return calc(formula.args[0], variables) - calc(formula.args[1], variables);
}

function times(formula: Formula, variables) {
  return calc(formula.args[0], variables) * calc(formula.args[1], variables);
}

function divide(formula: Formula, variables) {
  let v = calc(formula.args[1], variables);
  if (p.abs(v) < 0.01) {
    v = 0.01;
  }
  return calc(formula.args[0], variables) / v;
}

function sin(formula: Formula, variables) {
  return p.sin(calc(formula.args[0], variables));
}

function cos(formula: Formula, variables) {
  return p.cos(calc(formula.args[0], variables));
}

function exp(formula: Formula, variables) {
  return p.exp(calc(formula.args[0], variables));
}

function pow(formula: Formula, variables) {
  return p.pow(
    calc(formula.args[0], variables),
    calc(formula.args[1], variables)
  );
}

function noise(formula: Formula, variables) {
  return p.noise(calc(formula.args[0], variables));
}
