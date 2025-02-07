/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { AuthorizationService } from '@abraxas/base-components';
import { OAuthService } from 'angular-oauth2-oidc';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(
    private readonly authorization: AuthorizationService,
    private readonly translate: TranslateService,
    private readonly oauthService: OAuthService
  ) {
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('de');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use('de');

    // enable automatic silent refresh
    this.oauthService.setupAutomaticSilentRefresh({}, 'access_token');
  }

  public ngOnInit(): void {
    this.authorization.activeTenantChanged
      .pipe(
        tap(() => {
          location.reload();
        })
      )
      .subscribe();
  }
}
