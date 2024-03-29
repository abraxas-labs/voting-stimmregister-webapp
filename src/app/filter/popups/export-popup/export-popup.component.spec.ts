/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ExportPopupComponent} from './export-popup.component';

describe('ExportPopupComponent', () => {
  let component: ExportPopupComponent;
  let fixture: ComponentFixture<ExportPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExportPopupComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
