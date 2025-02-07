/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component } from '@angular/core';
import { AccessRole } from '../../models/accessRole';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {
  public readonly roles: typeof AccessRole = AccessRole;

  public isDetailSite() {
    return (
      window.location.pathname.includes('person') ||
      (window.location.pathname.includes('filter') && !window.location.pathname.includes('filters'))
    );
  }
}
