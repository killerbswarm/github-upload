import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PunchcardPage } from './punchcard.page';

describe('PunchcardPage', () => {
  let component: PunchcardPage;
  let fixture: ComponentFixture<PunchcardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PunchcardPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PunchcardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
