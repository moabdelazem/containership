# Kubernetes

Kubernetes (K8s) is an open-source container orchestration platform that automates the deployment, scaling, and management of containerized applications.

## Kubernetes Features

- **Container Orchestration**: Manages multiple containers across multiple hosts
- **Auto-Scaling**: Easily scale applications up or down based on demand
- **Automated Rollouts and Rollbacks**: Automatically roll out changes to applications and roll back if something goes wrong
- **Self-Healing**: Automatically restarts failed containers, replaces and reschedules containers when nodes die
- **Load Balancing**: Distributes network traffic to ensure stable application performance
- **Service Discovery**: Automatically discovers services and manages service-to-service communication

## Kubernetes Key Benefits

- **Efficiency**: Optimizes resource utilization and reduces infrastructure costs
- **Vendor Agnostic**: Runs anywhere, on any cloud provider or on-premises infrastructure
- **Flexibility**: Supports a wide range of applications and workloads
- **Community Support & Large Ecosystem**: Benefits from a vast ecosystem of tools, plugins, and a strong community for support and collaboration

## Getting Started with Kubernetes

In this repository, we will use a local Minikube cluster to deploy and manage containerized applications,
i come with the kubectl command-line tool to interact with the cluster.

```bash
# Check kubectl installation
kubectl version --client

# Get cluster information
kubectl cluster-info

# List all resources
kubectl api-resources
```

## Kubernetes Architecture

Kubernetes follows a master-worker architecture, consisting of the following components:

- **Master Node**: Manages the cluster and coordinates all activities
  - **API Server**: Exposes the Kubernetes API
  - **Controller Manager**: Ensures the desired state of the cluster
  - **Scheduler**: Assigns workloads to worker nodes
  - **etcd**: A distributed key-value store for storing cluster data

- **Worker Nodes**: Run the containerized applications
  - **Kubelet**: An agent that runs on each worker node and ensures containers are running in a Pod
  - **Kube-Proxy**: Manages network rules and load balancing
  - **Container Runtime**: Software that runs containers (e.g., Docker, containerd)

![Kubernetes Architecture](assets/k8s-architecture.gif)