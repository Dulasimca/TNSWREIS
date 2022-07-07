import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineApplicationControlComponent } from './online-application-control.component';

describe('OnlineApplicationControlComponent', () => {
  let component: OnlineApplicationControlComponent;
  let fixture: ComponentFixture<OnlineApplicationControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlineApplicationControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineApplicationControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
