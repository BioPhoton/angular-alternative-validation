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
import {
  ControlContainer,
  FormControl,
  NG_VALUE_ACCESSOR,
  ValidationErrors
} from '@angular/forms';
import {IAlternativeValidationConfig} from './struct/alternative-validation-config';
import {ValidationService} from './validation.service';

const CONTROL_VALUE_ACCESSOR = {
  name: 'alternativeValidationValueAccessor',
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AlternativeValidationDirective),
  multi: true
};

@Directive({
  selector: '[alternativeValidation]',
  providers: [
    CONTROL_VALUE_ACCESSOR
  ],
  exportAs: 'alternativeValidation'
})
export class AlternativeValidationDirective implements OnInit {

  @Input('alternativeValidation')
  config: IAlternativeValidationConfig;

  @Input()
  formControlName: string;
  // Container component reference
  private realFormControl: FormControl;
  private formControl: FormControl;

  // html input reference
  private inputElement: HTMLInputElement;

  invalid: boolean;
  valid: boolean;
  status: string;
  dirty: boolean;
  pending: boolean;
  pristine: boolean;
  touched: boolean;
  untouched: boolean;
  errors: ValidationErrors | null;

  private onTouch: Function;
  private onModelChange: Function;

  constructor(
    private _elementRef: ElementRef,
    private vs: ValidationService,
    @Optional() @Host() @SkipSelf() private fcd: ControlContainer
  ) {
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
    this.onTouch();
    this.onModelChange(rawValue);
    this.updateFakeControl(rawValue);
  }

  // Formatter: Model to View
  writeValue(rawValue: any): void {
    this.updateFakeControl(rawValue);
    this.onTouch();
    this.onModelChange(rawValue);
  }

  updateFakeControl(value): void {

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
    this.errors = this.formControl.errors;

  }

  updateValidations(): void {

    if (!this.config) {
      return;
    }

    const validationFunctions = this.vs.getValidators(this.config.validator);
    const asyncValidationFunctions = this.vs.getAsyncValidators(this.config.asyncValidator);
    this.formControl = new FormControl(this.realFormControl.value, validationFunctions, asyncValidationFunctions);
    this.updateFakeControl(this.realFormControl.value);
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
      throw new Error('You can applied the "alternativeValidation" directive only on inputs or elements containing inputs');
    }

    return input;
  }

}
