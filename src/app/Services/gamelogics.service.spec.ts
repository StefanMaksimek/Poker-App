import { TestBed } from '@angular/core/testing';

import { GamelogicsService } from './gamelogics.service';

describe('GamelogicsService', () => {
  let service: GamelogicsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GamelogicsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
