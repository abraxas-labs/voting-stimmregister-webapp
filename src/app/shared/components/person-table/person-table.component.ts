/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { Person } from '../../../models/person/person';
import { PageEvent } from '@abraxas/base-components';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonColumn } from './person-column';
import { PersonService } from '../../../services/person.service';
import { BehaviorSubject } from 'rxjs';
import { FilterCriteria } from '../../../models/filter/filterCriteria';
import { PersonSearchType } from '../../../models/person/personSearchParameters';

@Component({
  selector: 'app-person-table',
  templateUrl: './person-table.component.html',
  styleUrls: ['./person-table.component.scss'],
  standalone: false,
})
export class PersonTableComponent implements OnChanges {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly personService = inject(PersonService);

  @Input()
  public searchType: PersonSearchType = PersonSearchType.Person;

  @Input()
  public filterVersionId?: string;

  @Input()
  public criteria?: FilterCriteria[];

  @Input()
  public pageIndex: number = 0;

  @Input()
  public pageSize: number = 20;

  @Output()
  public pageIndexChange: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  public pageSizeChange: EventEmitter<number> = new EventEmitter<number>();

  public loading: boolean = true;
  public columns = PersonColumn;
  public columnsToDisplay: string[] = [
    PersonColumn.actuality,
    PersonColumn.officialName,
    PersonColumn.firstName,
    PersonColumn.dateOfBirth,
    PersonColumn.street,
    PersonColumn.houseNumber,
    PersonColumn.zipCode,
    PersonColumn.town,
    PersonColumn.countryNameShort,
    PersonColumn.locality,
    PersonColumn.residence,
    PersonColumn.source,
    PersonColumn.isVotingAllowed,
  ];

  public totalCount: number = 0;
  public invalidCount: number = 0;
  public datasource = new BehaviorSubject<Person[]>([]);

  private lastLoadedPageIndex: number = 0;
  private lastLoadedPageSize: number = 0;

  public async openDetailView(registerId: string): Promise<void> {
    await this.router.navigate(['person', registerId], { relativeTo: this.route });
  }

  public async ngOnChanges(changes: SimpleChanges): Promise<void> {
    // do not load people if the pageIndex/size is the only input that changed
    // and it is equal to the last loaded page index/size
    // this can happen if a page is selected and there is also a binding
    // on the pageIndex/size.
    // the setter cannot be used to trigger the people load,
    // since then it would always trigger twice (once for page index and once for criteria)
    const pageIndexChangedButSameValue =
      changes['pageIndex'] !== undefined && changes['pageIndex'].currentValue === this.lastLoadedPageIndex;
    const pageSizeChangedButSameValue =
      changes['pageSize'] !== undefined && changes['pageSize'].currentValue === this.lastLoadedPageSize;
    const pageChangesButSameValues =
      (pageIndexChangedButSameValue ? 1 : 0) + (pageSizeChangedButSameValue ? 1 : 0);
    if (Object.keys(changes).length === pageChangesButSameValues) {
      return;
    }

    await this.loadPeople();
  }

  public async selectPage(page: PageEvent): Promise<void> {
    this.lastLoadedPageIndex = this.pageIndex = page.pageIndex;
    this.lastLoadedPageSize = this.pageSize = page.pageSize;
    this.pageIndexChange.next(page.pageIndex);
    this.pageSizeChange.next(page.pageSize);
    await this.loadPeople();
  }

  private async loadPeople(): Promise<void> {
    this.lastLoadedPageIndex = this.pageIndex;
    this.loading = true;
    try {
      const { people, totalCount, invalidPersonsCount } = !!this.filterVersionId
        ? await this.personService.getByFilterVersionId(this.filterVersionId, this.pageIndex, this.pageSize)
        : await this.personService.getAll({
            searchType: this.searchType,
            criteria: this.criteria ?? [],
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
          });

      this.datasource.next(people);
      this.totalCount = totalCount;
      this.invalidCount = invalidPersonsCount;
    } finally {
      this.loading = false;
    }
  }
}
