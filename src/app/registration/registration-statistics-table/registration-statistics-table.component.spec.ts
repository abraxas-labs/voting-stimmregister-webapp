/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationStatisticsTableComponent } from './registration-statistics-table.component';

describe('RegistrationStatisticsTableComponent', () => {
  let component: RegistrationStatisticsTableComponent;
  let fixture: ComponentFixture<RegistrationStatisticsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistrationStatisticsTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationStatisticsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
