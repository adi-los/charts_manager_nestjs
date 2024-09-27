import { Injectable, Logger, HttpException } from '@nestjs/common';
import { VMService } from 'src/vms/vms.service';
import { RancherService } from 'src/rancher/rancher.service';
import axios from 'axios';
import * as time from 'timers/promises'; // For sleep functionality
import { VMspecsDto } from 'src/dto/deploy-params.dto';
import { SshService } from 'src/ssh/ssh.service';
import { ChartsService } from 'src/charts/charts.service';

@Injectable()
export class ClusterService {
  private readonly logger = new Logger(ClusterService.name);
  private readonly CHARTS_PATH = '/tmp/all-charts'; // Set your charts path here

  constructor(
    private readonly vmService: VMService,
    private readonly rancherService: RancherService,
    private readonly sshService: SshService,
    private readonly ChartService: ChartsService,
  ) {}

  async deployAllCharts(
    masterIp: string,
    worker1Ip: string,
    worker2Ip: string,
    hypervisor: string,
    clusterName: string,
    username: string,
    password: string,
    specs: VMspecsDto,
  ): Promise<void> {
    try {
      // Step 1: Deploy VMs
      await this.vmService.masterVM(masterIp, specs.network, specs.master_hostname, specs.tenant, specs.gateway, hypervisor);
      await this.vmService.worker1VM(worker1Ip, specs.network, specs.worker1_hostname, specs.tenant, specs.gateway, hypervisor);
      await this.vmService.worker2VM(worker2Ip, specs.network, specs.worker2_hostname, specs.tenant, specs.gateway, hypervisor);
      
      this.logger.log('Waiting for VMs to stabilize...');
      await time.setTimeout(15 * 60 * 1000); // Wait for 15 min

      // Step 2: Launch VMs
      await this.vmService.launchVMs(specs.master_hostname, specs.worker1_hostname, specs.worker2_hostname, hypervisor);
      await time.setTimeout(180000); // Wait for 120 seconds

      // Step 3: Initialize resources
      await Promise.all([
        this.sshService.initResources(masterIp),
        this.sshService.initResources(worker1Ip),
        this.sshService.initResources(worker2Ip),
      ]);

      // Step 4: Setup Rancher
      await this.rancherService.setupRancher(clusterName, masterIp, worker1Ip, worker2Ip, username, password);
      await time.setTimeout(520000); // Wait for 520 seconds

      // Step 5: Setup Workers nfs

      await this.ChartService.setupWorkerNodes(worker1Ip, worker2Ip)

      // Step 6: Setup Charts on Master
      await this.ChartService.setupChartsOnMaster(masterIp);

      // Step 7: Install Helm on Master
      await this.installHelm(masterIp);

      // Step 8: Install MetalLB
      await this.installMetalLB(masterIp);

      // Step 9: Setup NFS
      await this.setupNFS(masterIp);

      // Step 10: Apply local storage classes, namespaces, and service-account-helm
      await this.applyK8sConfigs(masterIp);

      // Step 11: Deploy Traefik with TLS secret
      await this.deployTraefik(masterIp);

      // Step 12: Install NFS chart
      await this.installNFSChart(masterIp, specs.master_hostname);

      // Step 13: Install Vault with secret
      await this.installVault(masterIp);

      // Step 14: External-secrets deployment
      await this.deployExternalSecrets(masterIp);

      // Step 15: Cluster Store Secrets deployment and webhook adjustment
      await this.applySecretsConfig(masterIp);

      // Step 16: ArgoCD chart installation
      await this.installArgoCD(masterIp);

      // Step 17: Deploy Grafana and Prometheus
      await this.deployMonitoringTools(masterIp);

      this.logger.log('All charts deployed successfully!');
    } catch (error) {
      this.logger.error(`Failed to deploy all charts: ${error.message}`);
      throw new HttpException(`Deployment failed: ${error.message}`, 500);
    }
  }

  private async installHelm(masterIp: string) {
    const helmInstallCmd = `
      curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 && \
      chmod 700 get_helm.sh && \
      ./get_helm.sh
    `;
    await this.sshService.executeSshCommand(masterIp, helmInstallCmd);
  }

  private async installMetalLB(masterIp: string) {
    await this.sshService.kubectlApply(`${this.CHARTS_PATH}/chart/appli/chart-metallb/crds.yaml`, masterIp);
    await time.setTimeout(5000);
    await this.sshService.kubectlApply(`${this.CHARTS_PATH}/chart/appli/chart-metallb/ipaddresspool.yaml`, masterIp);
    await this.sshService.kubectlApply(`${this.CHARTS_PATH}/chart/appli/chart-metallb/l2addvertisment.yaml`, masterIp);
  }

  private async setupNFS(masterIp: string) {
    const nfsSetupCmds = `
      yum install -y nfs-utils && \
      mkdir -p /srv/nfs/kubedata && \
      chown -R nobody:nobody /srv/nfs/kubedata && \
      chmod 755 /srv/nfs/kubedata && \
      echo '/srv/nfs/kubedata *(rw,sync,no_subtree_check,no_root_squash,insecure)' >> /etc/exports && \
      systemctl enable --now nfs-server && \
      exportfs -rav && \
      systemctl restart nfs-server
    `;
    await this.sshService.executeSshCommand(masterIp, nfsSetupCmds);
  }

  private async applyK8sConfigs(masterIp: string) {
    await this.sshService.kubectlApply(`${this.CHARTS_PATH}/chart/appli/localstorageclass`, masterIp);
    await this.sshService.kubectlApply(`${this.CHARTS_PATH}/chart/appli/namespcesyamls`, masterIp);
    await this.sshService.kubectlApply(`${this.CHARTS_PATH}/chart/appli/service-account-helm`, masterIp);
  }

  private async deployTraefik(masterIp: string) {
    await this.sshService.executeSshCommand(masterIp, `kubectl create secret tls traefik-tls -n traefik --cert='${this.CHARTS_PATH}/traefik_ssl/tls.pem' --key='${this.CHARTS_PATH}/traefik_ssl/tls-key.pem'`);
    await this.sshService.helmInstall('traefik', `${this.CHARTS_PATH}/chart/traefik`, masterIp, `--values ${this.CHARTS_PATH}/chart/traefik/ovveride-value.yaml -n traefik`);
  }

  private async installNFSChart(masterIp: string, masterHostname: string) {
    await this.sshService.helmInstall('nfs-subdir-external-provisioner', `${this.CHARTS_PATH}/chart/chart-nfs`, masterIp, `--set nfs.server=${masterHostname} --set nfs.path=/srv/nfs/kubedata`);
  }

  private async installVault(masterIp: string) {
    await this.sshService.executeSshCommand(masterIp, `kubectl create secret tls vault-tls -n vault --cert='${this.CHARTS_PATH}/vault_ssl/tls.pem' --key='${this.CHARTS_PATH}/vault_ssl/tls-key.pem'`);
    await this.sshService.helmInstall('vault', `${this.CHARTS_PATH}/chart/vault-helm`, masterIp, `--values ${this.CHARTS_PATH}/chart/vault-helm/values.yaml --namespace vault --set 'server.dev.enabled=true'`);
  }

  private async deployExternalSecrets(masterIp: string) {
    await this.sshService.kubectlApply(`${this.CHARTS_PATH}/chart/external-secrets/crds/bundle.yaml`, masterIp);
    await this.sshService.helmInstall('external-secrets', `${this.CHARTS_PATH}/chart/external-secrets`, masterIp, '--version 1.0.0 -n external-secrets --set installCRDs=true');
  }

  private async applySecretsConfig(masterIp: string) {
    await this.sshService.kubectlApply(`${this.CHARTS_PATH}/chart/appli/vault/storage.yaml`, masterIp);
  }

  private async installArgoCD(masterIp: string) {
    await this.sshService.executeSshCommand(masterIp, 'kubectl create namespace argo-cd');
    await this.sshService.helmInstall('argocd', `${this.CHARTS_PATH}/chart/argo-cd-chart`, masterIp, `-f${this.CHARTS_PATH}/chart/argo-cd-chart/values.yaml -n argo-cd`);
  }

  private async deployMonitoringTools(masterIp: string) {
    await this.sshService.helmInstall('grafana', `${this.CHARTS_PATH}/chart/grafana`, masterIp, `-f ${this.CHARTS_PATH}/chart/grafana/values.yaml -n monitoring`);
    await this.sshService.helmInstall('prometheus', `${this.CHARTS_PATH}/chart/prometheus`, masterIp, `-f ${this.CHARTS_PATH}/chart/prometheus/values.yaml -n monitoring`);
  }

}

