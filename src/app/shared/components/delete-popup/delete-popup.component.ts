/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-popup',
  templateUrl: './delete-popup.component.html',
  styleUrls: ['./delete-popup.component.scss'],
})
export class DeletePopupComponent {
  public isLoading: boolean = false;

  @Output() public delete: EventEmitter<any> = new EventEmitter();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
