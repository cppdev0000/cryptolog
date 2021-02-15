import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner-button',
  templateUrl: './spinner-button.component.html',
  styleUrls: ['./spinner-button.component.css']
})
export class SpinnerButtonComponent {
  @Input('type') type: string;
  @Input('text') text: string;
  @Input('spinning') spinning: boolean = false;
  @Input('disabled') disabled: boolean;

  constructor() { }
}
