import {Inject, Injectable, Optional} from "@angular/core";
import {AsyncValidatorFn, NG_ASYNC_VALIDATORS, NG_VALIDATORS, ValidatorFn, Validators} from "@angular/forms";
@Injectable()
export class ValidationService {

  constructor(@Optional() @Inject(NG_VALIDATORS) private NG_VALIDATORS: ValidatorFn[],
              @Optional() @Inject(NG_ASYNC_VALIDATORS) private NG_ASYNC_VALIDATORS: AsyncValidatorFn[],) {
  }

  getValidators(validatorsConfig: any): ValidatorFn[] {
    let validators: any[] = [];

    if (validatorsConfig) {
      // @TODO type this!!!!
      validators = validatorsConfig.map((validatorObj: any) => {
        return this.getValidatorFn(validatorObj.name, validatorObj.params)
      })
    }
    return validators;
  }

  getValidatorFn(validatorName: string, validatorArgs?: any): ValidatorFn {
    if (!validatorName) {
      // @TODO throw
      return;
    }
    let validatorFn = Validators[validatorName] || this.getCustomValidatorFn(validatorName);

    if (!(typeof validatorFn === "function")) {
      throw new Error(`validator "${validatorName}" is not provided via NG_VALIDATORS`);
    }

    return (validatorArgs) ? validatorFn(...validatorArgs) : validatorFn;
  }

  getCustomValidatorFn(validatorName: string): ValidatorFn | undefined {
    let validatorFn;

    if (this.NG_VALIDATORS) {
      validatorFn = this.NG_VALIDATORS.find((validatorFn) => {
        return validatorName === validatorFn.name
      });
    }

    return validatorFn;
  }

  getAsyncValidators(config: any): AsyncValidatorFn[] {
    let asyncValidators: any[] = [];

    if (config) {
      asyncValidators = config.map((validatorObj: any) => {
        return this.getCustomAsyncValidatorFn(validatorObj.name, validatorObj.params)
      })
    }
    return asyncValidators;
  }

  getCustomAsyncValidatorFn(validatorName: string, validatorArgs?: any): any {
    let asyncValidatorFn;

    if (this.NG_ASYNC_VALIDATORS) {

      asyncValidatorFn = this.NG_ASYNC_VALIDATORS.find(
        (asyncValidatorFn) => {
          return validatorName === asyncValidatorFn.name
        });
    }

    if (!(typeof asyncValidatorFn === "function")) {
      throw new Error(`validator "${validatorName}" is not provided via NG_ASYNC_VALIDATORS`);
    }

    return (validatorArgs) ? asyncValidatorFn(validatorArgs) : asyncValidatorFn;
  }

}
