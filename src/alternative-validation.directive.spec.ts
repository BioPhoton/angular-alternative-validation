import {Component, DebugElement, ViewChild} from '@angular/core'
import {ComponentFixture, TestBed} from '@angular/core/testing'
import {AbstractControl, FormControl, FormGroup} from '@angular/forms'
import {By} from '@angular/platform-browser'
import {AlternativeValidationDirective} from './alternative-validation.directive'
import {AlternativeValidationModule} from './index'
import {IAlternativeValidationConfig} from './struct/alternative-validation-config'
import {ValidationCollectorService} from './validation-collector.service'

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
    ],
    asyncValidator: []
  };

  @ViewChild(AlternativeValidationDirective)
  exposedTarget1
}

describe('AlternativeValidationDirective', () => {

  let directive: TestComponent;
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
    directive = fixture.componentInstance;
    el = fixture.debugElement;

    target1Input = el.query(By.css('#target1'));
    target1InputControl = directive.fg.get('target1');
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
    expect(target1Input).toBeTruthy();
    expect(target1InputControl).toBeTruthy();
  });

  it('should stay valid if input changes', () => {
    fixture.detectChanges();
    expect(target1InputControl.value).toBe('');
    expect(target1InputControl.valid).toBe(true);
    setInputValue(target1Input, '12');
    expect(target1InputControl.value).toBe('128');
    expect(target1InputControl.valid).toBe(true);
  });

  it('should stay changes state of alternative validation', () => {
    fixture.detectChanges();

    // initial state
    expect(target1InputControl.value).toBe('');
    expect(directive.exposedTarget1.hasError('required')).toBe(true);
    expect(directive.exposedTarget1.hasError('minlength')).toBe(false);
    expect(directive.exposedTarget1.valid).toBe(false);

    // first validation
    setInputValue(target1Input, '12');
    expect(target1InputControl.value).toBe('12');
    expect(directive.exposedTarget1.hasError('required')).toBe(false);
    expect(directive.exposedTarget1.hasError('minlength')).toBe(true);
    expect(directive.exposedTarget1.valid).toBe(false);

    // second validation
    setInputValue(target1Input, '123');
    expect(target1InputControl.value).toBe('123');
    expect(directive.exposedTarget1.hasError('required')).toBe(false);
    expect(directive.exposedTarget1.hasError('minlength')).toBe(false);
    expect(directive.exposedTarget1.valid).toBe(true);
  });

});
