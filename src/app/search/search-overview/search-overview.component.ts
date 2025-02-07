/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, OnInit } from '@angular/core';
import { buildSearchDefaultCriteria } from '../../models/filter/filterCriteria';
import { PersonService } from '../../services/person.service';
import { PersonSearchParameters, PersonSearchType } from '../../models/person/personSearchParameters';

@Component({
  selector: 'app-search',
  templateUrl: './search-overview.component.html',
  styleUrls: ['./search-overview.component.scss'],
})
export class SearchOverviewComponent implements OnInit {
  public readonly searchTypePerson = PersonSearchType.Person;

  public params?: PersonSearchParameters;

  constructor(public readonly personService: PersonService) {}

  public async ngOnInit(): Promise<void> {
    this.params = await this.personService.getLastUsedParameters(this.searchTypePerson);
    if (this.params.criteria.length === 0) {
      this.resetCriteria();
    }
  }

  public resetCriteria(): void {
    if (this.params === undefined) {
      return;
    }

    this.params.criteria = buildSearchDefaultCriteria();
  }
}
