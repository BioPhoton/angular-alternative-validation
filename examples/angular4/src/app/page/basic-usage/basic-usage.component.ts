import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IValidatorWarningConfig } from '../../validatorWarning/struct/validator-warning-config';

@Component({
  selector: 'app-basic-usage',
  templateUrl: './basic-usage.component.html',
  styleUrls: ['./basic-usage.component.scss'],
})
export class BasicUsageComponent implements OnInit {

  basicFormGroup: FormGroup;

  vWNameConfig: IValidatorWarningConfig;

  constructor(private fb: FormBuilder) {
    this.basicFormGroup = this.fb.group(
      {
        longName: []
      }
      );

    this.vWNameConfig = {
      validatorWarning: [ {name: "minlength", params: [3]} ],
      asyncValidatorWarning: []
    }

  }

  ngOnInit() {

  }

}
