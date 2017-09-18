import { expect } from 'chai';
import { defaultTo } from 'lodash/fp';
import {
  env,
  requires,
  requiresIf,
  returnsIf,
  returnsIfFalsy,
  returnsIfTruthy,
} from '../src';

describe('env', () => {
  beforeEach(() => {
    process.env = {};
  });

  it('should return env var when no functions is passed', () => {
    process.env = { TEST1: 'this is test' };
    expect(
      env()('TEST1'),
    ).to.equal('this is test');
  });

  it('should detect an undefined variable with `requires`', () => {
    expect(
      () => env(requires)('UNDEFINED_VAR'),
    ).to.throw('Parsing env var UNDEFINED_VAR failed: Argument undefined');
  });

  it('should process function chain', () => {
    expect(
      env(() => 2, (a) => a * 3, (a) => a.toString())('UNDEFINED_VAR'),
    ).to.equal('6');
  });

  it('should compatible with other functional utilities', () => {
    expect(
      env(defaultTo('2'), parseFloat)('UNDEFINED_VAR'),
    ).to.equal(2);
  });
});

describe('requires', () => {
  it('should throw error when parameter is undefined', () => {
    expect(
      () => requires(undefined),
    ).to.throw('Argument undefined');
  });

  it('should return given parameter', () => {
    expect(
      requires('123'),
    ).to.equal('123');
  });
});

describe('requiresIf', () => {
  it('should throw error on undefined on test success', () => {
    expect(
      () => requiresIf(true)(undefined),
    ).to.throw('Argument undefined');

    expect(
      () => requiresIf(() => true)(undefined),
    ).to.throw('Argument undefined');
  });

  it('should not throw error on undefined on test failure', () => {
    expect(
      requiresIf(false)(undefined),
    ).to.equal(undefined);

    expect(
      requiresIf(() => false)(undefined),
    ).to.equal(undefined);
  });
});

describe('returnsIf', () => {
  it('should break function chaining loop and return previous value on test success', () => {
    expect(
      env(defaultTo('3'), returnsIf(true), parseFloat)('UNDEFINED_VAR'),
    ).to.equal('3');

    expect(
      env(defaultTo('3'), returnsIf(() => true), parseFloat)('UNDEFINED_VAR'),
    ).to.equal('3');
  });

  it('should continue function chaining loop on test failure', () => {
    expect(
      env(defaultTo('3'), returnsIf(false), parseFloat)('UNDEFINED_VAR'),
    ).to.equal(3);

    expect(
      env(defaultTo('3'), returnsIf(() => false), parseFloat)('UNDEFINED_VAR'),
    ).to.equal(3);
  });
});

describe('returnsIfFalsy', () => {
  it('should break function chaining loop and return previous value on falsy value', () => {
    expect(
      env(defaultTo(''), returnsIfFalsy, () => 2)('UNDEFINED_VAR'),
    ).to.equal('');
  });

  it('should continue function chaining loop on truthy value', () => {
    expect(
      env(defaultTo('3'), returnsIfFalsy, () => 2)('UNDEFINED_VAR'),
    ).to.equal(2);
  });
});

describe('returnsIfTruthy', () => {
  it('should break function chaining loop and return previous value on truthy value', () => {
    expect(
      env(defaultTo('3'), returnsIfTruthy, () => 2)('UNDEFINED_VAR'),
    ).to.equal('3');
  });

  it('should continue function chaining loop on falsy value', () => {
    expect(
      env(defaultTo(''), returnsIfTruthy, () => 2)('UNDEFINED_VAR'),
    ).to.equal(2);
  });
});
