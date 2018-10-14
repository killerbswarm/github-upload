import { TestBed, inject } from '@angular/core/testing';

import { ImghandlerService } from './imghandler.service';

describe('ImghandlerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImghandlerService]
    });
  });

  it('should be created', inject([ImghandlerService], (service: ImghandlerService) => {
    expect(service).toBeTruthy();
  }));
});
