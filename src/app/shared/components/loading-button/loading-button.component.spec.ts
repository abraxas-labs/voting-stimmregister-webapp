/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingButtonComponent } from './loading-button.component';
import { By } from '@angular/platform-browser';
import { ButtonModule, SpinnerModule } from '@abraxas/base-components';

describe('LoadingButtonComponent', () => {
  let component: LoadingButtonComponent;
  let fixture: ComponentFixture<LoadingButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadingButtonComponent ],
      imports: [ ButtonModule, SpinnerModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should only show spinner when loading', () => {
    expect(fixture.debugElement.query(
      By.css('bc-spinner')
    )).toBeNull();

    component.loading = true;
    fixture.detectChanges();

    expect(fixture.debugElement.query(
      By.css('bc-spinner')
    )).not.toBeNull();

    component.loading = false;
    fixture.detectChanges();

    expect(fixture.debugElement.query(
      By.css('bc-spinner')
    )).toBeNull();
  });

  it('should disable when loading or manually disabled', () => {
    const button = fixture.debugElement.query(
      By.css('bc-button')
    ).componentInstance;
    expect(button.disabled).toBeFalse();

    component.loading = true;
    fixture.detectChanges();
    expect(button.disabled).toBeTrue();

    component.loading = false;
    fixture.detectChanges();
    expect(button.disabled).toBeFalse();

    component.disabled = true;
    fixture.detectChanges();
    expect(button.disabled).toBeTrue();

    component.loading = true;
    fixture.detectChanges();
    expect(button.disabled).toBeTrue();

    component.disabled = false;
    fixture.detectChanges();
    expect(button.disabled).toBeTrue();
  });
});
