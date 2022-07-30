import { Device, DeviceState, EvalParams } from "../../circuit/device.js";
import { stampCurrentSource, Stamper } from "../../circuit/mna.js";
import type { Network, Node } from "../../circuit/network.js";
import { Properties } from "../../circuit/properties.js";

const enum S {
  I0,
  I,
  V,
  _Size_,
}

/**
 * Current source.
 */
export class Idc extends Device {
  static override readonly id = "I";
  static override readonly numTerminals = 2;
  static override readonly stateSize = S._Size_;
  static override readonly propertiesSchema = {
    I: Properties.number({ title: "current" }),
  };

  override readonly probes = [
    { name: "I", unit: "A", measure: () => this.state[S.I] },
    { name: "V", unit: "V", measure: () => this.state[S.V] },
  ];

  /** Positive terminal. */
  private np!: Node;
  /** Negative terminal. */
  private nn!: Node;

  override connect(network: Network, [np, nn]: readonly Node[]): void {
    this.np = np;
    this.nn = nn;
  }

  override deriveState(state: DeviceState): void {
    state[S.I0] = this.properties.getNumber("I");
  }

  override eval(state: DeviceState, { sourceFactor }: EvalParams, stamper: Stamper): void {
    const { np, nn } = this;
    const I0 = state[S.I0];
    const I = sourceFactor * I0;
    state[S.I] = I;
    stampCurrentSource(stamper, np, nn, I);
  }

  override endEval(state: DeviceState): void {
    const { np, nn } = this;
    const V = np.voltage - nn.voltage;
    state[S.V] = V;
  }
}
