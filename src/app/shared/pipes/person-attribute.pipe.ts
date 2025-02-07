/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Pipe, PipeTransform } from '@angular/core';
import { Person } from '../../models/person/person';
import { PersonAttributeEnum } from '../../models/person/personAttributeEnum';
import { TranslateService } from '@ngx-translate/core';
import { LocalDatePipe } from './localDate.pipe';
import { SocialSecurityNumberPipe } from './social-security-number.pipe';
import { Sex } from '../../models/person/sex';

@Pipe({
  name: 'personAttribute',
})
export class PersonAttributePipe implements PipeTransform {
  constructor(
    private readonly datePipe: LocalDatePipe,
    private readonly socialSecurityNumberPipe: SocialSecurityNumberPipe,
    private readonly i18n: TranslateService
  ) {}

  public transform(person: Person, attr: PersonAttributeEnum): string | null {
    const value = person[attr];
    if (value === undefined) {
      return null;
    }

    if (attr === PersonAttributeEnum.sex) {
      return person.sex === undefined ? null : Sex[person.sex];
    }

    if (value instanceof Date) {
      return this.datePipe.transform(value);
    }

    if (typeof value === 'number') {
      return '' + value;
    }

    if (typeof value === 'boolean') {
      return this.i18n.instant('boolean.' + value);
    }

    switch (attr) {
      case PersonAttributeEnum.vn:
        return this.socialSecurityNumberPipe.transform(value);
      case PersonAttributeEnum.religion:
        return this.i18n.instant('religions.' + person[attr]);
    }

    return value;
  }
}
