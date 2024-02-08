/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PersonAttributeValidationTemplateComponent} from './person-attribute-validation-template.component';

describe('PersonAttributeValidationTemplateComponent', () => {
  let component: PersonAttributeValidationTemplateComponent;
  let fixture: ComponentFixture<PersonAttributeValidationTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonAttributeValidationTemplateComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonAttributeValidationTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
