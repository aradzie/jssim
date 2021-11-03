import { Device, DeviceState, StateParams } from "../../circuit/device";
import type { Node, Stamper } from "../../circuit/network";
import { Params, ParamsSchema } from "../../circuit/params";

export interface CSourceParams {
  readonly I: number;
}

const enum S {
  I,
  V,
  P,
  _Size_,
}

/**
 * Current source.
 */
export class CSource extends Device<CSourceParams> {
  static override readonly id = "I";
  static override readonly numTerminals = 2;
  static override readonly paramsSchema: ParamsSchema<CSourceParams> = {
    I: Params.number({ title: "current" }),
  };
  static override readonly stateParams: StateParams = {
    length: S._Size_,
    outputs: [
      { index: S.I, name: "I", unit: "A" },
      { index: S.V, name: "V", unit: "V" },
      { index: S.P, name: "P", unit: "W" },
    ],
  };

  /** Positive terminal. */
  readonly np: Node;
  /** Negative terminal. */
  readonly nn: Node;

  constructor(id: string, [np, nn]: readonly Node[], params: CSourceParams) {
    super(id, [np, nn], params);
    this.np = np;
    this.nn = nn;
  }

  override eval(state: DeviceState, final: boolean): void {
    const { params, np, nn } = this;
    const { I } = params;
    const V = np.voltage - nn.voltage;
    const P = V * I;
    state[S.I] = I;
    state[S.V] = V;
    state[S.P] = P;
  }

  override stamp(stamper: Stamper): void {
    const { params, np, nn } = this;
    const { I } = params;
    stamper.stampCurrentSource(np, nn, I);
  }
}
