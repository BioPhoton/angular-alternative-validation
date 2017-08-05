# angular-alternative-validation

#### Angular Alternative Validation - The smoothest way to implement validation hints/warnings for your forms

![License](https://img.shields.io/npm/l/angular-alternative-validation.svg)
[![NPM Version](https://img.shields.io/npm/v/angular-alternative-validation.svg)](https://www.npmjs.com/package/angular-alternative-validation)
[![Build Status](https://travis-ci.org/BioPhoton/angular-alternative-validation.svg?branch=master)](https://travis-ci.org/BioPhoton/angular-alternative-validation)
[![Coverage Status](https://coveralls.io/repos/github/BioPhoton/angular-alternative-validation/badge.svg?branch=master)](https://coveralls.io/github/BioPhoton/angular-alternative-validation?branch=master)

## Demo

- [x] [angular4 demo with ng-cli](https://github.com/BioPhoton/angular-alternative-validation/tree/master/examples/angular4)  
- [x] [plunkr demo](https://embed.plnkr.co/e3GOAFENPumfy78IWXAw/)


![Angular-Alternative-Validation](https://raw.githubusercontent.com/BioPhoton/angular-alternative-validation/master/resources/demo.gif)

## Quick code example:
``` typescript
// app.component.ts
...
import { IAlternativeValidationConfig } from 'angular-alternative-validation/struct/alternative-validation-config';

@Component({
  selector: 'app-basic-usage',
  template: `<input type="text"
                    formControlName="name" 
                    [alternativeValidation]="{validator: ['required']}"
                    #aV="alternativeValidation">
                    
              {{fg.get('name').valid}} vs {{aV.valid}}`
})
export class BasicUsageComponent {
...
}

```


## Basic Usage:

#### Implement Library

``` bash
$ npm install angular-alternative-validation --save
```

``` typescript
// app.module.ts
...
// IMPORT YOUR LIBRARY
import { AlternativeValidationModule } from 'angular-alternative-validation';

@NgModule({
  imports: [
    ...
    AlternativeValidationModule.forRoot();
  ]
  ...
})
export class AppModule { }

```

#### Create alternative validation config object

``` typescript
// app.component.ts
...
import { IAlternativeValidationConfig } from 'angular-alternative-validation/struct/alternative-validation-config';

@Component({
  selector: 'app-basic-usage',
  template: `
  <form [formGroup]="formGroup">
    <input type="text" formControlName="name" [alternativeValidation]="aVConfig">
    Value: {{formGroup.get('name').value}} , Valid: {{formGroup.get('name').valid}}
  </form>
  `
})
export class BasicUsageComponent {

  aVConfig: IAlternativeValidationConfig = {
     validator: [ 
      {name: 'required'},
      {name: 'minLength', params: [3] }
     ]
  }

  formGroup: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.basicFormGroup = this.fb.group({ name: [] });
  }

}

```

#### Template reference to the directive

``` html
// app.component.html
... 
  <input type="text" formControlName="name" [alternativeValidation]="aVConfig" #aV="alternativeValidation">
  {{aV.errors | json}} {{aV.valid}}
```

#### A Reference to the directive in the class

``` typescript
// app.component.ts
... 
@ViewChild(AlternativeValidationDirective)
alternativeValidationRef
...
ngAfterViewInit() {
    console.log('Directive referenc: ', this.alternativeValidationRef);
  }
...
```

## Use custom validations

#### Create custom function

``` typescript
// app.module.ts
export function myValidation(param1, param2): ValidatorFn {
   
}

...
@NgModule({
  ...
  providers: [
    { provide: NG_VALIDATION, useValue: myValidation, multi: true }
  ]
  ...
})
export class AppModule {

}

```

#### Use custom transform function in config object

``` typescript
// app.component.ts
...
export class BasicUsageComponent {

  fPConfig: IAlternativeValidationConfig = {
    alternativeValidation:[
     { name: 'myValidation', params: [param1, param2] }
    ]
  }

}

```

# What it is

There are many ways to build a alternative validation state.  
Many of them can't reuse existing validators and all of them do not provide a separate state of validation.  

What this library do is it provides an alternative state of the host control.  
You can use it like the normal form control validation  
but it is not effecting the actual validation of the form.  

It's a mix of `FormControlName`, `AbstractControlDirective`, `ControlValueAccessor`, `NG_VALIDATORS` and a little bit of `magic-glue$`.

In this way you can:   
- reuse default validators and async validators
- treat the alternative control stated independent from the real one that effects formGroup and formControl states
- display user hints/information separated from the error messages
- use other libraries working with formControl logic

# License

MIT © [Michael Hladky](mailto:michael@hladky.at)

Copyright 2017 [Michael Hladky](mailto:michael@hladky.at). All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at [angular-alternative-validation](https://github.com/BioPhoton/angular-alternative-validation/blob/master/LICENSE.txt)
