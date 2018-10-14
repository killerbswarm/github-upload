import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactAddPage } from './contact-add.page';

describe('ContactAddPage', () => {
  let component: ContactAddPage;
  let fixture: ComponentFixture<ContactAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactAddPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
