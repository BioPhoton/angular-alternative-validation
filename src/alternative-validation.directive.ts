import {
  Directive,
  ElementRef,
  forwardRef,
  Host,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
  SimpleChanges,
  SkipSelf
} from '@angular/core';
import {
  AbstractControl,
  AbstractControlDirective,
  COMPOSITION_BUFFER_MODE,
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import {ɵgetDOM as getDOM} from '@angular/platform-browser';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/takeUntil';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {IAlternativeValidationConfig} from './struct/alternative-validation-config';
import {ValidationCollectorService} from './validation-collector.service';

/**
 * We must check whether the agent is Android because composition events
 * behave differently between iOS and Android.
 */
function isAndroid(): boolean {
  const userAgent = getDOM() ? getDOM().getUserAgent() : '';
  return /android (\d+)/.test(userAgent.toLowerCase());
}

const CONTROL_VALUE_ACCESSOR = {
  name: 'alternativeValidationValueAccessor',
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AlternativeValidationDirective),
  multi: true
};

@Directive({
  selector: '[alternativeValidation]',
  providers: [CONTROL_VALUE_ACCESSOR],
  host: {
    /*
     * Listening to the native input event of the host element.
     * On input we call the take the value property of the target element end call
     * the handleInput function with it. This renders the new value to the view.
     */
    '(input)': 'handleInput($event.target.value)',
    /*
     * Listening to the native focus event of the host element.
     * On focus we call the internal haldleFocus function
     */
    '(focus)': 'handleFocus(true)',
    /*
     * Listening to the native blur event of the host element.
     * On blur we call the onTouched function from the formControl
     */
    '(blur)': 'handleFocus(false)',
    /*
     * The compositionstart event is fired when the composition of a passage of text is prepared
     * (similar to keydown for a keyboard input, but fires with special characters that require
     * a sequence of keys and other inputs such as speech recognition or word suggestion on mobile).
     */
    '(compositionstart)': 'compositionStart()',
    /*
     * The compositionend event is fired when the composition of a passage of text has been completed
     * or cancelled
     * (fires with special characters that require a sequence of keys and other inputs such as
     * speech recognition or word suggestion on mobile).
     */
    '(compositionend)': 'compositionEnd($event.target.value)'
  },
  exportAs: 'alternativeValidation'
})
export class AlternativeValidationDirective extends AbstractControlDirective implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {

  // Reference to the fake formControl
  control: AbstractControl;

  // Reference to the formControl
  realFormControl: AbstractControl;

  @Input()
  // The formControlName in the parent
  protected formControlName: string;

  // The internal data model
  private _value: any = '';

  // The internal focus state
  private _focus = false;

  // The internal disabled state
  private _disabled: boolean;

  destroy$ = new Subject<boolean>();


  // The internal state of composing input
  protected composing = false;

  @Input('alternativeValidation')
  // The config for the alternative validation in the parent
  protected config: IAlternativeValidationConfig;

  private onChange: Function = () => {};
  private onTouched: Function = () => {};

  constructor(
    protected renderer: Renderer2, protected elementRef: ElementRef,
    @Optional() @Inject(COMPOSITION_BUFFER_MODE) protected compositionMode: boolean,
    @Optional() @Host() @SkipSelf() private parentFormContainer: ControlContainer,
    protected vs: ValidationCollectorService
  ) {
    super();
    if (this.compositionMode == null) {
      this.compositionMode = !isAndroid();
    }
  }

  get focus(): boolean {
    return this._focus;
  }

  set focus(value: boolean) {
    this._focus = value;
  }

  /*
   * Handel formControl model changes
   */
  writeValue(value: any): void {
    this.renderViewValue(value);
  }

  /*
   * Registers the controls onChange function
   */
  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  /*
   * Registers the controls onTouched function
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /*
   * Sets the internal disabled state and renders it to the view
   */
  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
    this.renderViewDisabled(isDisabled);
  }

  /*
   * Depending on the compositionMode and the composing state it
   * calls writeValueFromViewToModel with new value
   */
  private handleInput(value: any): void {
    if (!this.compositionMode || (this.compositionMode && !this.composing)) {
      this.writeValueFromViewToModel(value);
    }
  }

  /*
   * Sets the internal focus state and renders it to the view
   * It also calls onTouch if a blur happens
   */
  private handleFocus(isFocus: boolean): void {
    this.focus = isFocus;
    if (!isFocus) {
      this.onTouched();
      this.updateFakeTouched(this.realFormControl.touched);
    }
    this.renderViewFocus(isFocus);
  }

  /*
   * Is called when the compositionStart event is fired.
   * It sets the internal composing state to true
   */
  private compositionStart(): void {
    this.composing = true;
  }

  /*
   * Is called when the compositionEnd event is fired
   * It sets the internal composing state to false
   * and triggers the onChange function with the new value.
   */
  private compositionEnd(value: any): void {
    this.composing = false;
    if (this.compositionMode) {
      this.onChange(value);
    }
  }

  // Directive lifecycle hooks ==================================================================

  ngOnChanges(changes: SimpleChanges) {
    this.updateValidators();
  }

  ngOnInit(): void {
    this.updateFormControlRef();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  // ControlValueAccessor ==================================================================

  protected writeValueFromViewToModel(value: any) {
    if (value !== this._value) {
      this._value = value;
      this.onChange(value);
      this.updateFakeValue(value);
    }
  }

  protected renderViewValue(value: any) {
    const normalizedValue = value == null ? '' : value;
    this.renderer.setProperty(this.getInputElementRef(), 'value', normalizedValue);
  }

  protected renderViewDisabled(isDisabled: boolean) {
    this.renderer.setProperty(this.getInputElementRef(), 'disabled', isDisabled);
  }

  protected renderViewFocus(isFocus: boolean): void {
    this.renderer.setProperty(this.getInputElementRef(), 'focus', isFocus);
  }

  // get a safe ref to the input element
  private getInputElementRef(): HTMLInputElement {
    let input: HTMLInputElement;
    if (this.elementRef.nativeElement.tagName === 'INPUT') {
      // directive is used directly on an input element
      input = this.elementRef.nativeElement;
    } else {
      // directive is used on an abstracted input element, `ion-input`, `md-input`, etc
      input = this.elementRef.nativeElement.getElementsByTagName('INPUT')[0];
    }

    if (!input) {
      throw new Error('You can applied the "alternativeValidation" directive only on inputs or elements containing inputs');
    }

    return input;
  }

  // FormControl ==================================================================

  private updateFormControlRef() {
    this.realFormControl = this.parentFormContainer['form'].controls[this.formControlName];

    this.updateFakeControlRef(this.realFormControl.value);
    this.setupResetObservable(this.realFormControl);
    this.setupDisabledObservable(this.realFormControl);
  }

  /*
   * custom implementation of status getter
   * */
  get status(): string {
    return this.control ? this.control.status : null;
  }

  // Reset handling ==============================================================================

  private setupResetObservable(control: AbstractControl): void {
    Observable.combineLatest(control.statusChanges, control.valueChanges)
      .takeUntil(this.destroy$.asObservable())
      .filter(() => {
        const resetState = {
          dirty: false,
          pristine: true,
          touched: false,
          untouched: true
        };

        return Object
          .keys(resetState)
          .reduce((state, item) => {
            return !state ? false : control[item] === resetState[item];
          }, true);
      })
      .subscribe((controlState) => {
        this.onResetEvent();
      });
  }

  private setupDisabledObservable(control: AbstractControl): void {
    Observable.combineLatest(control.statusChanges, control.valueChanges)
      .takeUntil(this.destroy$.asObservable())
      .map(() => {
        const disabledState = {
          valid: false,
          invalid: false,
          status: 'DISABLED'
        };

        return Object
          .keys(disabledState)
          .reduce((state, item) => {
            return !state ? false : control[item] === disabledState[item];
          }, true);
      })
      .subscribe((isDisabled) => {
        this.onDisableEvent(isDisabled);
      });
  }

  // Alternative validation ==============================================================================

  private onResetEvent() {
    this.control.reset(this.realFormControl.value);
  }

  private onDisableEvent(isDisabled: boolean) {
    if (!isDisabled) {
      this.control.enable();
    } else {
      this.control.disable();
    }
  }

  private updateFakeControlRef(formState: any): void {
    this.control = new FormControl();
    this.updateValidators();
    this.control.reset(formState);
  }

  private updateValidators(): void {
    if (this.config && this.control && this.control instanceof AbstractControl) {
      if ('validator' in this.config && Array.isArray(this.config.validator)) {
        this.control.setValidators(this.vs.getValidators(this.config.validator));
      }
      if ('asyncValidator' in this.config && Array.isArray(this.config.asyncValidator)) {
        this.control.setValidators(this.vs.getAsyncValidators(this.config.asyncValidator));
      }
    }
  }

  private updateFakeValue(value): void {
    if (this.control) {
      this.control.setValue(value);
      this.control.updateValueAndValidity(value);
      this.updateFakeDirty(true);
    }
  }

  private updateFakeTouched(isTouched: boolean): void {
    if (isTouched) {
      this.control.markAsTouched();
    } else {
      this.control.markAsUntouched();
    }
  }

  private updateFakeDirty(isDirty: boolean): void {
    if (isDirty) {
      this.control.markAsDirty();
    } else {
      this.control.markAsPristine();
    }
  }

}
