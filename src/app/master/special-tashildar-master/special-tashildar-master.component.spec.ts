import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialTashildarMasterComponent } from './special-tashildar-master.component';

describe('SpecialTashildarMasterComponent', () => {
  let component: SpecialTashildarMasterComponent;
  let fixture: ComponentFixture<SpecialTashildarMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecialTashildarMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialTashildarMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
