import { Test, TestingModule } from '@nestjs/testing';
import { VideocallService } from './videocall.service';

describe('VideocallService', () => {
  let service: VideocallService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VideocallService],
    }).compile();

    service = module.get<VideocallService>(VideocallService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
