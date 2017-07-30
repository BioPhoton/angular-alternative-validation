import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core'
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms'
import {IAlternativeValidationConfig} from 'angular-alternative-validation/struct/alternative-validation-config'
import {AlternativeValidationDirective} from 'angular-alternative-validation'

@Component({
  selector: 'basic-usage',
  templateUrl: './basic-usage.component.html',
  styleUrls: ['./basic-usage.component.scss']
})
export class BasicUsageComponent implements OnInit, AfterViewInit {


  basicFormGroup: FormGroup;
  nameInput: FormControl

  avNameConfig: IAlternativeValidationConfig;

  @ViewChild(AlternativeValidationDirective)
  ref

  constructor(private fb: FormBuilder) {
    this.basicFormGroup = this.fb.group(
      {
        name: ['', Validators.minLength(3)]
      }
    );

    this.avNameConfig = {
      validator: [
        {name: 'validName'}
      ]
    };

  }

  ngOnInit() {
    this.nameInput = this.basicFormGroup.get('name') as FormControl
  }

  ngAfterViewInit() {
    console.log('Reference to the directive', this.ref);
  }

}
