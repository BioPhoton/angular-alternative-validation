import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import {validName} from './custom-validators/name.validator'
import {NG_VALIDATORS} from '@angular/forms'

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    {provide: NG_VALIDATORS, useValue: validName, multi: true}
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    console.log('CoreModlue: ', parentModule);
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }

}
