import {
    Directive,
    ElementRef,
    forwardRef,
    Host,
    HostListener,
    Input,
    OnInit,
    Optional,
    SkipSelf
} from '@angular/core';
import { ControlContainer, FormControl, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';
import { ValidationService } from './validation.service';
import { IValidatorConfig } from './struct/validator-config';

const CONTROL_VALUE_ACCESSOR = {
    name: 'validationWarningValueAccessor',
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ValidatorWarningDirective),
    multi: true
};

@Directive({
    selector: '[validatorWarning]',
    providers: [
        CONTROL_VALUE_ACCESSOR
    ],
    exportAs: 'validatorWarning'
})
export class ValidatorWarningDirective implements OnInit {

    @Input('validatorWarning')
    config: IValidatorConfig;

    @Input()
    formControlName: string;
    // Container component reference
    private realFormControl: FormControl;
    formControl: FormControl;

    // html input reference
    private inputElement: HTMLInputElement;

    // START plucked properties for more native usage
    //
    invalid;
    valid;
    status;
    dirty;
    pending;
    pristine;
    touched;
    untouched;
    // END plucked properties

    private _warnings: ValidationErrors = {};
    get warnings(): ValidationErrors {
        return this._warnings;
    }

    set warnings(value: ValidationErrors) {
        this._warnings = value;
    }


    private onTouch: Function;
    private onModelChange: Function;

    constructor(private _elementRef: ElementRef,
                private vs: ValidationService,
                @Optional() @Host() @SkipSelf() private fcd: ControlContainer) {
    }

    registerOnTouched(fn) {
        this.onTouch = fn;
    }

    registerOnChange(fn) {
        this.onModelChange = fn;
    }

    ngOnInit(): void {
        this.realFormControl = (<any>this.fcd).form.controls[this.formControlName];
        this.inputElement = this.getInputElementRef();
        this.updateValidations();
    }

    // Parser: View to Model
    @HostListener('input', ['$event'])
    onControlInput($event: KeyboardEvent) {
        const rawValue: any = this.inputElement.value;

        // If there is a onTouch function registered
        if (this.onTouch) {
            this.onTouch();
        }

        this.updateWarnings(rawValue);

        // If there is a onModelChange function registered
        if (this.onModelChange) {
            this.onModelChange(rawValue);
        }
    }


    // Formatter: Model to View
    writeValue(rawValue: any): void {

        // If there is a onTouch function registered
        if (this.onTouch) {
            this.onTouch();
        }

        this.updateWarnings(rawValue);

        // If there is a onModelChange function registered
        if (this.onModelChange) {
            this.onModelChange(rawValue);
        }

    }

    // fetch formatter and parser form config and update props
    updateWarnings(value): void {

        if (!this.config || !this.realFormControl) {
            return;
        }

        this.formControl.setValue(value);

        this.invalid = this.formControl.invalid;
        this.valid = this.formControl.valid;
        this.status = this.formControl.status;
        this.dirty = this.formControl.dirty;
        this.pending = this.formControl.pending;
        this.pristine = this.formControl.pristine;
        this.touched = this.formControl.touched;
        this.untouched = this.formControl.untouched;
        this.warnings = this.formControl.errors;

    }


    // fetch formatter and parser form config and update props
    updateValidations(): void {

        if (!this.config) {
            return;
        }

        const validationFunctions = this.vs.getValidators(this.config.validatorWarning);
        const asyncValidationFunctions = this.vs.getAsyncValidators(this.config.asyncValidatorWarning);
        this.formControl = new FormControl(this.realFormControl.value, validationFunctions, asyncValidationFunctions);
        this.updateWarnings(this.realFormControl.value);
    }

    // get a safe ref to the input element
    private getInputElementRef(): HTMLInputElement {
        let input: HTMLInputElement;
        if (this._elementRef.nativeElement.tagName === 'INPUT') {
            // directive is used directly on an input element
            input = this._elementRef.nativeElement;
        } else {
            // directive is used on an abstracted input element, `ion-input`, `md-input`, etc
            input = this._elementRef.nativeElement.getElementsByTagName('INPUT')[0];
        }

        if (!input) {
            throw new Error('You can applied the "validatorWarning" directive only on inputs or elements containing inputs');
        }

        return input;
    }

}
