/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { inject, Pipe, PipeTransform } from '@angular/core';
import { PersonAttributeEnum } from '../../models/person/personAttributeEnum';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'validationErrorMessage',
  standalone: false,
})
export class ValidationErrorMessagePipe implements PipeTransform {
  private readonly i18n = inject(TranslateService);

  public transform(message: string, personAttributeProperty: string): string {
    const personAttribute = Object.values(PersonAttributeEnum).filter(
      (value) => value.toUpperCase() == personAttributeProperty.toUpperCase()
    );

    if (personAttribute.length !== 1) {
      return message;
    } else {
      const translatedPersonAttribute = this.i18n.instant('person.attribute-label.' + personAttribute[0]);
      return `${translatedPersonAttribute}: ${message}`;
    }
  }
}
