import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferOwnaccountsComponent } from './transfer-ownaccounts.component';

describe('TransferOwnaccountsComponent', () => {
  let component: TransferOwnaccountsComponent;
  let fixture: ComponentFixture<TransferOwnaccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferOwnaccountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferOwnaccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
