/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-loading-button',
  templateUrl: './loading-button.component.html',
  styleUrls: ['./loading-button.component.scss']
})
export class LoadingButtonComponent {
  @Input()
  public loading = false;

  @Input()
  public disabled = false;

  @Input()
  public label = '';

  @Input()
  public color: 'primary' | 'basic' | 'error' = 'primary';

  @Input()
  public variant: 'primary' | 'secondary' | 'tertiary' = 'primary';

  @Input()
  public type: 'button' | 'submit' | 'reset' = 'button';

  @Output()
  public clicked = new EventEmitter<void>();
}
