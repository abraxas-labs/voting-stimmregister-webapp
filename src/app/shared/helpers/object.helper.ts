/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { FormGroup } from '@angular/forms';

export class ObjectHelper {
  public static clone(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
  }

  public static touchFormGroup(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
      form.get(key)?.markAsTouched();
    });
  }
}
