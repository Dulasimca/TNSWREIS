import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineRegisteredStudentReportComponent } from './online-registered-student-report.component';

describe('OnlineRegisteredStudentReportComponent', () => {
  let component: OnlineRegisteredStudentReportComponent;
  let fixture: ComponentFixture<OnlineRegisteredStudentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlineRegisteredStudentReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineRegisteredStudentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
