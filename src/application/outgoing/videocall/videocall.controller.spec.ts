import { Test, TestingModule } from "@nestjs/testing";
import { VideocallController } from "./videocall.controller";

describe("VideocallController", () => {
  let controller: VideocallController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideocallController],
    }).compile();

    controller = module.get<VideocallController>(VideocallController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
