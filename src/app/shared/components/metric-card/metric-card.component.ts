import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'metric-card',
  templateUrl: './metric-card.component.html',
  styleUrls: ['./metric-card.component.scss']
})
export class MetricCardComponent {

  @Input() public value: string;
  @Input() public label: string;
  @Input() public icon: string;

  constructor() {}
}
