import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

import {AlternativeValidationDirective} from './alternative-validation.directive';
import {ValidationCollectorService} from './validation-collector.service';

export * from './alternative-validation.directive';
export * from './validation-collector.service';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [AlternativeValidationDirective],
  exports: [AlternativeValidationDirective, ReactiveFormsModule]
})
export class AlternativeValidationModule {

  static forRoot() {
    return {
      ngModule: AlternativeValidationModule,
      providers: [ValidationCollectorService]
    };
  }
}
