import { Test, TestingModule } from '@nestjs/testing';
import { RancherService } from './rancher.service';

describe('RancherService', () => {
  let service: RancherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RancherService],
    }).compile();

    service = module.get<RancherService>(RancherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
