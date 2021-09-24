import test from "ava";
import { dcAnalysis } from "../simulation/dc";
import { readNetlist } from "../simulation/netlist";
import { Unit } from "../util/unit";
import type { CCVSource } from "./ccvsource";

test("current controlled voltage source", (t) => {
  const circuit = readNetlist([
    ["g", ["NCN"], {}],
    ["g", ["NON"], {}],
    ["i", ["NCP", "NCN"], { i: -1 }],
    ["ccvs/DUT", ["NOP", "NON", "NCP", "NCN"], { gain: 2 }],
    ["r", ["NOP", "NON"], { r: 10 }],
  ]);
  const r = dcAnalysis(circuit);
  t.deepEqual(
    r,
    new Map([
      ["V[NCP]", -0],
      ["V[NOP]", 2],
      ["I[NCP->GROUND]", 1],
      ["I[NOP->GROUND]", -0.2],
    ]),
  );
  const device = circuit.getDevice("DUT") as CCVSource;
  t.deepEqual(device.details(), [
    { name: "Vd", value: 2, unit: Unit.VOLT },
    { name: "I", value: -0.2, unit: Unit.AMPERE },
    { name: "P", value: -0.4, unit: Unit.WATT },
  ]);
});
