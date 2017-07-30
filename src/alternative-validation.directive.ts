import {
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core'
import {FormControl, NG_VALUE_ACCESSOR, ValidationErrors} from '@angular/forms'
import {IAlternativeValidationConfig} from './struct/alternative-validation-config'
import {ValidationCollectorService} from './validation-collector.service'

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
export class AlternativeValidationDirective implements OnChanges, OnInit {

  @Input()
  alternativeValidation: IAlternativeValidationConfig;

  // Container component reference
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

  onTouch: Function;
  onModelChange: Function;

  constructor(
    private _elementRef: ElementRef,
    private vs: ValidationCollectorService
  ) {
    this.updateValidations();
  }

  registerOnTouched(fn) {
    this.onTouch = fn;
  }

  registerOnChange(fn) {
    this.onModelChange = fn;
  }

  ngOnChanges(chamges: SimpleChanges) {
    this.updateValidations();
  }

  ngOnInit(): void {
    this.inputElement = this.getInputElementRef();
    this.updateValidations();
  }

  // Parser: View to Model
  @HostListener('input', ['$event'])
  onControlInput($event: KeyboardEvent) {
    this.updateFakeValue(this.inputElement.value);
    this.onModelChange(this.inputElement.value);
    this.onTouch();
    this.updateFakeTouch(true);
  }

  // Formatter: Model to View
  writeValue(rawValue: any): void {
    this.updateFakeValue(rawValue);
  }

  @HostListener('blur', ['$event'])
  onBlur() {
    this.onTouch();
    this.updateFakeTouch(true);
  }

  updateFakeTouch(state: boolean) {
    this.touched = state;
    this.untouched = !this.touched;
  }

  updateFakeValue(value): void {

    if (!this.alternativeValidation) {
      return;
    }

    this.formControl.setValue(value);

    this.invalid = this.formControl.invalid;
    this.valid = this.formControl.valid;
    this.status = this.formControl.status;
    this.dirty = this.formControl.dirty;
    this.pending = this.formControl.pending;
    this.pristine = this.formControl.pristine;
    this.errors = this.formControl.errors;

  }

  updateValidations(): void {

    if (!this.alternativeValidation) {
      return;
    }

    const validationFunctions = this.vs.getValidators(this.alternativeValidation.validator);
    const asyncValidationFunctions = this.vs.getAsyncValidators(this.alternativeValidation.asyncValidator);

    this.formControl = new FormControl('', validationFunctions, asyncValidationFunctions);
    this.updateFakeTouch(false);
    this.updateFakeValue('');
  }

  hasError(errorCode: string, path?: string[]): boolean {
    return this.formControl ? this.formControl.hasError(errorCode, path) : false;
  }

  getError(errorCode: string, path?: string[]): any {
    return this.formControl ? this.formControl.getError(errorCode, path) : null;
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
