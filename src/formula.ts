import { p } from "./main";
import { Random } from "./random";
import { range } from "./math";

export type Formula = {
  func: Function;
  args?: Formula[];
  value?: string;
};

const funcList = [
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
  [noise, 1],
  [condition, 4]
];

const funcListNames = [
  "plus",
  "minus",
  "times",
  "divide",
  "sin",
  "sin",
  "cos",
  "cos",
  "exp",
  "pow",
  "noise",
  "condition"
];

export function generate(random: Random, depth = 0): Formula {
  const r = random.get();
  const dr = depth / 3;
  if (r < 0.5 * dr) {
    return {
      func: variable,
      value: random.select(["t", "i", "a", "b"])
    };
  } else {
    const fa = random.select(funcList);
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

export function toString(formula: Formula) {
  const func = formula.func;
  let argStrs = [];
  if (formula.args != null) {
    argStrs = formula.args.map(a => toString(a));
  }
  if (func === plus) {
    return `(${argStrs[0]}+${argStrs[1]})`;
  } else if (func === minus) {
    return `(${argStrs[0]}-${argStrs[1]})`;
  } else if (func === times) {
    return `${argStrs[0]}*${argStrs[1]}`;
  } else if (func === divide) {
    return `${argStrs[0]}/${argStrs[1]}`;
  } else if (func === variable) {
    return formula.value;
  } else if (func == condition) {
    return `(${argStrs[0]}>${argStrs[1]}?${argStrs[2]}:${argStrs[3]})`;
  }
  const fi = funcList.findIndex(f => f[0] === func);
  const name = funcListNames[fi];
  return `${name}(${argStrs.join(",")})`;
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

function condition(formula: Formula, variables) {
  return calc(formula.args[0], variables) > calc(formula.args[1], variables)
    ? calc(formula.args[2], variables)
    : calc(formula.args[3], variables);
}
