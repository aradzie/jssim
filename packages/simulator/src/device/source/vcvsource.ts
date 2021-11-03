import { Device, DeviceState, StateParams } from "../../circuit/device";
import type { Branch, Network, Node, Stamper } from "../../circuit/network";
import { Params, ParamsSchema } from "../../circuit/params";

export interface VCVSourceParams {
  readonly gain: number;
}

const enum S {
  V,
  I,
  P,
  _Size_,
}

/**
 * Voltage-controlled voltage source.
 */
export class VCVSource extends Device<VCVSourceParams> {
  static override readonly id = "VCVS";
  static override readonly numTerminals = 4;
  static override readonly paramsSchema: ParamsSchema<VCVSourceParams> = {
    gain: Params.number({ title: "gain" }),
  };
  static override readonly stateParams: StateParams = {
    length: S._Size_,
    outputs: [
      { index: S.V, name: "V", unit: "V" },
      { index: S.I, name: "I", unit: "A" },
      { index: S.P, name: "P", unit: "W" },
    ],
  };

  /** Positive output terminal. */
  readonly np: Node;
  /** Negative output terminal. */
  readonly nn: Node;
  /** Positive control terminal. */
  readonly ncp: Node;
  /** Negative control terminal. */
  readonly ncn: Node;
  /** Extra MNA branch. */
  private branch!: Branch;

  constructor(id: string, [np, nn, ncp, ncn]: readonly Node[], params: VCVSourceParams) {
    super(id, [np, nn, ncp, ncn], params);
    this.np = np;
    this.nn = nn;
    this.ncp = ncp;
    this.ncn = ncn;
  }

  override connect(network: Network): void {
    this.branch = network.allocBranch(this.np, this.nn);
  }

  override eval(state: DeviceState, final: boolean): void {
    const { np, nn, branch } = this;
    const V = np.voltage - nn.voltage;
    const I = branch.current;
    const P = V * I;
    state[S.V] = V;
    state[S.I] = I;
    state[S.P] = P;
  }

  override stamp(stamper: Stamper): void {
    const { np, nn, ncp, ncn, branch, params } = this;
    const { gain } = params;
    stamper.stampVoltageSource(np, nn, branch, 0);
    stamper.stampMatrix(branch, ncp, -gain);
    stamper.stampMatrix(branch, ncn, gain);
  }
}
