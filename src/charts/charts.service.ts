import { Injectable, Logger } from '@nestjs/common';
import { SshService } from 'src/ssh/ssh.service'; // Adjust the import path based on your project structure

@Injectable()
export class ChartsService {
  private readonly logger = new Logger(ChartsService.name);
  private readonly TEMP_PATH = "/tmp/all-charts"; // Set your desired remote path here

  constructor(private readonly sshService: SshService) {}

  async setupChartsOnMaster(masterIp: string): Promise<void> {
    try {
      const chartsPath = 'app/all-charts';
      this.logger.log(`Setting up charts on master ${masterIp}`);
      await this.sshService.sftpUpload(masterIp, chartsPath, this.TEMP_PATH);
      this.logger.log(`Successfully set up charts on master ${masterIp}`);
    } catch (error) {
      this.logger.error(`Failed to setup charts on master ${masterIp}: ${error.message}`);
    }
  }

  async setupWorkerNodes(worker1Ip: string, worker2Ip: string): Promise<void> {
    try {
      this.logger.log(`Setting up worker nodes ${worker1Ip} and ${worker2Ip}`);
      
      await this.sshService.executeSshCommand(worker1Ip, 'mkdir -p /mnt/disks/ssd1 && chown -R 777 /mnt/disks/ssd1/ && yum install -y nfs-utils');
      this.logger.log(`Worker node ${worker1Ip} setup complete.`);
      
      await this.sshService.executeSshCommand(worker2Ip, 'mkdir -p /mnt/disks/ssd4 /mnt/disks/ssd5 && chown -R 777 /mnt/disks/ssd4/ /mnt/disks/ssd5/ && yum install -y nfs-utils');
      this.logger.log(`Worker node ${worker2Ip} setup complete.`);
    } catch (error) {
      this.logger.error(`Failed to setup worker nodes: ${error.message}`);
    }
  }
}
