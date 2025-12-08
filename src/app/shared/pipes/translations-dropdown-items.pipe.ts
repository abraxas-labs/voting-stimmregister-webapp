/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Pipe, PipeTransform, inject } from '@angular/core';
import { DropdownItem } from '@abraxas/base-components';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'translationsDropdownItems',
  standalone: false,
})
export class TranslationsDropdownItemsPipe implements PipeTransform {
  private readonly i18n = inject(TranslateService);

  public transform(i18nGroup: string): DropdownItem[] {
    const items = this.i18n.instant(i18nGroup) as Record<string, string>;
    return Object.entries(items).map(([id, displayValue]) => ({ id, displayValue }));
  }
}
