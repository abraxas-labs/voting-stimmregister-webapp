/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PersonAttributeEVotingTemplateComponent} from './person-attribute-evoting-template.component';

describe('PersonAttributeEVotingTemplateComponent', () => {
  let component: PersonAttributeEVotingTemplateComponent;
  let fixture: ComponentFixture<PersonAttributeEVotingTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonAttributeEVotingTemplateComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonAttributeEVotingTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
