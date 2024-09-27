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

  @IsIP()
  master_ip: string;


  @IsIP()
  worker1_ip: string;


  @IsIP()
  worker2_ip: string;


  @IsString()
  cluster_name: string;


  @IsString()
  hypervisor: string;


  @IsString()
  username: string;


  @IsString()
  password: string;
}

export class VMspecsDto {
  @IsString()
  master_hostname: string;


  @IsString()
  worker1_hostname: string;

  @IsString()
  worker2_hostname: string;

 
  @IsString()
  tenant: string;

  @IsString()
  network: string;


  @IsString()
  gateway: string;
}
