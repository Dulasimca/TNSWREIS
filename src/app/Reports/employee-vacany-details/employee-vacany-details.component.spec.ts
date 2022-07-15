import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeVacanyDetailsComponent } from './employee-vacany-details.component';

describe('EmployeeVacanyDetailsComponent', () => {
  let component: EmployeeVacanyDetailsComponent;
  let fixture: ComponentFixture<EmployeeVacanyDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeVacanyDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeVacanyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
