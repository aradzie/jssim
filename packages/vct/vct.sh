#!/usr/bin/env bash

npx ts-node src/iv-diode.ts
npx ts-node src/iv-bjt.ts
npx ts-node src/iv-mosfet.ts
npx ts-node src/iv-jfet.ts
npx ts-node src/amp-bjt.ts
npx ts-node src/amp-mosfet.ts

cd plot

for f in *.plt; do gnuplot "$f"; done
