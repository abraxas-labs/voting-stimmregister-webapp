/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { AbstractControl, FormControl, FormGroup, FormArray } from '@angular/forms';

export class FormHelpers {
  public static markAllControlsAsDirty(abstractControls: AbstractControl[]): void {
    abstractControls.forEach((abstractControl) => {
      if (abstractControl instanceof FormControl) {
        abstractControl.markAsDirty({ onlySelf: true });
      } else if (abstractControl instanceof FormGroup) {
        this.markAllControlsAsDirty(Object.values(abstractControl.controls));
      } else if (abstractControl instanceof FormArray) {
        this.markAllControlsAsDirty(abstractControl.controls);
      }
    });
  }
}
