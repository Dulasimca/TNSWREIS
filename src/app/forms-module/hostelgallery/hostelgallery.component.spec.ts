import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelgalleryComponent } from './hostelgallery.component';

describe('HostelgalleryComponent', () => {
  let component: HostelgalleryComponent;
  let fixture: ComponentFixture<HostelgalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostelgalleryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostelgalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
