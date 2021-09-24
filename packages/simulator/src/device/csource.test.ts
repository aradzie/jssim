import test from "ava";
import { dcAnalysis } from "../simulation/dc";
import { readNetlist } from "../simulation/netlist";
import { Unit } from "../util/unit";
import type { CSource } from "./csource";

test("current source", (t) => {
  const circuit = readNetlist([
    ["g", ["NN"], {}],
    ["i/DUT", ["NP", "NN"], { i: 1 }],
    ["r/R1", ["NP", "NN"], { r: 10 }],
  ]);
  const r = dcAnalysis(circuit);
  t.deepEqual(r, new Map([["V[NP]", -10]]));
  const device = circuit.getDevice("DUT") as CSource;
  t.deepEqual(device.details(), [
    { name: "Vd", value: -10, unit: Unit.VOLT },
    { name: "I", value: 1, unit: Unit.AMPERE },
  ]);
});
