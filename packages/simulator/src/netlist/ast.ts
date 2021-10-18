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

export interface Netlist {
  readonly items: readonly Item[];
}

export interface Node {}

export interface Identifier extends Node {
  readonly id: string;
}

export type Item = Definition | Equation | Action;

export interface Definition extends Node {
  readonly type: "definition";
  readonly deviceId: Identifier;
  readonly id: Identifier | null;
  readonly nodes: readonly Identifier[];
  readonly properties: readonly Property[];
}

export interface Property extends Node {
  readonly name: Identifier;
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

export interface Equation extends Node {
  readonly type: "equation";
  readonly name: Identifier;
  readonly value: Expression;
}

export interface Action extends Node {
  readonly type: "action";
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
  readonly a: Expression;
  readonly b: Expression;
}

export interface LiteralExp extends Node {
  readonly type: "literal";
  readonly value: number;
}

export interface VarExp extends Node {
  readonly type: "var";
  readonly id: Identifier;
}

export interface FuncExp extends Node {
  readonly type: "func";
  readonly id: Identifier;
  readonly args: readonly Expression[];
}

export function equation(name: string, value: Expression): Equation {
  return {
    type: "equation",
    name: { id: name },
    value,
  };
}

export function literalExp(value: number): LiteralExp {
  return { type: "literal", value };
}
