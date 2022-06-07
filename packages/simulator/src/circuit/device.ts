import type { Network, Node, Stamper } from "./network.js";
import { Properties, PropertiesSchema } from "./properties.js";

export interface DeviceClass {
  /** Unique device class identifier. */
  readonly id: string;

  /** The number of terminals in the device. */
  readonly numTerminals: number;

  /** Schema of the device parameters. */
  readonly propertiesSchema: PropertiesSchema;

  /** Schema of the device state vector. */
  readonly stateSchema: StateSchema;

  /**
   * Device constructor.
   * @param id Unique device instance identifier.
   * @param nodes Circuit nodes to which the device terminals are connected.
   */
  new (id: string, nodes: readonly Node[]): Device;
}

/**
 * Device states are kept in typed arrays.
 */
export type DeviceState = Float64Array;

export interface OutputParam {
  /** Element index. */
  readonly index: number;
  /** Output parameter name. */
  readonly name: string;
  /** Output parameter unit. */
  readonly unit: string;
}

export interface StateSchema {
  /** Length of the state vector. */
  readonly length: number;
  /** Output parameters from the state vector. */
  readonly ops: readonly OutputParam[];
}

export type EvalOptions = {
  /**
   * Elapsed simulation time.
   */
  readonly elapsedTime: number;
  /**
   * Time step from the last simulation.
   */
  readonly timeStep: number;
  /**
   * A very small conductance added across nonlinear devices
   * to prevent nodes from floating if a device is turned completely off.
   */
  readonly gmin: number;
};

export abstract class Device {
  /** Unique device class identifier. */
  static readonly id: string;

  /** The number of terminals in the device. */
  static readonly numTerminals: number;

  /** Schema of the device parameters. */
  static readonly propertiesSchema: PropertiesSchema;

  /** Schema of the device state vector. */
  static readonly stateSchema: StateSchema;

  /** Unique device instance identifier. */
  readonly id: string;

  /** The list of nodes to which the device terminals are connected. */
  readonly nodes: readonly Node[];

  /** Device properties. */
  readonly properties: Properties;

  /** Vector with device state variables. */
  state: DeviceState;

  constructor(id: string, nodes: readonly Node[]) {
    this.id = id;
    this.nodes = nodes;
    const { propertiesSchema, stateSchema } = this.deviceClass;
    this.properties = new Properties(propertiesSchema);
    this.state = new Float64Array(stateSchema.length);
  }

  get deviceClass(): DeviceClass {
    return this.constructor as DeviceClass;
  }

  /**
   * Derive state from params.
   */
  deriveState(state: DeviceState): void {}

  /**
   * Circuit calls this method to let a device to allocate extra nodes and
   * branches.
   * @param network A network which contains allocated nodes and branches.
   */
  connect(network: Network): void {}

  beginEval(state: DeviceState, options: EvalOptions): void {}

  /**
   * Circuit calls this method to let a device  compute its state
   * from the current node voltages and branch currents.
   * @param state Device state which is saved between iterations.
   * @param options Evaluation options.
   */
  eval(state: DeviceState, options: EvalOptions): void {}

  /**
   * Circuit calls this method to let a device stamp the MNA matrix
   * with values obtained from the previously computed state.
   * @param state Device state which is saved between iterations.
   * @param stamper A stamper which updates MNA matrix and RHS vector.
   */
  stamp(state: DeviceState, stamper: Stamper): void {}

  endEval(state: DeviceState, options: EvalOptions): void {}

  /**
   * Returns value of an output parameter with the given name.
   */
  op(name: string): number {
    const { stateSchema } = this.deviceClass;
    for (const op of stateSchema.ops) {
      if (name === op.name) {
        return this.state[op.index];
      }
    }
    throw new TypeError(`Unknown output param [${name}]`);
  }
}
