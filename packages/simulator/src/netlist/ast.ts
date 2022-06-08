const builtinPos = Object.freeze<Position>({
  offset: 0,
  line: 0,
  column: 0,
});
const builtinLocation = Object.freeze<Location>({
  start: builtinPos,
  end: builtinPos,
});

export interface Position {
  readonly offset: number;
  readonly line: number;
  readonly column: number;
}

export interface Location {
  readonly start: Position;
  readonly end: Position;
}

export interface HasLocation {
  readonly location: Location;
}

export interface HasId {
  readonly id: Identifier;
}

export interface Document {
  readonly items: readonly Item[];
}

export interface Node {}

export interface Identifier extends Node {
  readonly name: string;
}

export type Item = InstanceItem | ModelItem | EquationItem | DcItem | TranItem;

export interface InstanceItem extends Node {
  readonly type: "instance";
  readonly deviceId: Identifier;
  readonly modelId: Identifier | null;
  readonly instanceId: Identifier | null;
  readonly nodes: readonly Identifier[];
  readonly properties: readonly Property[];
}

export interface ModelItem extends Node, HasId {
  readonly type: "model";
  readonly deviceId: Identifier;
  readonly modelId: Identifier;
  readonly properties: readonly Property[];
}

export interface Property extends Node, HasId {
  readonly id: Identifier;
  readonly value: PropertyValue;
}

export type PropertyValue = StringPropertyValue | ExpPropertyValue;

export interface StringPropertyValue {
  readonly type: "string";
  readonly value: string;
}

export interface ExpPropertyValue {
  readonly type: "exp";
  readonly value: Expression;
}

export interface EquationItem extends Node, HasId {
  readonly type: "equation";
  readonly id: Identifier;
  readonly value: Expression;
}

export interface DcItem extends Node {
  readonly type: "dc";
  readonly properties: readonly Property[];
  readonly sweeps: readonly SweepNode[];
}

export interface TranItem extends Node {
  readonly type: "tran";
  readonly properties: readonly Property[];
  readonly sweeps: readonly SweepNode[];
}

export interface SweepNode extends Node {
  readonly variable: string;
  readonly from: number;
  readonly to: number;
  readonly points: number;
}

export type Expression = UnaryExp | BinaryExp | LiteralExp | VarExp | FuncExp;

export interface UnaryExp extends Node {
  readonly type: "unary";
  readonly op: "+" | "-";
  readonly arg: Expression;
}

export interface BinaryExp extends Node {
  readonly type: "binary";
  readonly op: "+" | "-" | "*" | "/" | "^";
  readonly arg1: Expression;
  readonly arg2: Expression;
}

export interface LiteralExp extends Node {
  readonly type: "literal";
  readonly value: number;
}

export interface VarExp extends Node, HasId {
  readonly type: "var";
  readonly id: Identifier;
}

export interface FuncExp extends Node, HasId {
  readonly type: "func";
  readonly id: Identifier;
  readonly args: readonly Expression[];
}

export function equation(name: string, value: Expression): EquationItem {
  return {
    type: "equation",
    id: { name },
    value,
  };
}

export function literalExp(value: number): LiteralExp {
  return { type: "literal", value };
}

export const builtins: readonly EquationItem[] = [
  equation("$PI", literalExp(Math.PI)),
  equation("$E", literalExp(Math.E)),
];
