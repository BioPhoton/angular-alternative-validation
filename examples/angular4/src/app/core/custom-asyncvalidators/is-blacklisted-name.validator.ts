import {AbstractControl, ValidationErrors} from '@angular/forms'

import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/debounceTime'
import 'rxjs/add/operator/distinctUntilChanged'
import 'rxjs/add/operator/delay'
import 'rxjs/add/operator/first'

export function isBlacklistedName(c: AbstractControl): Observable<ValidationErrors | null> {

  const validatorName = 'isBlacklistedName';

  const routValidation$ = new Observable(observer => {

    if (c.value && typeof c.value === 'string' &&
      'abcde'.indexOf(c.value.toString().toLowerCase()) !== -1) {
      observer.next({
        [this.validationName]: {
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
