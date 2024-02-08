/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input } from "@angular/core";
import { AccessRole } from "../../../models/accessRole";
import { ImportStatistic } from "../../../models/data/importStatistic.model";

@Component({
  selector: 'app-data-import-details',
  templateUrl: './data-import-details.component.html',
  styleUrls: ['./data-import-details.component.scss']
})
export class DataImportDetailsComponent {
  @Input()
  public statistic!: ImportStatistic;
  public readonly roles: typeof AccessRole = AccessRole;  
}
