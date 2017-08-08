import {Component, DebugElement, ViewChild} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AbstractControl, FormControl, FormGroup} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {AlternativeValidationDirective} from './alternative-validation.directive';
import {AlternativeValidationModule} from './index';
import {IAlternativeValidationConfig} from './struct/alternative-validation-config';
import {ValidationCollectorService} from './validation-collector.service';

@Component({
  template: `
    <form [formGroup]="fg">
      <input type="text" value="" [formControlName]="'target1'" id="target1"
        [alternativeValidation]="config">
    </form>
  `
})
class TestComponent {
  fg: FormGroup = new FormGroup({
    'target1': new FormControl(''),
  });
  config: IAlternativeValidationConfig = {
    validator: [
      {name: 'required'},
      {name: 'minLength', params: [3]}
    ]
  };

  @ViewChild(AlternativeValidationDirective)
  exposedTarget1;
}

describe('AlternativeValidationDirective', () => {

  let hostComponents: TestComponent;
  let alternativeControl: any;
  let fixture: ComponentFixture<TestComponent>;
  let el: DebugElement;

  let target1Input: DebugElement;
  let target1InputControl: AbstractControl;

  function setInputValue(inputElem: DebugElement, value) {
    inputElem.nativeElement.value = value;
    inputElem.triggerEventHandler('input', {target: {value: value}});
    fixture.detectChanges();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AlternativeValidationModule.forRoot()
      ],
      declarations: [
        TestComponent
      ],
      providers: [
        ValidationCollectorService
      ]
    });
    fixture = TestBed.createComponent(TestComponent);
    hostComponents = fixture.componentInstance;
    el = fixture.debugElement;

    target1Input = el.query(By.css('#target1'));
    target1InputControl = hostComponents.fg.get('target1');
    alternativeControl = hostComponents.exposedTarget1.control;
  });

  it('should create an instance', () => {
    fixture.detectChanges();
    alternativeControl = hostComponents.exposedTarget1.control;
    expect(hostComponents).toBeTruthy();
    expect(target1Input).toBeTruthy();
    expect(target1InputControl).toBeTruthy();
  });

  it('should be accessable over @ViewChild', () => {
    fixture.detectChanges();
    alternativeControl = hostComponents.exposedTarget1.control;
    expect(alternativeControl).toBeTruthy();
    expect(alternativeControl.valid).toBe(false);
  });


  it('should stay valid if input changes', () => {
    fixture.detectChanges();
    alternativeControl = hostComponents.exposedTarget1.control;
    expect(target1InputControl.value).toBe('');
    expect(target1InputControl.valid).toBe(true);

    setInputValue(target1Input, '12');
    expect(target1InputControl.value).toBe('12');
    expect(target1InputControl.valid).toBe(true);

    setInputValue(target1Input, '123');
    expect(target1InputControl.value).toBe('123');
    expect(target1InputControl.valid).toBe(true);
  });

  it('should change state of alternative validation when input changes', () => {
    fixture.detectChanges();
    alternativeControl = hostComponents.exposedTarget1.control;

    expect(target1InputControl.value).toBe('');
    expect(alternativeControl.value).toBe('');
    expect(target1InputControl.valid).toBe(true);
    expect(alternativeControl.valid).toBe(false);
    expect(alternativeControl.hasError('required')).toBe(true);
    expect(alternativeControl.hasError('minlength')).toBe(false);

    setInputValue(target1Input, '12');
    expect(target1InputControl.value).toBe('12');
    expect(alternativeControl.value).toBe('12');

    expect(target1InputControl.valid).toBe(true);
    expect(alternativeControl.valid).toBe(false);
    expect(alternativeControl.hasError('required')).toBe(false);
    expect(alternativeControl.hasError('minlength')).toBe(true);

    setInputValue(target1Input, '123');
    expect(alternativeControl.value).toBe('123');
    expect(target1InputControl.valid).toBe(true);
    expect(alternativeControl.valid).toBe(true);
    expect(alternativeControl.hasError('required')).toBe(false);
    expect(alternativeControl.hasError('minlength')).toBe(false);
  });

  it('should track focus', () => {
    fixture.detectChanges();
    alternativeControl = hostComponents.exposedTarget1.control;
    target1Input.triggerEventHandler('focus', {});
    expect(hostComponents.exposedTarget1.focus).toBe(true);

    target1Input.triggerEventHandler('blur', {});
    expect(hostComponents.exposedTarget1.focus).toBe(false);

  });

  it('should be able to set disabled state', () => {
    fixture.detectChanges();

    hostComponents.exposedTarget1.setDisabledState(true);
    expect(target1Input.properties.disabled).toBe(true);

    hostComponents.exposedTarget1.setDisabledState(false);
    expect(target1Input.properties.disabled).toBe(false);
  });

  it('should be able to reset', () => {
    fixture.detectChanges();
    target1InputControl.setValue('test');
    expect(target1InputControl.value).toBe('test');
    expect(hostComponents.exposedTarget1.value).toBe('test');

    target1InputControl.reset();
    expect(target1InputControl.value).toBeFalsy();
    expect(hostComponents.exposedTarget1.value).toBeFalsy();
  });

  it('should be able to get the status', () => {
    fixture.detectChanges();

    expect(hostComponents.exposedTarget1.status).toBe('INVALID');

    setInputValue(target1Input, '123');
    expect(hostComponents.exposedTarget1.status).toBe('VALID');
  });

  it('should listen on reset events', () => {
    fixture.detectChanges();

    setInputValue(target1Input, '123');
    expect(hostComponents.exposedTarget1.status).toBe('VALID');

    hostComponents.exposedTarget1.reset();
    expect(hostComponents.exposedTarget1.status).toBe('INVALID');
  });

  it('should react to composition events', () => {
    target1Input.triggerEventHandler('compositionstart', {});
    target1Input.triggerEventHandler('compositionend', {target: {value: 'composition events'}});
  });

});
