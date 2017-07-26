import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ValidationService } from './validation.service';

export * from './alternative-validation.directive';
export * from './validation.service';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    declarations: [],
    exports: [ ReactiveFormsModule]
})
export class AlternativeValidationModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AlternativeValidationModule,
            providers: [
                ValidationService
            ]
        };
    }
}
