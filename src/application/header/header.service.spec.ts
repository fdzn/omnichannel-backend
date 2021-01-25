import { Test, TestingModule } from '@nestjs/testing';
import { HeaderService } from './header.service';

describe('HeaderService', () => {
  let service: HeaderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HeaderService],
    }).compile();

    service = module.get<HeaderService>(HeaderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
