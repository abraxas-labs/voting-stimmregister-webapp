/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SearchOverviewComponent} from './search-overview.component';

describe('SearchComponent', () => {
  let component: SearchOverviewComponent;
  let fixture: ComponentFixture<SearchOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchOverviewComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
