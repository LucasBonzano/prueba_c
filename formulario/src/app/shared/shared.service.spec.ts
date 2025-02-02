import { TestBed } from '@angular/core/testing';
import { ClienteSharedService } from './shared.service';

describe('ClienteSharedService', () => {
  let service: ClienteSharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClienteSharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
