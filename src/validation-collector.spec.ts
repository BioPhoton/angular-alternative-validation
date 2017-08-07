import {inject, TestBed} from '@angular/core/testing';
import {
  AbstractControl,
  FormControl,
  NG_ASYNC_VALIDATORS,
  NG_VALIDATORS,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/first';

import {Observable} from 'rxjs/Observable';
import {IValidatorConfig} from './struct/validator-config';
import {ValidationCollectorService} from './validation-collector.service';

export function isBlacklistedName(c: AbstractControl): Observable<ValidationErrors | null> {

  const validatorName = 'isBlacklistedName';
  const routValidation$ = new Observable(observer => {

    if (c.value && typeof c.value === 'string' &&
      'abcde'.indexOf(c.value.toString().toLowerCase()) !== -1) {
      observer.next({
        [validatorName]: {
          actual: c.value,
          mandatoryChars: 'abcde'
        }
      });
    } else {
      observer.next(null);
    }
  });

  return routValidation$.debounceTime(500).distinctUntilChanged().delay(2000).first();
}

export function validName(c: AbstractControl): ValidationErrors | null {
  const validNames = ['Aretha', 'Ella', 'Etta', 'Nina'];

  const isValid = validNames
    .map(n => c.value && c.value.indexOf(n) !== -1)
    .filter(v => v)
    .reduce((prev, curr) => true, false);

  if (!isValid) {
    return {
      validName: {
        validNames
      }
    };
  }

  return null;
}


describe('ValidationCollectorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ValidationCollectorService,
        {provide: NG_VALIDATORS, useValue: validName, multi: true},
        {provide: NG_ASYNC_VALIDATORS, useValue: isBlacklistedName, multi: true}
      ]
    });
  });


  it('should be created', inject([ValidationCollectorService], (service: ValidationCollectorService) => {
    expect(service).toBeTruthy();
  }));

  describe('getCustomValidatorFn', () => {

    it('should throw if we pass in no validator name', inject([ValidationCollectorService], (service: ValidationCollectorService) => {
      const functionName = undefined;
      expect(() => {
        service.getCustomValidatorFn(functionName);
      }).toThrow(new Error('No validation name given to search for'));
    }));

    it('should return the function if we request a custom existing function',
      inject([ValidationCollectorService], (service: ValidationCollectorService) => {
        const validNameError = {
          validName: {
            validNames: ['Aretha', 'Ella', 'Etta', 'Nina']
          }
        };
        const customValidatorFunction = service.getCustomValidatorFn('validName');
        expect(typeof customValidatorFunction).toBe('function');
        const fc: FormControl = new FormControl('');
        expect(customValidatorFunction(fc).validName).toEqual(validNameError.validName);

        fc.setValue('Ella');
        expect(customValidatorFunction(fc)).toEqual(null);
      }));

  });

  describe('getValidatorFn', () => {

    it('should throw if we pass in no validator name', inject([ValidationCollectorService], (service: ValidationCollectorService) => {
      const functionName = undefined;
      expect(() => {
        service.getValidatorFn(functionName);
      }).toThrow(new Error('No validation name given to search for'));
    }));

    it('should throw if we request a not existing validator',
      inject([ValidationCollectorService], (service: ValidationCollectorService) => {
        const functionName = 'notExistingFunction';
        expect(() => {
          service.getValidatorFn(functionName);
        }).toThrow(new Error(`Validator "${functionName}" is not provided via NG_VALIDATORS`));
      }));

    it('should throw if we pass in params for a validator with no params',
      inject([ValidationCollectorService], (service: ValidationCollectorService) => {
        const functionName = 'required';
        expect(() => {
          service.getValidatorFn(functionName, ['some', 'params']);
        }).toThrow(new Error(`Validator "${functionName}" is not provided a function.
      Did you provide params for a validator that don't need them?`));
      }));

    it('should be able to get the built in validator',
      inject([ValidationCollectorService], (service: ValidationCollectorService) => {
        const buildInValidatorNames: string[] = [
          'required',
          'minLength',
          'maxLength',
          'min',
          'max',
          'pattern',
          'email',
          'nullValidator',
          'requiredTrue'
        ];
        for (let i = 0; i < buildInValidatorNames.length; i++) {
          const func: ValidatorFn = service.getValidatorFn(buildInValidatorNames[i]);
          expect(typeof func).toBe('function');
        }
      }));

    it('Built in validator without params should work',
      inject([ValidationCollectorService], (service: ValidationCollectorService) => {
        const requiredError = {required: true};
        const func: ValidatorFn = service.getValidatorFn('required');
        const fc: FormControl = new FormControl('');
        expect(func(fc)).toEqual(requiredError);
        fc.setValue('42');
        expect(func(fc)).toEqual(null);
      }));

    it('built in validator with params should work',
      inject([ValidationCollectorService], (service: ValidationCollectorService) => {
        const minlengthError = {
          minLength: {
            requiredLength: 3,
            actualLength: 2
          }
        };
        const func: ValidatorFn = service.getValidatorFn('minLength', [3]);

        const fc: FormControl = new FormControl('');
        expect(func(fc)).toEqual(null);

        fc.setValue('42');
        expect(func(fc).minlength).toEqual(minlengthError.minLength);

        fc.setValue('108');
        expect(func(fc)).toEqual(null);
      }));

    it('should return the function if we request a custom existing function',
      inject([ValidationCollectorService], (service: ValidationCollectorService) => {
        const validNameError = {
          validName: {
            validNames: ['Aretha', 'Ella', 'Etta', 'Nina']
          }
        };
        const customValidatorFunction = service.getValidatorFn('validName');
        expect(typeof customValidatorFunction).toBe('function');
        const fc: FormControl = new FormControl('');
        expect(customValidatorFunction(fc).validName).toEqual(validNameError.validName);

        fc.setValue('Ella');
        expect(customValidatorFunction(fc)).toEqual(null);
      }));

  });

  describe('getValidators', () => {

    it('should throw if we pass in no validator name', inject([ValidationCollectorService], (service: ValidationCollectorService) => {
      const config = [{name: undefined}];
      expect(() => {
        service.getValidators(config);
      }).toThrow(new Error('No validation name given to search for'));
    }));

    it('should throw if we request a not existing validator ',
      inject([ValidationCollectorService], (service: ValidationCollectorService) => {
        const functionName = 'notExistingFunction';
        expect(() => {
          service.getValidatorFn(functionName);
        }).toThrow(new Error(`Validator "${functionName}" is not provided via NG_VALIDATORS`));
      }));

    it('should throw if we pass in params for a validator with no params',
      inject([ValidationCollectorService], (service: ValidationCollectorService) => {
        const config: IValidatorConfig[] = [
          {name: 'required', params: ['some', 'params']}
        ];

        expect(() => {
          service.getValidators(config);
        }).toThrow(new Error(`Validator "${config[0].name}" is not provided a function.
      Did you provide params for a validator that don't need them?`));
      }));

    it('should be able to get the built in validator',
      inject([ValidationCollectorService], (service: ValidationCollectorService) => {
        const buildInValidatorConfig: IValidatorConfig[] = [
          {name: 'required'},
          {name: 'minLength', params: [3]},
          {name: 'maxLength', params: [3]},
          {name: 'min', params: [3]},
          {name: 'max', params: [3]},
          {name: 'pattern', params: [/[a-z]/g]},
          {name: 'email'},
          {name: 'nullValidator'},
          {name: 'requiredTrue'}
        ];

        const funcs: ValidatorFn[] = service.getValidators(buildInValidatorConfig);
        expect(typeof funcs).toBe('object');
        expect(funcs.length).toBe(9);

      }));

    it('built in validator without params should work',
      inject([ValidationCollectorService], (service: ValidationCollectorService) => {
        const config: IValidatorConfig[] = [{name: 'required'}];
        const requiredError = {required: true};
        const funcs: ValidatorFn[] = service.getValidators(config);
        expect(typeof funcs).toBe('object');
        expect(funcs.length).toBe(1);

        const fc: FormControl = new FormControl('');
        expect(funcs[0](fc)).toEqual(requiredError);
        fc.setValue('42');
        expect(funcs[0](fc)).toEqual(null);
      }));

    it('built in validator with params should work',
      inject([ValidationCollectorService], (service: ValidationCollectorService) => {
        const config: IValidatorConfig[] = [{name: 'minLength', params: [3]}];
        const minlengthError = {
          minLength: {
            requiredLength: 3,
            actualLength: 2
          }
        };
        const funcs: ValidatorFn[] = service.getValidators(config);
        expect(typeof funcs).toBe('object');
        expect(funcs.length).toBe(1);

        const fc: FormControl = new FormControl('');
        expect(funcs[0](fc)).toEqual(null);

        fc.setValue('42');
        expect(funcs[0](fc).minlength).toEqual(minlengthError.minLength);

        fc.setValue('108');
        expect(funcs[0](fc)).toEqual(null);
      }));

    it('should return the function if we request a custom existing function',
      inject([ValidationCollectorService], (service: ValidationCollectorService) => {
        const config: IValidatorConfig[] = [{name: 'validName'}];
        const customValidatorFunctions = service.getValidators(config);
        expect(typeof customValidatorFunctions).toBe('object');
        expect(customValidatorFunctions.length).toBe(1);
      }));

    it('custom validator without params should work',
      inject([ValidationCollectorService], (service: ValidationCollectorService) => {
        const config: IValidatorConfig[] = [{name: 'validName'}];
        const validNameError = {
          validName: {
            validNames: ['Aretha', 'Ella', 'Etta', 'Nina']
          }
        };
        const customValidatorFunctions = service.getValidators(config);

        const fc: FormControl = new FormControl('');
        expect(customValidatorFunctions[0](fc).validName).toEqual(validNameError.validName);

        fc.setValue('Nina');
        expect(customValidatorFunctions[0](fc)).toEqual(null);
      }));

    xit('custom validator with params should work', () => {

    });

  });

  describe('getCustomAsyncValidatorFn', () => {

    it('should throw if we pass in no asyncvalidator name',
      inject([ValidationCollectorService], (service: ValidationCollectorService) => {
        const functionName = undefined;
        expect(() => {
          service.getCustomAsyncValidatorFn(functionName);
        }).toThrow(new Error('No asyncvalidation name given to search for'));
      }));

    it('should throw if we request a not existing asyncvalidator',
      inject([ValidationCollectorService], (service: ValidationCollectorService) => {
        const functionName = 'notExistingFunction';
        expect(() => {
          service.getCustomAsyncValidatorFn(functionName);
        }).toThrow(new Error(`Asyncvalidator "${functionName}" is not provided via NG_ASYNC_VALIDATORS`));
      }));

    it('should throw if we pass in params for a asyncvalidator with no params',
      inject([ValidationCollectorService], (service: ValidationCollectorService) => {
        const functionName = 'isBlacklistedName';
        expect(() => {
          service.getCustomAsyncValidatorFn(functionName, ['some', 'params']);
        }).toThrow(new Error(`Asyncvalidator "${functionName}" is not provided a function.
      Did you provide params for a validator that don't need them?`));
      }));

    it('custom async validator without params should work',
      inject([ValidationCollectorService], (service: ValidationCollectorService) => {
        const isBlacklistedNameError = {
          isBlacklistedName: {
            actual: 'wxy',
            mandatoryChars: 'abcde'
          }
        };
        const func: ValidatorFn = service.getCustomAsyncValidatorFn('isBlacklistedName');

        const fc: FormControl = new FormControl('');
        func(fc).subscribe((n) => {
          expect(n).toEqual(null);
        });

        fc.setValue('wxy');
        func(fc).subscribe((n) => {
          expect(n.isBlacklistedName).toEqual(isBlacklistedNameError.isBlacklistedName);
        });

        fc.setValue('b');
        func(fc).subscribe((n) => {
          expect(n).toEqual(null);
        });
      }));

    xit('custom async validator with params should work', () => {

    });

  });

  describe('getAsyncValidators', () => {

    it('should throw if we pass in no asyncvalidator name', inject([ValidationCollectorService], (service: ValidationCollectorService) => {
      const config = [{name: undefined}];
      expect(() => {
        service.getAsyncValidators(config);
      }).toThrow(new Error('No asyncvalidation name given to search for'));
    }));

    it('should throw if we request a not existing validator ',
      inject([ValidationCollectorService], (service: ValidationCollectorService) => {
        const config = [{name: 'notExistingFunction'}];
        expect(() => {
          service.getAsyncValidators(config);
        }).toThrow(new Error(`Asyncvalidator "${config[0].name}" is not provided via NG_ASYNC_VALIDATORS`));
      }));

    it('should throw if we pass in params for a validator with no params',
      inject([ValidationCollectorService], (service: ValidationCollectorService) => {
        const config: IValidatorConfig[] = [
          {name: 'isBlacklistedName', params: ['some', 'params']}
        ];

        expect(() => {
          service.getAsyncValidators(config);
        }).toThrow(new Error(`Asyncvalidator "${config[0].name}" is not provided a function.
      Did you provide params for a validator that don't need them?`));
      }));

    it('should return the function if we request a custom existing asyncvalidator',
      inject([ValidationCollectorService], (service: ValidationCollectorService) => {
        const config: IValidatorConfig[] = [{name: 'isBlacklistedName'}];
        const customAsyncValidatorFunctions = service.getAsyncValidators(config);
        expect(typeof customAsyncValidatorFunctions).toBe('object');
        expect(customAsyncValidatorFunctions.length).toBe(1);
      }));

    it('custom asyncvalidator without params should work',
      inject([ValidationCollectorService], (service: ValidationCollectorService) => {
        const config: IValidatorConfig[] = [{name: 'isBlacklistedName'}];
        const isBlacklistedNameError = {
          isBlacklistedName: {
            actual: '',
            mandatoryChars: 'abcde'
          }
        };
        const customAsyncValidatorFunctions: any[] = service.getAsyncValidators(config);

        const fc: FormControl = new FormControl('');
        customAsyncValidatorFunctions[0](fc).subscribe((n) => {
          expect(n.isBlacklistedName).toEqual(isBlacklistedNameError.isBlacklistedName);
        });

        fc.setValue('cd');
        customAsyncValidatorFunctions[0](fc).subscribe((n) => {
          expect(n).toEqual(null);
        });

      })
    );

    xit('custom asyncvalidator with params should work', () => {

    });

  })
  ;

})
;
