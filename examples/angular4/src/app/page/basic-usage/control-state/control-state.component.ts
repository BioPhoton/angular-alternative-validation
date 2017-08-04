import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms'

@Component({
  selector: 'control-state',
  templateUrl: './control-state.component.html'
})
export class ControlStateComponent implements OnInit {

  @Input()
  control: FormControl;

  constructor() { }

  ngOnInit() {

  }

}
