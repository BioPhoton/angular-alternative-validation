# angular-alternative-validation

#### Angular Alternative Validation - detection validation error without changing the valid state of your control. Use it to display validation hints or warnings.

![License](https://img.shields.io/npm/l/angular-alternative-validation.svg)
[![NPM Version](https://img.shields.io/npm/v/angular-alternative-validation.svg)](https://www.npmjs.com/package/angular-alternative-validation)
[![Build Status](https://travis-ci.org/BioPhoton/angular-alternative-validation.svg?branch=master)](https://travis-ci.org/BioPhoton/angular-alternative-validation)
[![Coverage Status](https://coveralls.io/repos/github/BioPhoton/angular-alternative-validation/badge.svg?branch=master)](https://coveralls.io/github/BioPhoton/angular-alternative-validation?branch=master)

## Demo

- [x] [angular4 demo with ng-cli](https://github.com/BioPhoton/angular-alternative-validation/tree/master/examples/angular4)
- [] [plunkr demo]()


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
  templateUrl: './basic-usage.component.html'
})
export class BasicUsageComponent {

  aVConfig: IAlternativeValidationConfig = {
     validator: [ 
      {name: 'required'},
      {name: 'minLength', params: [3] }
     ]
  }

  constructor() { }

}

```

#### Create FormGroup

``` typescript
// app.component.ts

...
export class BasicUsageComponent {

  aVConfig: IAlternativeValidationConfig = {
    ...
  }

  formGroup: FormGroup;

  constructor(private fb: FormBuilder) {
    this.basicFormGroup = this.fb.group({ name: [] });
  }

}
```


#### Set formGroup and formControlName when using the alternativeValidation directive

``` html
// app.component.html
<form [formGroup]="formGroup">
  <input type="text" formControlName="name" [alternativeValidation]="aVConfig">
  {{formGroup.get('name').value}}
</form>
```


#### Expose the directive API in the template

``` html
// app.component.html
... 
  <input type="text" formControlName="name" [alternativeValidation]="aVConfig" #aV="alternativeValidation">
  {{aV.errors | json}} {{aV.valid}}
```

#### Expose the directive API in the class

``` typescript
// app.component.ts
... 
@ViewChild  
...
```

## Use custom validations

#### Create custom function

``` typescript

export function myValidation(c:FormControl): ValidatorFn {
   
}

```

#### Provide the function over the NG_VALIDATION token

``` typescript
// app.module.ts

...
// IMPORT NG_VALIDATION
import { NG_VALIDATION, FormatterParserModule } from 'angular-alternative-validation';
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


# License

MIT © [Michael Hladky](mailto:michael@hladky.at)

Copyright 2017 [Michael Hladky](mailto:michael@hladky.at). All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at [angular-alternative-validation](https://github.com/BioPhoton/angular-alternative-validation/blob/master/LICENSE.txt)
