import {AbstractControl, ValidationErrors} from '@angular/forms'

export function validName(c: AbstractControl): ValidationErrors | null {
  const validNames = ['Neil', 'Ella', 'Frank', 'Nina'];

  const isValid = validNames
    .map(n => c.value && c.value.indexOf(n) !== -1)
    .filter(v => v)
    .reduce((prev, curr) => true, false);

  if (!isValid) {
    return {
      validName: {
        valid: true,
        validNames
      }
    }
  }

  return null
}

