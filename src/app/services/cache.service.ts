/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { AuthorizationService } from '@abraxas/base-components';
import { Injectable } from '@angular/core';
import { constants } from '../shared/helpers/constants';

@Injectable({ providedIn: 'root' })
export class CacheService {
  private readonly storage: Storage = window.sessionStorage;
  private tenantId = '';

  constructor(private readonly authService: AuthorizationService) {
    this.authService.getActiveTenant().then((t) => (this.tenantId = t.id));
  }

  public getItem<TResult = string>(key: string): TResult | null {
    if (this.tenantId) {
      const result = this.storage.getItem(this.getReplacedCacheKey(this.tenantId, key));
      if (result) {
        return JSON.parse(result);
      }
    }

    return null;
  }

  public setItem<TValue = string>(key: string, value: TValue, defaultValue?: TValue): void {
    const currentCacheValue = this.getItem(key);
    if (currentCacheValue == null && defaultValue && value === defaultValue) {
      return;
    }

    if (this.tenantId) {
      this.storage.setItem(this.getReplacedCacheKey(this.tenantId, key), JSON.stringify(value));
    }
  }

  public removeItem(key: string) {
    if (this.tenantId) {
      this.storage.removeItem(this.getReplacedCacheKey(this.tenantId, key));
    }
  }

  private getReplacedCacheKey(tenantId: string, key: string) {
    return constants.SESSION_STORAGE_SELECTED_VALUE_CACHE_TEMPLATE.replace('{tenant-id}', tenantId).replace(
      '{key}',
      key
    );
  }
}
