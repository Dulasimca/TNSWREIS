import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelgoComponent } from './hostelgo.component';

describe('HostelgoComponent', () => {
  let component: HostelgoComponent;
  let fixture: ComponentFixture<HostelgoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostelgoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostelgoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
