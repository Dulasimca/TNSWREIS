import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelFundComponent } from './hostel-fund.component';

describe('HostelFundComponent', () => {
  let component: HostelFundComponent;
  let fixture: ComponentFixture<HostelFundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostelFundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostelFundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
