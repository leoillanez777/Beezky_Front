import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpvalidatorComponent } from './otpvalidator.component';

describe('OtpvalidatorComponent', () => {
  let component: OtpvalidatorComponent;
  let fixture: ComponentFixture<OtpvalidatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtpvalidatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtpvalidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
