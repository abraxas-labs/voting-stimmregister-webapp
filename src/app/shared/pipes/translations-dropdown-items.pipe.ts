/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Pipe, PipeTransform } from '@angular/core';
import { DropdownItem } from '@abraxas/base-components';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'translationsDropdownItems',
})
export class TranslationsDropdownItemsPipe implements PipeTransform {
  constructor(private readonly i18n: TranslateService) {}

  public transform(i18nGroup: string): DropdownItem[] {
    const items = this.i18n.instant(i18nGroup) as Record<string, string>;
    return Object.entries(items).map(([id, displayValue]) => ({ id, displayValue }));
  }
}
