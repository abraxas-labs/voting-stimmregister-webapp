/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, EventEmitter, Output, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-popup',
  templateUrl: './delete-popup.component.html',
  styleUrls: ['./delete-popup.component.scss'],
  standalone: false,
})
export class DeletePopupComponent {
  public readonly data = inject(MAT_DIALOG_DATA);

  public isLoading: boolean = false;

  @Output() public delete: EventEmitter<any> = new EventEmitter();
}
