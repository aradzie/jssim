import { Netlist } from "@jssim/simulator/lib/netlist/netlist.js";
import { Variables } from "@jssim/simulator/lib/netlist/variables.js";
import { DcAnalysis } from "@jssim/simulator/lib/simulation/analysis.js";
import { formatNumber } from "@jssim/simulator/lib/util/format.js";
import { Unit } from "@jssim/simulator/lib/util/unit.js";
import { Dataset, points } from "./util/dataset.js";

const input = `
Ground g
V nr g V=10
V nb g V=$xVbe
R nr nc R=$xRl
BJT:Q1 g nb nc @NPN
`;

const dataset = new Dataset();

for (const xRl of points(2000, 100, 5)) {
  dataset.group(`Rl=${formatNumber(xRl, Unit.OHM)}`);
  for (const xVbe of points(0.5, 0.8, 100)) {
    const variables = new Variables();
    variables.setVariable("$xRl", xRl);
    variables.setVariable("$xVbe", xVbe);
    const { circuit } = Netlist.parse(input, variables);
    new DcAnalysis().run(circuit);
    const q1 = circuit.getDevice("Q1");
    const nc = circuit.getNode("nc");
    dataset.add(q1.op("Vbe"), nc.voltage);
  }
}

dataset.save("amp-bjt");
