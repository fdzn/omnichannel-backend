import { Test, TestingModule } from '@nestjs/testing';
import { TicketingController } from './ticketing.controller';

describe('TicketingController', () => {
  let controller: TicketingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketingController],
    }).compile();

    controller = module.get<TicketingController>(TicketingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
