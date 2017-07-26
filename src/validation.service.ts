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
export class ValidationService {

  constructor(
    @Optional() @Inject(NG_VALIDATORS) private NG_VALIDATORS: ValidatorFn[],
    @Optional() @Inject(NG_ASYNC_VALIDATORS) private NG_ASYNC_VALIDATORS: AsyncValidatorFn[]
  ) {}

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
      throw new Error('No validation name gives to search for');
    }
    const validatorFn = Validators[validatorName] || this.getCustomValidatorFn(validatorName);

    if (!(typeof validatorFn === 'function')) {
      throw new Error(`validator "${validatorName}" is not provided via NG_VALIDATORS`);
    }

    return (validatorArgs) ? validatorFn(...validatorArgs) : validatorFn;
  }

  getCustomValidatorFn(validatorName: string): ValidatorFn | undefined {
    let validatorFn;

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

    if (this.NG_ASYNC_VALIDATORS) {

      asyncValidatorFn = this.NG_ASYNC_VALIDATORS.find(
        (aFn) => {
          return validatorName === aFn.name;
        });
    }

    if (!(typeof asyncValidatorFn === 'function')) {
      throw new Error(`validator "${validatorName}" is not provided via NG_ASYNC_VALIDATORS`);
    }

    return (validatorArgs) ? asyncValidatorFn(validatorArgs) : asyncValidatorFn;
  }

}
