import { IsNotEmpty, IsString } from 'class-validator';

export class DeployParamsDto {
    @IsNotEmpty()
    @IsString()
    master_ip: string;

    @IsNotEmpty()
    @IsString()
    worker1_ip: string;

    @IsNotEmpty()
    @IsString()
    worker2_ip: string;

    @IsNotEmpty()
    @IsString()
    cluster_name: string;

    @IsNotEmpty()
    @IsString()
    hypervisor: string;

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    master_hostname: string;

    @IsNotEmpty()
    @IsString()
    worker1_hostname: string;

    @IsNotEmpty()
    @IsString()
    worker2_hostname: string;

    @IsNotEmpty()
    @IsString()
    tenant: string;

    @IsNotEmpty()
    @IsString()
    network: string;

    @IsNotEmpty()
    @IsString()
    gateway: string;
}
