import { Test, TestingModule } from '@nestjs/testing';
import { WebchatController } from './webchat.controller';

describe('WebchatController', () => {
  let controller: WebchatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebchatController],
    }).compile();

    controller = module.get<WebchatController>(WebchatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
