/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'localDate',
})
export class LocalDatePipe implements PipeTransform {
  private readonly datePipe: DatePipe = new DatePipe('de-CH');

  public transform(value: Date, includeTime: boolean = false): string {
    return this.datePipe.transform(value, 'dd.MM.yyyy' + (includeTime ? ' HH:mm' : '')) ?? '';
  }
}
