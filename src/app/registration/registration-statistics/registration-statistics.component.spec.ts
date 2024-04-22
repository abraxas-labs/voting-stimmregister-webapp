/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationStatisticsComponent } from './registration-statistics.component';

describe('RegistrationStatisticsComponent', () => {
  let component: RegistrationStatisticsComponent;
  let fixture: ComponentFixture<RegistrationStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistrationStatisticsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
