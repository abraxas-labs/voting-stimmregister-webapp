/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {PaginatorIntl} from "@abraxas/base-components";
import {Injectable, OnDestroy} from "@angular/core";
import {Subject, takeUntil} from "rxjs";
import {TranslateService} from "@ngx-translate/core";

@Injectable()
export class TranslatedPaginatorIntl extends PaginatorIntl
  implements OnDestroy {
  unsubscribe: Subject<void> = new Subject<void>();
  OF_LABEL = 'of';

  constructor(private translate: TranslateService) {
    super();

    this.translate.onLangChange.pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.getAndInitTranslations();
      });

    this.getAndInitTranslations();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getAndInitTranslations() {
    this.translate
      .get([
        'misc.paginator.ITEMS_PER_PAGE',
        'misc.paginator.NEXT_PAGE',
        'misc.paginator.PREVIOUS_PAGE',
        'misc.paginator.FIRST_PAGE',
        'misc.paginator.LAST_PAGE',
        'misc.paginator.OF_LABEL',
      ]).pipe(takeUntil(this.unsubscribe))
      .subscribe(translation => {
        this.itemsPerPageLabel =
          translation['misc.paginator.ITEMS_PER_PAGE'];
        this.nextPageLabel = translation['misc.paginator.NEXT_PAGE'];
        this.previousPageLabel =
          translation['misc.paginator.PREVIOUS_PAGE'];
        this.lastPageLabel = translation['misc.paginator.LAST_PAGE']
        this.firstPageLabel = translation['misc.paginator.FIRST_PAGE']
        this.OF_LABEL = translation['misc.paginator.OF_LABEL'];
        this.changes.next();
      });
  }

  getRangeLabel = (
    page: number,
    pageSize: number,
    length: number,
  ) => {
    if (length === 0 || pageSize === 0) {
      return '';
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} ${
      this.OF_LABEL
    } ${length}`;
  };
}
