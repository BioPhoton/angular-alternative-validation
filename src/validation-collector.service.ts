import {Inject, Injectable, Optional} from '@angular/core';
import {
  AsyncValidatorFn,
  NG_ASYNC_VALIDATORS,
  NG_VALIDATORS,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {IValidatorConfig} from './struct/validator-config';
@Injectable()
export class ValidationCollectorService {

  constructor(
    @Optional() @Inject(NG_VALIDATORS) private NG_VALIDATORS: ValidatorFn[],
    @Optional() @Inject(NG_ASYNC_VALIDATORS) private NG_ASYNC_VALIDATORS: AsyncValidatorFn[]
  ) {
  }

  getValidators(validatorsConfig: IValidatorConfig[]): ValidatorFn[] {
    let validators: ValidatorFn[] = [];

    if (validatorsConfig) {
      validators = validatorsConfig.map((validatorObj: IValidatorConfig) => {
        return this.getValidatorFn(validatorObj.name, validatorObj.params);
      });
    }
    return validators;
  }

  getValidatorFn(validatorName: string, validatorArgs?: any[]): ValidatorFn {
    if (!validatorName) {
      throw new Error('No validation name given to search for');
    }
    const validatorFn = Validators[validatorName] || this.getCustomValidatorFn(validatorName);

    if (!(typeof validatorFn === 'function')) {
      throw new Error(`Validator "${validatorName}" is not provided via NG_VALIDATORS`);
    }

    const finalFunction = (validatorArgs) ? validatorFn(...validatorArgs) : validatorFn;

    if (typeof finalFunction !== 'function') {
      throw new Error(`Validator "${validatorName}" is not provided a function.
      Did you provide params for a validator that don't need them?`);
    }

    return finalFunction;
  }

  getCustomValidatorFn(validatorName: string): ValidatorFn | undefined {
    let validatorFn;

    if (!validatorName) {
      throw new Error('No validation name given to search for');
    }

    if (this.NG_VALIDATORS) {
      validatorFn = this.NG_VALIDATORS.find((fn) => {
        return validatorName === fn.name;
      });
    }

    return validatorFn;
  }

  getAsyncValidators(config: IValidatorConfig[]): AsyncValidatorFn[] {
    let asyncValidators: AsyncValidatorFn[] = [];

    if (config) {
      asyncValidators = config.map((validatorObj: IValidatorConfig) => {
        return this.getCustomAsyncValidatorFn(validatorObj.name, validatorObj.params);
      });
    }
    return asyncValidators;
  }

  getCustomAsyncValidatorFn(validatorName: string, validatorArgs?: any[]): AsyncValidatorFn {
    let asyncValidatorFn;

    if (!validatorName) {
      throw new Error('No asyncvalidation name given to search for');
    }

    if (this.NG_ASYNC_VALIDATORS) {

      asyncValidatorFn = this.NG_ASYNC_VALIDATORS.find(
        (aFn) => {
          return validatorName === aFn.name;
        });
    }

    if (!(typeof asyncValidatorFn === 'function')) {
      throw new Error(`Asyncvalidator "${validatorName}" is not provided via NG_ASYNC_VALIDATORS`);
    }

    const finalFunction = (validatorArgs) ? asyncValidatorFn(...validatorArgs) : asyncValidatorFn;

    if (typeof finalFunction !== 'function') {
      throw new Error(`Asyncvalidator "${validatorName}" is not provided a function.
      Did you provide params for a validator that don't need them?`);
    }

    return finalFunction;
  }

}
