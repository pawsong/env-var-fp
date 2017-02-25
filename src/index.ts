import * as flow from 'lodash/fp/flow';

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

export const env: Env = function createEnvVarParser(...fns: Function[]) {
  return function parseEnvVar(varName: string) {
    try {
      return flow(...fns)(process.env[varName]);
    } catch (err) {
      throw new Error(`Parsing env var ${varName} failed: ${err.message}`);
    }
  };
};

export function requires<T>(value: T) {
  if (value === undefined) {
    throw new Error('Argument undefined');
  }
  return value;
}

export function requiresIf(enabled: boolean) {
  return function _requiresIf<T>(value: T) {
    return enabled ? requires(value) : value;
  };
}
