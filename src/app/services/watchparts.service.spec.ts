import { TestBed } from '@angular/core/testing';

import { WatchpartsService } from './watchparts.service';

describe('WatchpartsService', () => {
  let service: WatchpartsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WatchpartsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
