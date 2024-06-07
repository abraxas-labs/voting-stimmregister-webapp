/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Inject, OnInit } from "@angular/core";
import { VersionColumn } from "./version-column";
import { TableDataSource } from "@abraxas/base-components";
import { FilterDefinition } from "../../../models/filter/filterDefinition";
import { FilterVersion } from "../../../models/filter/filterVersion";
import { Router } from "@angular/router";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-filter-version-popup',
  templateUrl: './filter-version-popup.component.html',
  styleUrls: ['./filter-version-popup.component.scss']
})
export class FilterVersionPopupComponent implements OnInit {

  private filter!: FilterDefinition;

  public columns = VersionColumn;
  public columnsToDisplay: string[] = [
    VersionColumn.name,
    VersionColumn.created,
    VersionColumn.creator,
    VersionColumn.deadline,
    VersionColumn.count
  ];
  public datasource = new TableDataSource<FilterVersion>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private readonly router: Router,
    private dialogRef: MatDialogRef<FilterVersionPopupComponent>) {
    this.filter = data.filter;
  }

  ngOnInit(): void {
    this.datasource.data = this.filter.versions;
  }

  public async openVersion(row: FilterVersion): Promise<void> {
    await this.router.navigate(['-', 'filters', this.filter.id, 'version', row.id]);
    this.dialogRef.close();
  }
}
