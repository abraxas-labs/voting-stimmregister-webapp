/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PersonAttributeAdvancedTemplateComponent} from './person-attribute-advanced-template.component';

describe('PersonAttributeAdvancedTemplateComponent', () => {
  let component: PersonAttributeAdvancedTemplateComponent;
  let fixture: ComponentFixture<PersonAttributeAdvancedTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonAttributeAdvancedTemplateComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonAttributeAdvancedTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
