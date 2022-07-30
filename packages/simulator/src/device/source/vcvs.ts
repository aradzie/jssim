import { Device, DeviceState, EvalParams } from "../../circuit/device.js";
import { Stamper, stampVoltageSource } from "../../circuit/mna.js";
import type { Branch, Network, Node } from "../../circuit/network.js";
import { Properties } from "../../circuit/properties.js";

const enum S {
  gain,
  V,
  I,
  _Size_,
}

/**
 * Voltage-controlled voltage source.
 */
export class VCVS extends Device {
  static override readonly id = "VCVS";
  static override readonly numTerminals = 4;
  static override readonly stateSize = S._Size_;
  static override readonly propertiesSchema = {
    gain: Properties.number({ title: "gain" }),
  };

  override readonly probes = [
    { name: "V", unit: "V", measure: () => this.state[S.V] },
    { name: "I", unit: "A", measure: () => this.state[S.I] },
  ];

  /** Positive output terminal. */
  private np!: Node;
  /** Negative output terminal. */
  private nn!: Node;
  /** Positive control terminal. */
  private ncp!: Node;
  /** Negative control terminal. */
  private ncn!: Node;
  /** Extra MNA branch. */
  private branch!: Branch;

  override connect(network: Network, [np, nn, ncp, ncn]: readonly Node[]): void {
    this.np = np;
    this.nn = nn;
    this.ncp = ncp;
    this.ncn = ncn;
    this.branch = network.makeBranch(this.np, this.nn);
  }

  override deriveState(state: DeviceState): void {
    state[S.gain] = this.properties.getNumber("gain");
  }

  override eval(state: DeviceState, params: EvalParams, stamper: Stamper): void {
    const { np, nn, ncp, ncn, branch } = this;
    const gain = state[S.gain];
    stampVoltageSource(stamper, np, nn, branch, 0);
    stamper.stampA(branch, ncp, -gain);
    stamper.stampA(branch, ncn, gain);
  }

  override endEval(state: DeviceState): void {
    const { np, nn, branch } = this;
    const V = np.voltage - nn.voltage;
    const I = branch.current;
    state[S.V] = V;
    state[S.I] = I;
  }
}
