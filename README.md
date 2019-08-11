# folmura ([DEMO](https://abagames.github.io/folmura/index.html))

Randomly generated visual with randomly generated formula.

Click/Tap to generate another one. Press the 'F' key to see the formulas.

[![screenshot](docs/screenshots/folmura.gif)](https://abagames.github.io/folmura/index.html)

## Interesting random seeds

[![62065297](docs/screenshots/62065297.gif)](https://abagames.github.io/folmura/index.html?s=62065297)
[![27197560](docs/screenshots/27197560.gif)](https://abagames.github.io/folmura/index.html?s=27197560)
[![827394148](docs/screenshots/827394148.gif)](https://abagames.github.io/folmura/index.html?s=827394148)
[![59931162](docs/screenshots/59931162.gif)](https://abagames.github.io/folmura/index.html?s=59931162)
[![82205833](docs/screenshots/82205833.gif)](https://abagames.github.io/folmura/index.html?s=82205833)
[![161440481](docs/screenshots/161440481.gif)](https://abagames.github.io/folmura/index.html?s=161440481)
[![92028492](docs/screenshots/92028492.gif)](https://abagames.github.io/folmura/index.html?s=92028492)
[![388848054](docs/screenshots/388848054.gif)](https://abagames.github.io/folmura/index.html?s=388848054)
[![521822124](docs/screenshots/521822124.gif)](https://abagames.github.io/folmura/index.html?s=521822124)
[![718006707](docs/screenshots/718006707.gif)](https://abagames.github.io/folmura/index.html?s=718006707)
[![509235666](docs/screenshots/509235666.gif)](https://abagames.github.io/folmura/index.html?s=509235666)
[![950816576](docs/screenshots/950816576.gif)](https://abagames.github.io/folmura/index.html?s=950816576)
[![71464548](docs/screenshots/71464548.gif)](https://abagames.github.io/folmura/index.html?s=71464548)
[![303599227](docs/screenshots/303599227.gif)](https://abagames.github.io/folmura/index.html?s=303599227)
[![774417313](docs/screenshots/774417313.gif)](https://abagames.github.io/folmura/index.html?s=774417313)
[![635382188](docs/screenshots/635382188.gif)](https://abagames.github.io/folmura/index.html?s=635382188)
[![506507566](docs/screenshots/506507566.gif)](https://abagames.github.io/folmura/index.html?s=506507566)
[![375615874](docs/screenshots/375615874.gif)](https://abagames.github.io/folmura/index.html?s=375615874)
[![359947371](docs/screenshots/359947371.gif)](https://abagames.github.io/folmura/index.html?s=359947371)
[![596174466](docs/screenshots/596174466.gif)](https://abagames.github.io/folmura/index.html?s=596174466)
[![929464066](docs/screenshots/929464066.gif)](https://abagames.github.io/folmura/index.html?s=929464066)
[![38676985](docs/screenshots/38676985.gif)](https://abagames.github.io/folmura/index.html?s=38676985)
[![567782962](docs/screenshots/567782962.gif)](https://abagames.github.io/folmura/index.html?s=567782962)

## How to generate a visual

The canvas consists of points connected with lines. The position, size and color of each point are defined by variables:

```
x/y = horizontal/vertical position
w/h = width/height ((width + height) / 2 is used as a stroke weight of each line)
H/S/B = color (Hue/Saturation/Brightness)
```

Each variable is calculated by a randomly generated formula. The formula is generated with combination of functions:

```
v1 + v2, v1 - v2, v1 * v2, v1 / v2, 
sin(v1), cos(v1), exp(v1), pow(v1, v2), noise(v1), 
v1 > v2 ? v3 : v4
```

The functions described above or variables described below are placed recursively to v1-v4.

```
t = time (in seconds)
i = index of the point (each point has an index starting from 0)
a/b = random integer value (2 to 10)
```
