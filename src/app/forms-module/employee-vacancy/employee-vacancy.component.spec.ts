import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeVacancyComponent } from './employee-vacancy.component';

describe('EmployeeVacancyComponent', () => {
  let component: EmployeeVacancyComponent;
  let fixture: ComponentFixture<EmployeeVacancyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeVacancyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeVacancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
