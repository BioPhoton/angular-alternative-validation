import {Component, DebugElement} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AbstractControl, FormControl, FormGroup} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {IAlternativeValidationConfig} from './struct/alternative-validation-config';
import {AlternativeValidationModule} from './index';
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
      {name: 'toUpperCase'}
    ],
    asyncValidator: []
  };
}

describe('AlternativeValidationDirective', () => {

  let component: TestComponent;
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
    component = fixture.componentInstance;
    el = fixture.debugElement;

    target1Input = el.query(By.css('#both'));
    target1InputControl = component.fg.get('both');
  });

  it('should stay valid if input changes', () => {
    fixture.detectChanges();
    expect(target1InputControl.value).toBe('');
    expect(target1InputControl.valid).toBe(true);
    setInputValue(target1Input, '12');
    expect(target1InputControl.value).toBe('12');
    expect(target1InputControl.valid).toBe(true);
  });

});
