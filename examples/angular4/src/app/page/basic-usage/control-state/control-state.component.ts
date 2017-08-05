import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core'
import {FormControl} from '@angular/forms'

@Component({
  selector: 'control-state',
  templateUrl: './control-state.component.html',
  styles: [`
    ul {
      list-style: none;
      margin-bottom:0;
    }
  `]
})
export class ControlStateComponent implements OnChanges, OnInit {

  @Input()
  control: FormControl;

  @Input()
  errorColor = 'danger';

  ngOnChanges(changes: SimpleChanges): void {

    console.log(changes);

    if ('errorColor' in changes) {
      this.errorColor = changes.errorColor.currentValue || 'danger'
    }
  }

  ngOnInit() {

  }

  getErrors(): any[] {
    return Object.keys(this.control.errors)
      .map((key) => {
        return {
          name: key,
          value: this.control.errors[key]
        }
      })
  }

}
