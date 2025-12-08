/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input } from '@angular/core';
import { FilterCriteria } from '../../../models/filter/filterCriteria';

@Component({
  selector: 'app-filter-criteria',
  templateUrl: './filter-criteria.component.html',
  styleUrls: ['./filter-criteria.component.scss'],
  standalone: false,
})
export class FilterCriteriaComponent {
  @Input()
  public criteria!: FilterCriteria;
}
