import type { DeviceClass } from "../circuit/device.js";
import { Ammeter } from "./ammeter.js";
import { Capacitor } from "./capacitor.js";
import { Ground } from "./ground.js";
import { Bjt } from "./nonlinear/bjt.js";
import { Diode } from "./nonlinear/diode.js";
import { Jfet } from "./nonlinear/jfet.js";
import { Mosfet } from "./nonlinear/mosfet.js";
import { OpAmp } from "./nonlinear/opamp.js";
import { Resistor } from "./resistor.js";
import { CCCSource } from "./source/cccsource.js";
import { CCVSource } from "./source/ccvsource.js";
import { CSource } from "./source/csource.js";
import { VCCSource } from "./source/vccsource.js";
import { VCVSource } from "./source/vcvsource.js";
import { VSource } from "./source/vsource.js";

export {
  Ammeter,
  Bjt,
  CCCSource,
  CCVSource,
  CSource,
  Capacitor,
  Diode,
  Ground,
  Jfet,
  Mosfet,
  OpAmp,
  Resistor,
  VCCSource,
  VCVSource,
  VSource,
};

export const devices: readonly DeviceClass[] = [
  Ammeter,
  Bjt,
  CCCSource,
  CCVSource,
  CSource,
  Capacitor,
  Diode,
  Ground,
  Jfet,
  Mosfet,
  OpAmp,
  Resistor,
  VCCSource,
  VCVSource,
  VSource,
];
