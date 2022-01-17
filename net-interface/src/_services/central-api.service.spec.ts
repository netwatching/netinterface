/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CentralApiService } from './central-api.service';

describe('Service: CentralApi', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CentralApiService]
    });
  });

  it('should ...', inject([CentralApiService], (service: CentralApiService) => {
    expect(service).toBeTruthy();
  }));
});
