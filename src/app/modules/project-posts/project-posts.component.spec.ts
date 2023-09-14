import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPostsComponent } from './project-posts.component';

describe('ProjectPostsComponent', () => {
  let component: ProjectPostsComponent;
  let fixture: ComponentFixture<ProjectPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectPostsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
