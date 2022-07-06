import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentIdcardComponent } from './student-idcard.component';

describe('StudentIdcardComponent', () => {
  let component: StudentIdcardComponent;
  let fixture: ComponentFixture<StudentIdcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentIdcardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentIdcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
