/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'socialSecurityNumber',
  standalone: false,
})
export class SocialSecurityNumberPipe implements PipeTransform {
  public transform(ahv: string): string {
    if (ahv.length !== 13) {
      return ahv;
    }

    return (
      ahv.substring(0, 3) +
      '.' +
      ahv.substring(3, 7) +
      '.' +
      ahv.substring(7, 11) +
      '.' +
      ahv.substring(11, 13)
    );
  }
}
