/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService, AuthorizationService, SnackbarComponent } from '@abraxas/base-components';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import 'moment/locale/de';
import { SnackbarService, ThemeService } from '@abraxas/voting-lib';
import { firstValueFrom, Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './app-layout.component.html',
})
export class AppLayoutComponent implements OnInit, OnDestroy {
  public authenticated = false;
  public hasTenant = false;
  public loading = false;
  public theme?: string;
  public customLogo?: string;
  public appTitle: string = '';

  @ViewChild('snackbar') public snackbarComponent!: SnackbarComponent;

  public language: any = 'de';
  public languages: any = ['de'];

  private readonly subscriptions: Subscription[] = [];

  constructor(
    themeService: ThemeService,
    snackbarService: SnackbarService,
    private readonly translations: TranslateService,
    private readonly authentication: AuthenticationService,
    private readonly authorization: AuthorizationService
  ) {
    const snackbarSubscription = snackbarService.message$.subscribe((m) => {
      if (!this.snackbarComponent) {
        return;
      }

      this.snackbarComponent.message = m.message;
      this.snackbarComponent.variant = m.variant;
      this.snackbarComponent.open();
    });
    this.subscriptions.push(snackbarSubscription);

    const themeSubscription = themeService.theme$.subscribe((theme) => this.onThemeChange(theme));
    this.subscriptions.push(themeSubscription);

    const logoSubscription = themeService.logo$.subscribe((logo) => (this.customLogo = logo));
    this.subscriptions.push(logoSubscription);
  }

  public async reload(): Promise<void> {
    // reload to ensure consistent state across all components, needed due to some base-components
    window.location.reload();
  }

  public logout(): void {
    this.authentication.logout();
  }

  public async ngOnInit(): Promise<void> {
    moment.locale('de');
    this.translations.setDefaultLang('de');

    this.authenticated = false;
    this.hasTenant = false;
    this.loading = true;

    if (!(await this.authentication.authenticate())) {
      this.loading = false;
      return;
    }

    this.authenticated = true;

    try {
      await this.authorization.getActiveTenant();
      this.hasTenant = true;
    } catch (e) {
      this.hasTenant = false;
    } finally {
      this.loading = false;
    }
  }

  public ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  private async onThemeChange(theme?: string): Promise<void> {
    if (!theme) {
      return;
    }

    this.appTitle = await firstValueFrom(
      this.translations.get('misc.application-title.' + theme.toLowerCase())
    );
    this.theme = theme;
  }
}
