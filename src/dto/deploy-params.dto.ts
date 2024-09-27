// // src/dto/deploy-params.dto.ts
// import { IsString, IsIP } from 'class-validator';

// export class DeployParamsDto {
//   @IsIP()
//   master_ip: string;

//   @IsIP()
//   worker1_ip: string;

//   @IsIP()
//   worker2_ip: string;

//   @IsString()
//   cluster_name: string;

//   @IsString()
//   hypervisor: string;

//   @IsString()
//   username: string;

//   @IsString()
//   password: string;
// }

// export class VMspecsDto {
//   @IsString()
//   master_hostname: string;

//   @IsString()
//   worker1_hostname: string;

//   @IsString()
//   worker2_hostname: string;

//   @IsString()
//   tenant: string;

//   @IsString()
//   network: string;

//   @IsString()
//   gateway: string;
// }



import { IsString, IsIP } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeployParamsDto {
  @ApiProperty({ description: 'Master IP address', example: '192.168.1.1' })
  @IsIP()
  master_ip: string;

  @ApiProperty({ description: 'Worker 1 IP address', example: '192.168.1.2' })
  @IsIP()
  worker1_ip: string;

  @ApiProperty({ description: 'Worker 2 IP address', example: '192.168.1.3' })
  @IsIP()
  worker2_ip: string;

  @ApiProperty({ description: 'Cluster name', example: 'my-cluster' })
  @IsString()
  cluster_name: string;

  @ApiProperty({ description: 'Hypervisor type', example: 'KVM' })
  @IsString()
  hypervisor: string;

  @ApiProperty({ description: 'Username for authentication', example: 'admin' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'Password for authentication', example: 'securepassword' })
  @IsString()
  password: string;
}

export class VMspecsDto {
  @ApiProperty({ description: 'Master hostname', example: 'master-node' })
  @IsString()
  master_hostname: string;

  @ApiProperty({ description: 'Worker 1 hostname', example: 'worker1-node' })
  @IsString()
  worker1_hostname: string;

  @ApiProperty({ description: 'Worker 2 hostname', example: 'worker2-node' })
  @IsString()
  worker2_hostname: string;

  @ApiProperty({ description: 'Tenant name', example: 'tenant1' })
  @IsString()
  tenant: string;

  @ApiProperty({ description: 'Network name', example: 'my-network' })
  @IsString()
  network: string;

  @ApiProperty({ description: 'Gateway IP address', example: '192.168.1.254' })
  @IsString()
  gateway: string;
}
