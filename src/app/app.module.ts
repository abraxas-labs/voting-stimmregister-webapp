/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APP_ROUTES } from './app-routing.module';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GRPC_INTERCEPTORS, GrpcCoreModule, GrpcLoggerModule } from '@ngx-grpc/core';
import { GrpcWebClientModule } from '@ngx-grpc/grpc-web-client';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { GlobalErrorHandler } from './core/handlers/global.errorHandler';
import { LoadingInterceptor } from './core/interceptors/loading.interceptor';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AppLayoutComponent } from './layouts/app-layout/app-layout.component';
import {
  AlertBarModule,
  AppHeaderBarModule,
  AuthenticationModule,
  AuthorizationModule,
  BadgeModule,
  FileInputModule,
  FilterModule,
  NumberModule,
  SegmentedControlGroupModule,
  TimeModule,
  UserModule,
} from '@abraxas/base-components';
import { BaseComponentsModule } from './modules/base-components/base-components.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TranslationLoader } from './services/translation-loader';
import { GrpcAuthInterceptor } from './core/interceptors/grpc-auth.interceptor';
import { GrpcErrorToastInterceptor } from './core/interceptors/grpc-error-toast.interceptor';
import { GrpcTenantInterceptor } from './core/interceptors/grpc-tenant-interceptor.service';
import { RestErrorToastInterceptor } from './core/interceptors/rest-error-toast.interceptor';
import { RestTenantInterceptor } from './core/interceptors/rest-tenant.interceptor';
import { GrpcLanguageInterceptor } from './core/interceptors/grpc-language-interceptor.service';
import { RestLanguageInterceptor } from './core/interceptors/rest-language.interceptor';
import { IfHasRoleDirective } from './shared/directives/if-has-role.directive';
import { SearchOverviewComponent } from './search/search-overview/search-overview.component';
import { PersonTableComponent } from './shared/components/person-table/person-table.component';
import { FilterOverviewComponent } from './filter/filter-overview/filter-overview.component';
import { DataOverviewComponent } from './data/data-overview/data-overview.component';
import { RegistrationStatisticsComponent } from './registration/registration-statistics/registration-statistics.component';
import { RegistrationStatisticsTableComponent } from './registration/registration-statistics-table/registration-statistics-table.component';
import { FilterFieldsComponent } from './filter/filter-fields/filter-fields.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { DataTableComponent } from './shared/components/data-table/data-table.component';
import { HistoryTableComponent } from './shared/components/history-table/history-table.component';
import { UploadDataPopupComponent } from './data/upload-data-popup/upload-data-popup.component';
import { PersonDetailComponent } from './search/person-detail/person-detail.component';
import { PersonAttributeTemplateComponent } from './search/person-detail/templates/person-attribute-template/person-attribute-template.component';
import { PersonAttributeAdvancedTemplateComponent } from './search/person-detail/templates/person-attribute-advanced-template/person-attribute-advanced-template.component';
import { PersonAttributeEVotingTemplateComponent } from './search/person-detail/templates/person-attribute-evoting-template/person-attribute-evoting-template.component';
import { PersonAttributeValidationTemplateComponent } from './search/person-detail/templates/person-attribute-validation-template/person-attribute-validation-template.component';
import { FilterDetailComponent } from './filter/filter-detail/filter-detail.component';
import { FilterVersionPopupComponent } from './filter/popups/filter-version-popup/filter-version-popup.component';
import { HandleFilterComponent } from './filter/handle-filter/handle-filter.component';
import { HandleVersionPopupComponent } from './filter/popups/handle-version-popup/handle-version-popup.component';
import { DeletePopupComponent } from './shared/components/delete-popup/delete-popup.component';
import { ExportPopupComponent } from './filter/popups/export-popup/export-popup.component';
import { MatIconModule } from '@angular/material/icon';
import { DataImportStatusIconComponent } from './shared/components/data-import-status-icon/data-import-status-icon.component';
import { DataImportDetailsComponent } from './shared/components/data-import-details/data-import-details.component';
import { FilteredPersonTableComponent } from './shared/components/filtered-person-table/filtered-person-table.component';
import { ChangeCasePipe } from './shared/pipes/change-case.pipe';
import { FilterCriteriaComponent } from './shared/components/filter-criteria/filter-criteria.component';
import { TranslationsDropdownItemsPipe } from './shared/pipes/translations-dropdown-items.pipe';
import { LocalDatePipe } from './shared/pipes/localDate.pipe';
import { SocialSecurityNumberPipe } from './shared/pipes/social-security-number.pipe';
import { PersonAttributePipe } from './shared/pipes/person-attribute.pipe';
import { FixedSpaceLoadingBarComponent } from './shared/components/fixed-space-loading-bar/fixed-space-loading-bar.component';
import { LabeledSpinnerComponent } from './shared/components/labeled-spinner/labeled-spinner.component';
import { PersonAddressComponent } from './search/person-detail/person-address/person-address.component';
import { IfHasAnyRoleDirective } from './shared/directives/if-has-any-role.directive';
import { ENV_INJECTION_TOKEN, VotingLibModule } from '@abraxas/voting-lib';
import { FilterTableComponent } from './filter/filter-table/filter-table.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslationLoader,
      },
      defaultLanguage: 'de',
    }),
    RouterModule.forRoot(APP_ROUTES),
    GrpcCoreModule.forRoot(),
    GrpcWebClientModule.forRoot({
      settings: { host: environment.serviceUrl },
    }),
    GrpcLoggerModule.forRoot({
      settings: {
        enabled: localStorage.getItem('GRPC_CONSOLE_LOGGER_ENABLED') === 'true' || !environment.production,
      },
    }),
    AuthenticationModule.forAuthentication(environment.authenticationConfig),
    AuthorizationModule.forAuthorization(environment.authorizationConfig),
    UserModule.forRoot(environment.userConfig),
    VotingLibModule.forRoot(environment.restApiEndpoint),
    BaseComponentsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    NumberModule,
    MatTableModule,
    SegmentedControlGroupModule,
    ClipboardModule,
    FileInputModule,
    MatMenuModule,
    AlertBarModule,
    BadgeModule,
    MatIconModule,
    FilterModule,
    TimeModule,
    AppHeaderBarModule,
  ],
  declarations: [
    AppComponent,
    MainLayoutComponent,
    AppLayoutComponent,
    IfHasRoleDirective,
    IfHasAnyRoleDirective,
    SearchOverviewComponent,
    PersonTableComponent,
    PersonDetailComponent,
    FilterOverviewComponent,
    DataOverviewComponent,
    RegistrationStatisticsComponent,
    RegistrationStatisticsTableComponent,
    PersonAttributeTemplateComponent,
    PersonAttributeValidationTemplateComponent,
    PersonAttributeAdvancedTemplateComponent,
    PersonAttributeEVotingTemplateComponent,
    FilterFieldsComponent,
    DataTableComponent,
    HistoryTableComponent,
    UploadDataPopupComponent,
    FilterDetailComponent,
    FilterVersionPopupComponent,
    HandleFilterComponent,
    HandleVersionPopupComponent,
    DeletePopupComponent,
    ExportPopupComponent,
    DataImportStatusIconComponent,
    DataImportDetailsComponent,
    FilteredPersonTableComponent,
    ChangeCasePipe,
    FilterCriteriaComponent,
    TranslationsDropdownItemsPipe,
    SocialSecurityNumberPipe,
    PersonAttributePipe,
    LocalDatePipe,
    FixedSpaceLoadingBarComponent,
    LabeledSpinnerComponent,
    PersonAddressComponent,
    FilterTableComponent,
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: ENV_INJECTION_TOKEN,
      useValue: environment.env,
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
    {
      provide: LOCALE_ID,
      useValue: 'de-CH',
    },
    {
      provide: GRPC_INTERCEPTORS,
      multi: true,
      useClass: GrpcErrorToastInterceptor,
    },
    {
      provide: GRPC_INTERCEPTORS,
      multi: true,
      useClass: GrpcAuthInterceptor,
    },
    {
      provide: GRPC_INTERCEPTORS,
      multi: true,
      useClass: GrpcTenantInterceptor,
    },
    {
      provide: GRPC_INTERCEPTORS,
      multi: true,
      useClass: GrpcLanguageInterceptor,
    },
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: RestTenantInterceptor,
    },
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: RestErrorToastInterceptor,
    },
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: RestLanguageInterceptor,
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic',
      },
    },
    DecimalPipe,
    LocalDatePipe,
    SocialSecurityNumberPipe,
  ],
})
export class AppModule {}
