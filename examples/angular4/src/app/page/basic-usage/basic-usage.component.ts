import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms'
import {AlternativeValidationDirective} from 'angular-alternative-validation'
import {IAlternativeValidationConfig} from 'angular-alternative-validation/struct/alternative-validation-config'

@Component({
  selector: 'basic-usage',
  templateUrl: './basic-usage.component.html',
  styleUrls: ['./basic-usage.component.scss']
})
export class BasicUsageComponent implements OnInit, AfterViewInit {


  basicFormGroup: FormGroup;
  nativeInput: FormControl;
  basicInput: FormControl;
  cfnInput: FormControl;
  altInput: FormControl;
  avNameConfig: IAlternativeValidationConfig;

  @ViewChild(AlternativeValidationDirective)
  ref

  constructor(private fb: FormBuilder) {
    this.basicFormGroup = this.fb.group(
      {
        native: ['initial', Validators.required],
        alt: ['initial', Validators.minLength(3)]
      }
    );

    this.avNameConfig = {
      validator: [
        {name: 'validName'}
      ]
    };
  }

  ngOnInit() {
    this.nativeInput = this.basicFormGroup.get('native') as FormControl
    this.basicInput = this.basicFormGroup.get('basic') as FormControl
    this.cfnInput = this.basicFormGroup.get('cfn') as FormControl
    this.altInput = this.basicFormGroup.get('alt') as FormControl
  }

  ngAfterViewInit() {
    console.log('Reference to the directive', this.ref);
  }

  getControlFeedbackName(formControl: AbstractControl, altControl: AbstractControl): string {
    if (formControl.invalid) {
      return 'danger';
    } else if (altControl.invalid) {
      return 'warning';
    } else {
      return 'success';
    }
  }

  resetWithValue(value) {
    this.basicFormGroup.reset({
      native: 'reset',
      basic: 'reset',
      cfn: 'reset',
      alt: 'reset'
    })
  }

}
