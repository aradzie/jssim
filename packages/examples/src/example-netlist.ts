import { formatData, formatSchema } from "@jecs/simulator/lib/analysis/dataset.js";
import { Netlist } from "@jecs/simulator/lib/netlist/netlist.js";
import { logger } from "@jecs/simulator/lib/util/logging.js";

const { circuit, analyses } = Netlist.parse(`
V:Vce nc gnd V=$Vce
V:Vbe nb gnd V=$Vbe
BJT:DUT gnd nb nc @NPN
.dc
  sweep $Vbe 0.625 0.65 5
  sweep $Vce 0 0.3 10
`);

for (const analysis of analyses) {
  const dataset = analysis.run(circuit);
  console.log(formatSchema(dataset));
  console.log(formatData(dataset));
}

console.log(String(logger));
