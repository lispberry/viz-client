export type Pointer = string;

export interface BaseOp {
  kind: 'DereferencePointer' | 'NewListPointer' | 'SetListPointerNext' | 'SetListPointerValue';
}

export interface PointerDereference extends BaseOp {
  kind: 'DereferencePointer';
  address: Pointer;
}

export interface ListPointer {
  address: Pointer;
  data: string | number;
  next: Pointer;
}

export interface NewListPointer extends BaseOp {
  kind: 'NewListPointer';
  value: ListPointer;
}

export interface SetListPointerNext extends BaseOp {
  kind: 'SetListPointerNext';
  value: {
    address: Pointer;
    next: string;
  }
}

export interface SetListPointerValue extends BaseOp {
  kind: 'SetListPointerValue';
  value: {
    address: Pointer;
    value: string | number;
  }
}

export type Op = NewListPointer | PointerDereference | SetListPointerNext | SetListPointerValue; 

export interface Step {
  kind: 'Step';
  line: number;
  ops: Array<Op>;
}

export interface Execution {
  kind: 'Execution';
  steps: Array<Step>;
}
