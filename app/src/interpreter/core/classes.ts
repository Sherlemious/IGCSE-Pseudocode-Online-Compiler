import type { BlockContext, DataTypeContext } from '../generated/PseudocodeParser';
import { RuntimeValue } from './values';

export type Visibility = 'PUBLIC' | 'PRIVATE';

export interface MethodDefinition {
  name: string;
  params: { name: string; type: string; mode: 'BYVAL' | 'BYREF' }[];
  body: BlockContext;
  returnType?: string;
  isFunction: boolean;
  visibility: Visibility;
}

export interface ClassFieldDef {
  name: string;
  dataTypeCtx: DataTypeContext;
  visibility: Visibility;
}

export class ClassDefinition {
  constructor(
    public name: string,
    public parent: ClassDefinition | null,
    public fields: ClassFieldDef[],
    /** UPPERCASE method name → definition (constructor is stored as 'NEW') */
    public methods: Map<string, MethodDefinition>,
  ) {}

  findMethod(name: string): { method: MethodDefinition; owner: ClassDefinition } | undefined {
    const m = this.methods.get(name.toUpperCase());
    if (m) return { method: m, owner: this };
    return this.parent?.findMethod(name);
  }

  findField(name: string): ClassFieldDef | undefined {
    const key = name.toUpperCase();
    const own = this.fields.find((f) => f.name.toUpperCase() === key);
    if (own) return own;
    return this.parent?.findField(name);
  }

  /** Fields from the root ancestor down to this class, in declaration order. */
  allFields(): ClassFieldDef[] {
    const parentFields = this.parent ? this.parent.allFields() : [];
    return [...parentFields, ...this.fields];
  }

  isInChainOf(other: ClassDefinition): boolean {
    if (this === other) return true;
    return this.parent ? this.parent.isInChainOf(other) : false;
  }
}

export class ClassInstance {
  /** UPPERCASE field name → value */
  fields = new Map<string, RuntimeValue>();

  constructor(public classDef: ClassDefinition) {}
}
