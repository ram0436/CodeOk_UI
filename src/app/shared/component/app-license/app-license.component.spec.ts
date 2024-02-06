import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppLicenseComponent } from './app-license.component';

describe('AppLicenseComponent', () => {
  let component: AppLicenseComponent;
  let fixture: ComponentFixture<AppLicenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppLicenseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppLicenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
