export interface Env {
  (): (varName: string) => string;
  <T1>(
    fn1: (a: string) => T1,
  ): (varName: string) => T1;
  <T1, T2>(
    fn1: (a: string) => T1,
    fn2: (a: T1) => T2,
  ): (varName: string) => T2;
  <T1, T2, T3>(
    fn1: (a: string) => T1,
    fn2: (a: T1) => T2,
    fn3: (a: T2) => T3,
  ): (varName: string) => T3;
  <T1, T2, T3, T4>(
    fn1: (a: string) => T1,
    fn2: (a: T1) => T2,
    fn3: (a: T2) => T3,
    fn4: (a: T3) => T4,
  ): (varName: string) => T4;
  <T1, T2, T3, T4, T5>(
    fn1: (a: string) => T1,
    fn2: (a: T1) => T2,
    fn3: (a: T2) => T3,
    fn4: (a: T3) => T4,
    fn5: (a: T4) => T5,
  ): (varName: string) => T5;
  <T1, T2, T3, T4, T5, T6>(
    fn1: (a: string) => T1,
    fn2: (a: T1) => T2,
    fn3: (a: T2) => T3,
    fn4: (a: T3) => T4,
    fn5: (a: T4) => T5,
    fn6: (a: T5) => T6,
  ): (varName: string) => T6;
}

const returnsSymbol = Symbol();

export const env: Env = function createEnvVarParser(...fns: Array<(a: any) => any>) {
  return function parseEnvVar(varName: string) {
    try {
      let current = process.env[varName];

      for (const fn of fns) {
        const next = fn(current);
        if (next === returnsSymbol) {
          return current;
        } else {
          current = next;
        }
      }

      return current;
    } catch (err) {
      throw new Error(`Parsing env var ${varName} failed: ${err.message}`);
    }
  };
};

type Test<T> = (value: T) => any;
type Identity = <T>(value: T) => T;

function runTest<T>(test: boolean, value: T): any
function runTest<T>(test: Test<T>, value: T): any
function runTest<T>(test: boolean | Test<T>, value: T): any {
  if (typeof test === 'boolean') {
    return test;
  } else {
    return test(value);
  }
}

export function requires<T>(value: T) {
  if (value === undefined) {
    throw new Error('Argument undefined');
  }
  return value;
}

export function requiresIf(test: boolean): Identity;
export function requiresIf<T>(test: Test<T>): (value: T) => T
export function requiresIf<T>(test: boolean | Test<T>) {
  return function _requiresIf(value: T) {
    return runTest(test as any /* weird error */, value) ? requires(value) : value;
  };
}

export function returnsIf(test: boolean): Identity;
export function returnsIf<T>(test: Test<T>): (value: T) => T
export function returnsIf<T>(test: boolean | Test<T>) {
  return function _returnsIf(value: T) {
    const result = runTest(test as any /* weird error */, value) ? returnsSymbol : value;
    return result as T;
  };
}

export const returnsIfFalsy: Identity = returnsIf((value) => !value);

export const returnsIfTruthy: Identity = returnsIf((value) => !!value);

export function assert(test: boolean): Identity;
export function assert<T>(test: Test<T>): (value: T) => T;
export function assert<T>(test: boolean | Test<T>) {
  return function _assert(value: T) {
    if (!runTest(test as any /* weird error */, value)) {
      throw new Error('Assertion failed');
    }
    return value;
  };
}
