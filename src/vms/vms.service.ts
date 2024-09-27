import { Injectable, HttpException } from '@nestjs/common';
import { SshService } from 'src/ssh/ssh.service';
import {json} from "json"
import axios from 'axios';
@Injectable()
export class VMService {
  private readonly EXEC_AGENTS = {
    "s1": "http://51.255.80.207:5000/execute",
    "s2": "http://51.91.72.58:5000/execute",
    "s3": "http://149.202.75.11:5000/execute",
    "s4": "http://94.23.203.133:5000/execute",
  }

  private readonly VM_AGENTS = {
    "s1": "http://51.255.80.207:8120/api/create_vm",
    "s2": "http://51.91.72.58:8120/api/create_vm",
    "s3": "http://149.202.75.11:8120/api/create_vm",
    "s4": "http://94.23.203.133:8120/api/create_vm",
  }

  private readonly TEMP_PATH = "/tmp/all-charts"


   async masterVM(addressip, network, hostname, tenant, gateway, hypervisor) {
        console.log(hostname)
        const installation_endpoint = `${this.VM_AGENTS[hypervisor]}`
        const master_payload = JSON.stringify({
            addressip: addressip,
            hostname: hostname,
            gateway: gateway,
            nameserver: "10.0.0.11",
            RAM: 4096,
            CPU: 4,
            hostnamevm: hostname.split(".")[0],
            size: 30,
            proxy: "freeipa02-shared.winu.fr",
            network: network,
            tenant_name: tenant,
            template_name: "master"
        });
        try {
            const response = await axios.post(installation_endpoint, master_payload, {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log(`Configuration response: ${response.data}`);
            return response.data;
        } catch (error) {
            console.error(`Error during VM setup: ${error.message}`);
            // Handle the error and rethrow as an HTTP exception
            throw new HttpException(
                `Error creating virtual machine: ${error.response?.data || error.message}`,
                500,
            );
        }
    }



    async worker1VM(addressip, network, hostname, tenant, gateway, hypervisor){
        console.log(hostname)
        const installation_endpoint = `${this.VM_AGENTS[hypervisor]}`
        const worker1_payload = JSON.stringify({
            "addressip": addressip,
            "hostname": hostname,
            "gateway": gateway,
            "nameserver": "10.0.0.11",
            "RAM": 6144,
            "CPU": 8,
            "hostnamevm": hostname.split(".")[0],
            "size": 40,
            "proxy": "freeipa02-shared.winu.fr",
            "network": network,
            "tenant_name": tenant,
            "template_name": "worker"
        })
        try {
            const response = await axios.post(installation_endpoint, worker1_payload, {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log(`Configuration response: ${response.data}`);
            return response.data;
        } catch (error) {
            console.error(`Error during VM setup: ${error.message}`);
            // Handle the error and rethrow as an HTTP exception
            throw new HttpException(
                `Error creating virtual machine: ${error.response?.data || error.message}`,
                500,
            );
        }
    }


    async worker2VM(addressip, network, hostname, tenant, gateway, hypervisor){
        console.log(hostname)
        const installation_endpoint = `${this.VM_AGENTS[hypervisor]}`
        const worker2_payload = JSON.stringify({
            "addressip": addressip,
            "hostname": hostname,
            "gateway": gateway,
            "nameserver": "10.0.0.11",
            "RAM": 6144,
            "CPU": 8,
            "hostnamevm": hostname.split(".")[0],
            "size": 40,
            "proxy": "freeipa02-shared.winu.fr",
            "network": network,
            "tenant_name": tenant,
            "template_name": "worker"
        })
        try {
            const response = await axios.post(installation_endpoint, worker2_payload, {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log(`Configuration response: ${response.data}`);
            return response.data;
        } catch (error) {
            console.error(`Error during VM setup: ${error.message}`);
            // Handle the error and rethrow as an HTTP exception
            throw new HttpException(
                `Error creating virtual machine: ${error.response?.data || error.message}`,
                500,
            );
        }
    }



    async launchVMs(mh, wh2, wh3, hypervisor){
        const startCommand = `virsh start ${mh.split('.')[0]} && virsh start ${wh2.split('.')[0]} && virsh start ${wh3.split('.')[0]}`
        const execURL = `${this.EXEC_AGENTS[hypervisor]}`

        try {
            const response = await axios.post(execURL, JSON.stringify({"command": startCommand}),{
                headers: { 'Content-Type': 'application/json' },
            });
            console.log(`Configuration response: ${response.data}`);
            return response.data;
        } catch (error) {
            console.error(`Error during VM Start: ${error.message}`);
            // Handle the error and rethrow as an HTTP exception
            throw new HttpException(
                `Error Starting virtual machine: ${error.response?.data || error.message}`,
                500,
            );
        }
      
       
  }
}
