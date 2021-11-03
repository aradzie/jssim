import { Device, DeviceState, StateParams } from "../../circuit/device";
import type { DeviceModel } from "../../circuit/library";
import type { Node, Stamper } from "../../circuit/network";
import type { Op } from "../../circuit/ops";
import { Params, ParamsSchema } from "../../circuit/params";
import { Unit } from "../../util/unit";
import { Temp } from "../const";
import { PN } from "./semi";

export interface DiodeParams {
  readonly Is: number;
  readonly N: number;
  readonly Temp: number;
}

const enum S {
  V,
  I,
  G,
  P,
  _Size_,
}

/**
 * Diode.
 */
export class Diode extends Device<DiodeParams> {
  static override getModels(): readonly DeviceModel[] {
    return [["Diode", Diode.modelDiode]];
  }

  static modelDiode = Object.freeze<DiodeParams>({
    Is: 1e-14,
    N: 1,
    Temp,
  });

  static override readonly id = "Diode";
  static override readonly numTerminals = 2;
  static override readonly paramsSchema: ParamsSchema<DiodeParams> = {
    Is: Params.number({
      default: 1e-14,
      min: 0,
      title: "saturation current",
    }),
    N: Params.number({
      default: 1,
      min: 1e-3,
      max: 100,
      title: "emission coefficient",
    }),
    Temp: Params.Temp,
  };
  static override readonly stateParams: StateParams = {
    length: S._Size_,
    outputs: [
      { index: S.V, name: "V", unit: "V" },
      { index: S.I, name: "I", unit: "A" },
      { index: S.P, name: "P", unit: "W" },
    ],
  };

  /** The anode terminal. */
  readonly na: Node;
  /** The cathode terminal. */
  readonly nc: Node;
  /** The PN junction of diode. */
  readonly pn: PN;

  constructor(id: string, [na, nc]: readonly Node[], params: DiodeParams) {
    super(id, [na, nc], params);
    this.na = na;
    this.nc = nc;
    const { Is, N, Temp } = this.params;
    this.pn = new PN(Is, N, Temp);
  }

  override eval(state: DeviceState): void {
    const { na, nc, pn } = this;
    const Vd = (state[S.V] = pn.limitVoltage(na.voltage - nc.voltage, state[S.V]));
    state[S.I] = pn.evalCurrent(Vd);
    state[S.G] = pn.evalConductance(Vd);
  }

  override stamp(stamper: Stamper, [Vd, Id, Gd]: DeviceState): void {
    const { na, nc } = this;
    stamper.stampConductance(na, nc, Gd);
    stamper.stampCurrentSource(na, nc, Id - Gd * Vd);
  }

  override ops([VX, I, G]: DeviceState = this.state): readonly Op[] {
    const { na, nc } = this;
    const V = na.voltage - nc.voltage;
    const P = V * I;
    return [
      { name: "V", value: V, unit: Unit.VOLT },
      { name: "I", value: I, unit: Unit.AMPERE },
      { name: "P", value: P, unit: Unit.WATT },
    ];
  }
}
