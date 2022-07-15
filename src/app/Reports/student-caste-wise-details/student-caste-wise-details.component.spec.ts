import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCasteWiseDetailsComponent } from './student-caste-wise-details.component';

describe('StudentCasteWiseDetailsComponent', () => {
  let component: StudentCasteWiseDetailsComponent;
  let fixture: ComponentFixture<StudentCasteWiseDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentCasteWiseDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentCasteWiseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
