import { expect } from 'chai';
import { defaultTo } from 'lodash/fp';
import { env, requires } from '../src';

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

  it('should compatible with other functional utilities', () => {
    expect(
      env(defaultTo('2'), parseFloat)('UNDEFINED_VAR'),
    ).to.equal(2);
  });
});
