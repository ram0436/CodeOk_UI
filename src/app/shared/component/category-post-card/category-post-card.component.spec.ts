import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryPostCardComponent } from './category-post-card.component';

describe('CategoryPostCardComponent', () => {
  let component: CategoryPostCardComponent;
  let fixture: ComponentFixture<CategoryPostCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryPostCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryPostCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
