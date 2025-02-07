/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input } from '@angular/core';

// A fixed space loading bar component which
// always uses the same height, no matter
// whether loading or not.
// This prevents UI flickering.
@Component({
  selector: 'app-fixed-space-loading-bar',
  templateUrl: './fixed-space-loading-bar.component.html',
  styleUrls: ['./fixed-space-loading-bar.component.scss'],
})
export class FixedSpaceLoadingBarComponent {
  @Input()
  public loading: boolean = true;
}
