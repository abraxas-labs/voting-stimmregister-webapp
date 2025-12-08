/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  ViewChild,
  inject,
} from '@angular/core';
import { Person } from '../../../models/person/person';

@Component({
  selector: 'app-person-address',
  templateUrl: './person-address.component.html',
  styleUrls: ['./person-address.component.scss'],
  standalone: false,
})
export class PersonAddressComponent implements AfterViewInit {
  private readonly cd = inject(ChangeDetectorRef);

  @ViewChild('address')
  public addressComponent?: ElementRef;

  @Input()
  public person!: Person;

  public addressText: string = '';

  public ngAfterViewInit(): void {
    this.addressText = this.addressComponent!.nativeElement.innerText ?? '';
    this.cd.detectChanges();
  }
}
