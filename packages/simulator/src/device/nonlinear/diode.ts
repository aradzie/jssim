import { Device, DeviceState, EvalParams } from "../../circuit/device.js";
import { stampConductance, stampCurrentSource, Stamper } from "../../circuit/mna.js";
import type { Network, Node } from "../../circuit/network.js";
import { Properties } from "../../circuit/properties.js";
import { celsiusToKelvin } from "../../util/unit.js";
import { gMin } from "../const.js";
import { pnConductance, pnCurrent, pnTemp, pnVoltage } from "./semi.js";

const enum S {
  Is,
  N,
  Vt,
  Vcrit,
  V,
  I,
  G,
  _Size_,
}

/**
 * Diode.
 */
export class Diode extends Device {
  static override readonly id = "Diode";
  static override readonly numTerminals = 2;
  static override readonly stateSize = S._Size_;
  static override readonly propertiesSchema = {
    Is: Properties.number({
      defaultValue: 1e-14,
      range: ["real", ">", 0],
      title: "saturation current",
    }),
    N: Properties.number({
      defaultValue: 1,
      range: ["real", ">", 0],
      title: "emission coefficient",
    }),
    temp: Properties.temp,
  };
  static override readonly linear = false;

  override readonly probes = [
    { name: "V", unit: "V", measure: () => this.state[S.V] },
    { name: "I", unit: "A", measure: () => this.state[S.I] },
  ];

  /** The anode terminal. */
  private na!: Node;
  /** The cathode terminal. */
  private nc!: Node;

  override connect(network: Network, [na, nc]: readonly Node[]): void {
    this.na = na;
    this.nc = nc;
  }

  override deriveState(state: DeviceState, params: EvalParams): void {
    const Is = this.properties.getNumber("Is");
    const N = this.properties.getNumber("N");
    const temp = celsiusToKelvin(this.properties.getNumber("temp", params.temp));
    const [Vt, Ist, Vcrit] = pnTemp(temp, Is, N);
    state[S.Is] = Ist;
    state[S.Vt] = Vt;
    state[S.Vcrit] = Vcrit;
  }

  private eval0(state: DeviceState, damped: boolean): void {
    const { na, nc } = this;
    const Is = state[S.Is];
    const Vt = state[S.Vt];
    const Vcrit = state[S.Vcrit];
    let V = na.voltage - nc.voltage;
    if (damped) {
      V = pnVoltage(V, state[S.V], Vt, Vcrit);
    }
    const I = pnCurrent(V, Is, Vt);
    const G = pnConductance(V, Is, Vt) + gMin;
    state[S.V] = V;
    state[S.I] = I;
    state[S.G] = G;
  }

  override eval(state: DeviceState, params: EvalParams, stamper: Stamper): void {
    const { na, nc } = this;
    this.eval0(state, true);
    const V = state[S.V];
    const I = state[S.I];
    const G = state[S.G];
    stampConductance(stamper, na, nc, G);
    stampCurrentSource(stamper, na, nc, I - G * V);
  }

  override endEval(state: DeviceState): void {
    this.eval0(state, false);
  }
}
