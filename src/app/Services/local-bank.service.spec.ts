import { TestBed } from '@angular/core/testing';

import { LocalBankService } from './local-bank.service';

describe('LocalBankService', () => {
  let service: LocalBankService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalBankService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
