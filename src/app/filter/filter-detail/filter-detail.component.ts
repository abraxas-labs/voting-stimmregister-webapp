/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FilterService } from "../../services/filter.service";
import { FilterDefinition } from "../../models/filter/filterDefinition";
import { FilterVersionPopupComponent } from "../popups/filter-version-popup/filter-version-popup.component";
import { ActivatedRoute, Router } from "@angular/router";
import {
  HandleVersionPopupComponent,
  HandleVersionPopupData
} from "../popups/handle-version-popup/handle-version-popup.component";
import { DeletePopupComponent } from "../../shared/components/delete-popup/delete-popup.component";
import { LocalDatePipe } from "../../shared/pipes/localDate.pipe";
import { ExportPopupComponent, ExportPopupData } from "../popups/export-popup/export-popup.component";
import { FilterVersion } from "../../models/filter/filterVersion";
import { FilterCriteria } from "../../models/filter/filterCriteria";
import { Subscription } from "rxjs";
import { RoleService } from "../../services/role.service";
import { TranslateService } from "@ngx-translate/core";
import { ToastService } from "../../services/toast.service";
import { PersonSearchType } from "../../models/person/personSearchParameters";
import { PersonTableComponent } from "../../shared/components/person-table/person-table.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-filter-detail',
  templateUrl: './filter-detail.component.html',
  styleUrls: ['./filter-detail.component.scss']
})
export class FilterDetailComponent implements OnInit, OnDestroy {

  public readonly searchTypeFilter = PersonSearchType.Filter;

  public isManager: boolean = false;
  public isExporter: boolean = false;
  public isNewest: boolean = true;
  public filter!: FilterDefinition;
  public version?: FilterVersion;
  public criteria: FilterCriteria[] = [];
  public backLink: string = '';

  @ViewChild(PersonTableComponent)
  public personTable?: PersonTableComponent;

  private readonly routerSubscription: Subscription;

  constructor(
    private readonly filterService: FilterService,
    private readonly dialog: MatDialog,
    private readonly roleService: RoleService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly toast: ToastService,
    private readonly translate: TranslateService,
    private readonly localDate: LocalDatePipe) {
    this.routerSubscription = this.route.paramMap.subscribe(p => this.loadData(p.get('id')!, p.get('version')));
  }

  public async ngOnInit(): Promise<void> {
    this.isManager = await this.roleService.isManager();
    this.isExporter = await this.roleService.isExporter();
  }

  public ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

  public openVersionPopup(): void {
    this.dialog.open(FilterVersionPopupComponent, {
      panelClass: 'custom-dialog-container',
      width: '950px',
      autoFocus: false,
      data: {
        filter: this.filter
      }
    })
  }

  public openSaveVersionPopup(): void {
    this.dialog.open(HandleVersionPopupComponent, {
      panelClass: 'custom-dialog-container',
      width: '400px',
      autoFocus: false,
      data: {
        filter: this.filter,
        countOfInvalidPersons: this.personTable?.invalidCount ?? 0,
      } as HandleVersionPopupData,
    }).componentInstance.saveEvent.subscribe(() => {
      this.filterService.getSingle(this.filter.id)
        .then(filter => this.filter = filter);
    });
  }

  public openRenameVersionPopup(): void {
    this.dialog.open(HandleVersionPopupComponent, {
      panelClass: 'custom-dialog-container',
      width: '400px',
      autoFocus: false,
      data: {
        filter: this.filter,
        version: this.version
      } as HandleVersionPopupData,
    }).componentInstance.saveEvent.subscribe(() => {
      this.filterService.getSingle(this.filter.id)
        .then(filter => this.filter = filter);
    });
  }

  public async editFilter(): Promise<void> {
    await this.router.navigate(['-', 'filters', this.filter.id, 'edit']);
  }

  public openDeleteVersion(): void {
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      panelClass: 'custom-dialog-container',
      width: '500px',
      autoFocus: false,
      data: {
        context: 'version',
        contextValue: this.version!.name
          + ' '
          + this.translate.instant('person-table.columns.versionOf', { date: this.localDate.transform(this.version!.audit_info.created_at) })
      }
    });

    dialogRef.componentInstance.delete.subscribe(async() => {
      dialogRef.componentInstance.isLoading = true;
      try {
        await this.filterService.deleteVersion(this.version!.id);
        dialogRef.close();
        await this.router.navigate(['-', 'filters', this.filter.id]);
        this.toast.success('shared.state.deleted');
      } finally {
        dialogRef.componentInstance.isLoading = false;
      }
    })
  }

  public openExportPopup(): void {
    this.dialog.open(ExportPopupComponent, {
      panelClass: 'custom-dialog-container',
      width: '465px',
      autoFocus: 'dialog',
      data: {
        filterId: this.filter?.id,
        versionId: this.version?.id,
        invalidPersonCount: this.version?.countOfInvalidPersons ?? this.personTable?.invalidCount ?? 0,
      } as ExportPopupData,
    });
  }

  private handleIfVersion(version: string | null): void {
    if (version) {
      this.isNewest = false;
      this.version = this.filter.versions.find(v => v.id === version);
      this.criteria = this.version!.criteria;
    } else {
      this.criteria = this.filter.criteria;
    }
  }

  public async getBackToFilter(): Promise<void> {
    await this.router.navigate(['-', 'filters', this.filter.id]);
  }

  private async loadData(id: string, version: string | null): Promise<void> {
    this.backLink = this.getBackLink(id, version);
    this.filter = await this.filterService.getSingle(id);
    this.handleIfVersion(version);
  }

  private getBackLink(filterId: string, versionId: string | null): string {
    if (versionId) {
      return '/-/filters/' + filterId;
    } else {
      return '/-/filters';
    }
  }
}
