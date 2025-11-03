/*
 * Lightweight Zod-compatible facade tailored for this project.
 * Implements the subset of APIs used in components.
 */

export type SafeParseSuccess<T> = { success: true; data: T };
export type SafeParseFailure = {
  success: false;
  error: {
    formErrors: {
      fieldErrors: Record<string, string[]>;
    };
  };
};
export type SafeParseReturnType<T> = SafeParseSuccess<T> | SafeParseFailure;

type Issue = { path: string[]; message: string };

type ParseContext = { issues: Issue[] };

abstract class BaseSchema<T> {
  protected refinements: Array<{ check: (value: T) => boolean; message: string }> = [];

  refine(check: (value: T) => boolean, message = "Invalid value"): this {
    this.refinements.push({ check, message });
    return this;
  }

  optional(): ZOptional<T> {
    return new ZOptional(this);
  }

  protected applyRefinements(value: T, ctx: ParseContext, path: string[]): void {
    for (const { check, message } of this.refinements) {
      if (!check(value)) {
        ctx.issues.push({ path, message });
      }
    }
  }

  parse(data: unknown): T {
    const ctx: ParseContext = { issues: [] };
    const value = this._parse(data, ctx, []);

    if (ctx.issues.length > 0 || value === undefined) {
      throw new Error(ctx.issues.map((issue) => issue.message).join(", "));
    }

    return value;
  }

  safeParse(data: unknown): SafeParseReturnType<T> {
    const ctx: ParseContext = { issues: [] };
    const value = this._parse(data, ctx, []);

    if (ctx.issues.length > 0 || value === undefined) {
      const fieldErrors: Record<string, string[]> = {};
      ctx.issues.forEach((issue) => {
        const key = issue.path.join(".") || "_root";
        fieldErrors[key] = fieldErrors[key] ? [...fieldErrors[key], issue.message] : [issue.message];
      });

      return { success: false, error: { formErrors: { fieldErrors } } };
    }

    return { success: true, data: value };
  }

  protected abstract _parse(data: unknown, ctx: ParseContext, path: string[]): T | undefined;
}

class ZString extends BaseSchema<string> {
  private regexValidator?: { pattern: RegExp; message: string };

  regex(pattern: RegExp, message = "Invalid format"): this {
    this.regexValidator = { pattern, message };
    return this;
  }

  protected _parse(data: unknown, ctx: ParseContext, path: string[]): string | undefined {
    if (typeof data !== "string") {
      ctx.issues.push({ path, message: "Expected string" });
      return undefined;
    }

    if (this.regexValidator && !this.regexValidator.pattern.test(data)) {
      ctx.issues.push({ path, message: this.regexValidator.message });
      return undefined;
    }

    this.applyRefinements(data, ctx, path);
    return data;
  }
}

class ZNumber extends BaseSchema<number> {
  private minValue?: { value: number; message: string };
  private maxValue?: { value: number; message: string };
  private mustBeInt = false;
  private intMessage = "Value must be an integer";

  min(value: number, message = `Value must be greater than or equal to ${value}`): this {
    this.minValue = { value, message };
    return this;
  }

  max(value: number, message = `Value must be less than or equal to ${value}`): this {
    this.maxValue = { value, message };
    return this;
  }

  int(message = "Value must be an integer"): this {
    this.mustBeInt = true;
    this.intMessage = message;
    return this;
  }

  protected _parse(data: unknown, ctx: ParseContext, path: string[]): number | undefined {
    if (typeof data !== "number" || Number.isNaN(data)) {
      ctx.issues.push({ path, message: "Expected number" });
      return undefined;
    }

    if (this.mustBeInt && !Number.isInteger(data)) {
      ctx.issues.push({ path, message: this.intMessage });
      return undefined;
    }

    if (this.minValue && data < this.minValue.value) {
      ctx.issues.push({ path, message: this.minValue.message });
      return undefined;
    }

    if (this.maxValue && data > this.maxValue.value) {
      ctx.issues.push({ path, message: this.maxValue.message });
      return undefined;
    }

    this.applyRefinements(data, ctx, path);
    return data;
  }
}

class ZEnum<T extends string> extends BaseSchema<T> {
  constructor(private readonly options: readonly T[]) {
    super();
  }

  protected _parse(data: unknown, ctx: ParseContext, path: string[]): T | undefined {
    if (typeof data !== "string" || !this.options.includes(data as T)) {
      ctx.issues.push({ path, message: "Invalid option" });
      return undefined;
    }

    this.applyRefinements(data as T, ctx, path);
    return data as T;
  }
}

class ZArray<T> extends BaseSchema<T[]> {
  private minLength?: { value: number; message: string };
  private maxLength?: { value: number; message: string };

  constructor(private readonly schema: BaseSchema<T>) {
    super();
  }

  min(value: number, message = `Array must contain at least ${value} item(s)`): this {
    this.minLength = { value, message };
    return this;
  }

  max(value: number, message = `Array must contain at most ${value} item(s)`): this {
    this.maxLength = { value, message };
    return this;
  }

  protected _parse(data: unknown, ctx: ParseContext, path: string[]): T[] | undefined {
    if (!Array.isArray(data)) {
      ctx.issues.push({ path, message: "Expected array" });
      return undefined;
    }

    if (this.minLength && data.length < this.minLength.value) {
      ctx.issues.push({ path, message: this.minLength.message });
      return undefined;
    }

    if (this.maxLength && data.length > this.maxLength.value) {
      ctx.issues.push({ path, message: this.maxLength.message });
      return undefined;
    }

    const result: T[] = [];
    data.forEach((item, index) => {
      const parsed = this.schema._parse(item, ctx, [...path, String(index)]);
      if (parsed !== undefined) {
        result.push(parsed);
      }
    });

    this.applyRefinements(result, ctx, path);
    return result;
  }
}

class ZOptional<T> extends BaseSchema<T | undefined> {
  constructor(private readonly schema: BaseSchema<T>) {
    super();
  }

  protected _parse(data: unknown, ctx: ParseContext, path: string[]): T | undefined {
    if (data === undefined || data === null || data === "") {
      return undefined;
    }

    return this.schema._parse(data, ctx, path);
  }
}

type Shape = Record<string, BaseSchema<unknown>>;

type InferShape<S extends Shape> = {
  [K in keyof S]: S[K] extends BaseSchema<infer R> ? R : never;
};

class ZObject<S extends Shape> extends BaseSchema<InferShape<S>> {
  constructor(private readonly shape: S) {
    super();
  }

  protected _parse(data: unknown, ctx: ParseContext, path: string[]): InferShape<S> | undefined {
    if (typeof data !== "object" || data === null) {
      ctx.issues.push({ path, message: "Expected object" });
      return undefined;
    }

    const result = {} as InferShape<S>;
    for (const key of Object.keys(this.shape) as Array<keyof S>) {
      const schema = this.shape[key];
      const value = (data as Record<string, unknown>)[key as string];
      const parsed = schema._parse(value, ctx, [...path, key as string]);
      (result as Record<string, unknown>)[key as string] = parsed;
    }

    this.applyRefinements(result, ctx, path);
    return result;
  }
}

export const z = {
  string: () => new ZString(),
  number: () => new ZNumber(),
  enum: <T extends string>(options: readonly T[]) => new ZEnum<T>(options),
  array: <T>(schema: BaseSchema<T>) => new ZArray<T>(schema),
  object: <S extends Shape>(shape: S) => new ZObject<S>(shape),
};

export type infer<T> = T extends BaseSchema<infer R> ? R : never;

export default z;
