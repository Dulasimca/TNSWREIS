import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstituteMasterEntryComponent } from './institute-master-entry.component';

describe('InstituteMasterEntryComponent', () => {
  let component: InstituteMasterEntryComponent;
  let fixture: ComponentFixture<InstituteMasterEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstituteMasterEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstituteMasterEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
