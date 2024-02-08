/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Pipe, PipeTransform } from '@angular/core';
import { toKebabCase } from "@abraxas/base-components";

export type CasePattern = 'kebab-case';

@Pipe({
  name: 'changeCase'
})
export class ChangeCasePipe implements PipeTransform {

  public transform(value: string, pattern: CasePattern): string {
    switch (pattern) {
      case "kebab-case":
        return toKebabCase(value);
      default:
        throw new Error('casing not supported: ' + pattern);
    }
  }
}
