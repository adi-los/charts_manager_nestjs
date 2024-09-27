import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RancherService {
  async setupRancher(
    clusterName: string,
    masterIp: string,
    worker1Ip: string,
    worker2Ip: string,
    username: string,
    password: string
  ): Promise<void> {
    const clusterPayload = {
      name: clusterName,
      kubernetes_version: 'v1.28.12-rancher1-1',
      network_plugin: 'flannel',
      ingress_provider: 'nginx',
    };

    try {
      // Step 1: Create the cluster and get the cluster_id
      const response = await axios.post('http://localhost:8200/api/rancher/create_cluster', clusterPayload);
      const clusterId = response.data.id; // Assuming 'id' is the key for cluster_id

      if (clusterId) {
        console.log(response.data);
        console.log(`Cluster creation successful, cluster ID: ${clusterId}`);

        // Wait for cluster creation to settle
        await this.delay(90000);

        // Step 2: Register master node
        await this.registerNode(clusterId, 'master', masterIp, username, password);

        // Step 3: Register Worker 1 node
        await this.registerNode(clusterId, 'worker', worker1Ip, username, password);

        // Step 4: Register Worker 2 node
        await this.registerNode(clusterId, 'worker', worker2Ip, username, password);

        // Step 5: Fetch kubeconfig after all nodes are registered
        const kubeconfigPayload = {
          master_ip: masterIp,
          username: username,
          password: password,
          cluster_id: clusterId,
        };

        const kubeconfigResponse = await axios.post('http://127.0.0.1:8200/api/rancher/kubeconfig', kubeconfigPayload);
        console.log('Kubeconfig fetched successfully:');
        console.log(kubeconfigResponse.data);
      } else {
        console.log('Cluster creation successful, but no cluster ID found in response');
      }
    } catch (error) {
      console.error(`Error occurred during cluster creation or node registration: ${error.message}`);
      throw new InternalServerErrorException('Failed to set up Rancher cluster.');
    }
  }

  private async registerNode(clusterId: string, role: string, ip: string, username: string, password: string): Promise<void> {
    const registrationPayload = {
      cluster_id: clusterId,
      role: role,
      ip: ip,
      username: username,
      password: password,
    };

    try {
      const response = await axios.post('http://localhost:8200/api/rancher/register_node', registrationPayload);

      if (response.status === 200) {
        console.log(`${role.charAt(0).toUpperCase() + role.slice(1)} node registered successfully with IP: ${ip}`);
      } else {
        console.log(`Failed to register ${role}: ${response.status} ${response.data}`);
        throw new InternalServerErrorException(`Failed to register ${role} node.`);
      }

      // Wait for node registration to settle
      await this.delay(30000);
    } catch (error) {
      console.error(`Error registering ${role} node: ${error.message}`);
      throw new InternalServerErrorException(`Failed to register ${role} node.`);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
