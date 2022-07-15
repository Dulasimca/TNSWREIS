import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineRegisteredStudentstatusComponent } from './online-registered-studentstatus.component';

describe('OnlineRegisteredStudentstatusComponent', () => {
  let component: OnlineRegisteredStudentstatusComponent;
  let fixture: ComponentFixture<OnlineRegisteredStudentstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlineRegisteredStudentstatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineRegisteredStudentstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
