/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { NgModule } from '@angular/core';

import {
  AppHeaderBarIamModule,
  LoadingBarModule,
  NavBarModule,
  SubNavigationBarModule,
  ButtonModule,
  CardModule,
  QuickActionBarModule,
  RowModule,
  SearchModule,
  SnackbarModule,
  TableModule,
  TextModule,
  AccountPanelModule,
  AppDrawerModule,
  DropdownModule,
  RoleModule,
  LabelModule,
  IconModule,
  SpinnerModule,
  TooltipModule,
  CheckboxModule,
  ReadonlyModule,
  TextareaModule,
  DividerModule,
  DateModule,
  RadioButtonModule,
  StatusLabelModule,
} from '@abraxas/base-components';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatGridListModule } from '@angular/material/grid-list';

@NgModule({
  exports: [
    LoadingBarModule,
    NavBarModule,
    SubNavigationBarModule,
    AppHeaderBarIamModule,
    ButtonModule,
    CardModule,
    QuickActionBarModule,
    RowModule,
    SearchModule,
    SnackbarModule,
    TableModule,
    TextModule,
    AccountPanelModule,
    AppDrawerModule,
    ButtonModule,
    DropdownModule,
    RoleModule,
    LabelModule,
    IconModule,
    SpinnerModule,
    TooltipModule,
    CheckboxModule,
    OverlayModule,
    ReadonlyModule,
    TextareaModule,
    MatGridListModule,
    DividerModule,
    DateModule,
    RadioButtonModule,
    StatusLabelModule,
  ],
})
export class BaseComponentsModule {}
