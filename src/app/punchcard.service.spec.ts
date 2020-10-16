import { TestBed, inject } from '@angular/core/testing';

import { PunchcardService } from './punchcard.service';

describe('PunchcardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PunchcardService]
    });
  });

  it('should be created', inject([PunchcardService], (service: PunchcardService) => {
    expect(service).toBeTruthy();
  }));
});
