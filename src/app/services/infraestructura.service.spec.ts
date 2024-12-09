import { TestBed } from '@angular/core/testing';

import { InfraestructuraService } from './infraestructura.service';

describe('InfraestructuraService', () => {
  let service: InfraestructuraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfraestructuraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
