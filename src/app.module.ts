// import { Module } from '@nestjs/common';
// import { DeployController } from './app.controller';
// import { AppService } from './app.service';
// import { ClusterController } from './cluster/cluster.controller';
// import { ClusterService } from './cluster/cluster.service';
// import { SshController } from './ssh/ssh.controller';
// import { SshService } from './ssh/ssh.service';
// import { SshModule } from './ssh/ssh.module';
// import { VMService } from './vms/vms.service';
// import { VmsController } from './vms/vms.controller';
// import { RancherService } from './rancher/rancher.service';
// import { RancherController } from './rancher/rancher.controller';
// import { ChartsService } from './charts/charts.service';

// @Module({
//   imports: [SshModule],
//   controllers: [DeployController, ClusterController, SshController, VmsController, RancherController],
//   providers: [AppService, ClusterService, SshService, VMService, RancherService, ChartsService],
// })
// export class AppModule {}


import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClusterService } from './cluster/cluster.service';
import { VMService } from './vms/vms.service';
import { RancherService } from './rancher/rancher.service';
import { SshService } from './ssh/ssh.service';
import { ChartsService } from './charts/charts.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ClusterService, VMService, RancherService, SshService, ChartsService],
})
export class AppModule {}
