import { Injectable, Logger } from '@nestjs/common';
import { DeployParamsDto, VMspecsDto } from './dto/deploy-params.dto';
import { ClusterService } from './cluster/cluster.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly clusterService: ClusterService) {} // Inject ClusterService via constructor

  async deployAll(params: DeployParamsDto, specs: VMspecsDto): Promise<string> {
    try {
      // Call the deploy_all_charts function
      await this.clusterService.deployAllCharts(
        params.master_ip,
        params.worker1_ip,
        params.worker2_ip,
        params.hypervisor,
        params.cluster_name,
        params.password,
        params.username,
        specs,
      );

      return 'All charts deployed successfully';
    } catch (error) {
      this.logger.error(`Deployment failed: ${error.message}`);
      throw new Error(`Deployment failed: ${error.message}`);
    }
  }
}
