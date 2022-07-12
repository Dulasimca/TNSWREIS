import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TashildarMappingComponent } from './tashildar-mapping.component';

describe('TashildarMappingComponent', () => {
  let component: TashildarMappingComponent;
  let fixture: ComponentFixture<TashildarMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TashildarMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TashildarMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
