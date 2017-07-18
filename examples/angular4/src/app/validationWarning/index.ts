import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ValidationService } from './validation.service';

export * from './validator-warning.directive';
export * from './validation.service';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    declarations: [],
    exports: [ ReactiveFormsModule]
})
export class ValidationWarningModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ValidationWarningModule,
            providers: [
                ValidationService
            ]
        };
    }
}
