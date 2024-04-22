/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Routes } from "@angular/router";
import { IsAuthenticatedGuard } from "@abraxas/base-components";
import { MultiGuard } from "./core/guards/multi.guard";
import { TenantGuard } from "./core/guards/tenant.guard";
import { AccessRole } from "./models/accessRole";
import { RoleGuard } from "./core/guards/role.guard";
import { SearchOverviewComponent } from "./search/search-overview/search-overview.component";
import { FilterOverviewComponent } from "./filter/filter-overview/filter-overview.component";
import { DataOverviewComponent } from "./data/data-overview/data-overview.component";
import { RegistrationStatisticsComponent } from "./registration/registration-statistics/registration-statistics.component";
import { MainLayoutComponent } from "./layouts/main-layout/main-layout.component";
import { PersonDetailComponent } from "./search/person-detail/person-detail.component";
import { FilterDetailComponent } from "./filter/filter-detail/filter-detail.component";
import { HandleFilterComponent } from "./filter/handle-filter/handle-filter.component";
import { AuthThemeGuard, ThemeService } from "@abraxas/voting-lib";

export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: ThemeService.NoTheme,
  },
  {
    path: ':theme',
    canActivate: [AuthThemeGuard],
    children: [
      {
        path: '',
        component: MainLayoutComponent,
        canActivate: [MultiGuard],
        data: {
          guardList: [IsAuthenticatedGuard, TenantGuard, RoleGuard],
          role: [AccessRole.Reader, AccessRole.Manager],
        },
        children: [
          {
            path: '',
            redirectTo: 'search',
            pathMatch: 'full',
          },
          {
            path: 'search',
            component: SearchOverviewComponent,
            canActivate: [MultiGuard],
            data: {
              guardList: [IsAuthenticatedGuard, TenantGuard, RoleGuard],
              role: [AccessRole.Reader, AccessRole.Manager],
            },
          },
          {
            path: 'filters',
            component: FilterOverviewComponent,
            canActivate: [MultiGuard],
            data: {
              guardList: [IsAuthenticatedGuard, TenantGuard, RoleGuard],
              role: [AccessRole.Reader, AccessRole.Manager],
            },
          },
          {
            path: 'filters/new',
            component: HandleFilterComponent,
            canActivate: [MultiGuard],
            data: {
              guardList: [IsAuthenticatedGuard, TenantGuard, RoleGuard],
              role: [AccessRole.Manager],
            }
          },
          {
            path: 'filters/:id',
            component: FilterDetailComponent,
            canActivate: [MultiGuard],
            data: {
              guardList: [IsAuthenticatedGuard, TenantGuard, RoleGuard],
              role: [AccessRole.Reader, AccessRole.Manager],
            },
          },
          {
            path: 'filters/:id/version/:version',
            component: FilterDetailComponent,
            canActivate: [MultiGuard],
            data: {
              guardList: [IsAuthenticatedGuard, TenantGuard, RoleGuard],
              role: [AccessRole.Reader, AccessRole.Manager],
            },
          },
          {
            path: 'filters/:id/edit',
            component: HandleFilterComponent,
            canActivate: [MultiGuard],
            data: {
              guardList: [IsAuthenticatedGuard, TenantGuard, RoleGuard],
              role: [AccessRole.Manager],
            }
          },
          {
            path: 'filters/:id/edit/person/:personRegisterId',
            component: PersonDetailComponent,
            canActivate: [MultiGuard],
            data: {
              guardList: [IsAuthenticatedGuard, TenantGuard, RoleGuard],
              role: [AccessRole.Manager],
            }
          },
          {
            path: 'data',
            component: DataOverviewComponent,
            canActivate: [MultiGuard],
            data: {
              guardList: [IsAuthenticatedGuard, TenantGuard, RoleGuard],
              role: [AccessRole.Reader, AccessRole.Manager],
            },
          },
          {
            path: 'registration',
            component: RegistrationStatisticsComponent,
            canActivate: [MultiGuard],
            data: {
              guardList: [IsAuthenticatedGuard, TenantGuard, RoleGuard],
              role: [AccessRole.EVotingStatisticsReader],
            },
          },
          {
            path: 'filters/:id/person/:personRegisterId',
            component: PersonDetailComponent,
            canActivate: [MultiGuard],
            data: {
              guardList: [IsAuthenticatedGuard, TenantGuard, RoleGuard],
              role: [AccessRole.Reader, AccessRole.Manager],
            },
          },
          {
            path: 'filters/:id/version/:version/person/:personRegisterId',
            component: PersonDetailComponent,
            canActivate: [MultiGuard],
            data: {
              guardList: [IsAuthenticatedGuard, TenantGuard, RoleGuard],
              role: [AccessRole.Reader, AccessRole.Manager],
            },
          },
          {
            path: 'search/person/:personRegisterId',
            component: PersonDetailComponent,
            canActivate: [MultiGuard],
            data: {
              guardList: [IsAuthenticatedGuard, TenantGuard, RoleGuard],
              role: [AccessRole.Reader, AccessRole.Manager],
            },
          },
        ],
      }
    ]
  },
  {path: '**', redirectTo: ''},
];
