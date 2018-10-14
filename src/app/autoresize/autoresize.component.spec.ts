import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoresizeComponent } from './autoresize.component';

describe('AutoresizeComponent', () => {
  let component: AutoresizeComponent;
  let fixture: ComponentFixture<AutoresizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoresizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoresizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
