import { Test, TestingModule } from '@nestjs/testing';
import { RancherController } from './rancher.controller';

describe('RancherController', () => {
  let controller: RancherController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RancherController],
    }).compile();

    controller = module.get<RancherController>(RancherController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
