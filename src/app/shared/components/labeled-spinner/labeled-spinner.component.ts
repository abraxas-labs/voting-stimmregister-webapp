/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input } from "@angular/core";

@Component({
  selector: 'app-labeled-spinner',
  templateUrl: './labeled-spinner.component.html',
  styleUrls: ['./labeled-spinner.component.scss']
})
export class LabeledSpinnerComponent {
  @Input()
  public label: string = 'shared.loading';
}
