import type { DeviceClass } from "../simulation/device";
import { Ground } from "./ground";
import { ICISource } from "./icisource";
import { ICVSource } from "./icvsource";
import { ISource } from "./isource";
import { OpAmp } from "./opamp";
import { Resistor } from "./resistor";
import { VCISource } from "./vcisource";
import { VCVSource } from "./vcvsource";
import { VSource } from "./vsource";

export {
  Ground,
  ICISource,
  ICVSource,
  ISource,
  OpAmp,
  Resistor,
  VCISource,
  VCVSource,
  VSource,
};

export const devices: readonly DeviceClass[] = [
  Ground,
  ICISource,
  ICVSource,
  ISource,
  OpAmp,
  Resistor,
  VCISource,
  VCVSource,
  VSource,
];
