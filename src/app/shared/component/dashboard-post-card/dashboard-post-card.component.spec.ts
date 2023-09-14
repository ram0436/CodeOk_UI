import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPostCardComponent } from './dashboard-post-card.component';

describe('DashboardPostCardComponent', () => {
  let component: DashboardPostCardComponent;
  let fixture: ComponentFixture<DashboardPostCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardPostCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardPostCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
