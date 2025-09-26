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

## Kubernetes Basic Unit

- The basic unit of deployment in Kubernetes is a **Pod**. A Pod is a group of one or more containers that share the same network namespace and storage.

- Pods can contain multiple containers that need to work together, such as a web server and a sidecar proxy.

### Pod Characteristics
- **Shared Network**: All containers in a Pod share the same IP address and port space
- **Shared Storage**: Containers can share volumes for data persistence
- **Lifecycle**: All containers in a Pod are scheduled together and share the same lifecycle
- **Ephemeral**: Pods are temporary and can be created, destroyed, and recreated as needed

```bash
# Create a simple Pod
kubectl run nginx --image=nginx:latest

# Get Pod information
kubectl get pods
kubectl describe pod nginx

# Delete a Pod
kubectl delete pod nginx
```

## Core Kubernetes Objects

### 1. Deployments
Deployments manage the desired state of Pods and provide declarative updates.

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.20
        ports:
        - containerPort: 80
```

```bash
# Apply deployment
kubectl apply -f deployment.yaml

# Scale deployment
kubectl scale deployment nginx-deployment --replicas=5

# Update deployment
kubectl set image deployment/nginx-deployment nginx=nginx:1.21
```

### 2. Services
Services provide stable network endpoints for accessing Pods.

```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: ClusterIP  # ClusterIP, NodePort, LoadBalancer, ExternalName
```

### 3. ConfigMaps and Secrets
Store configuration data and sensitive information separately from application code.

```bash
# Create ConfigMap
kubectl create configmap app-config --from-literal=database_url=postgresql://localhost:5432

# Create Secret
kubectl create secret generic db-secret --from-literal=username=admin --from-literal=password=secret123

# View ConfigMaps and Secrets
kubectl get configmaps
kubectl get secrets
```

### 4. Namespaces
Provide virtual clusters within a physical cluster for resource isolation.

```bash
# Create namespace
kubectl create namespace development
kubectl create namespace production

# List namespaces
kubectl get namespaces

# Switch context to namespace
kubectl config set-context --current --namespace=development
```

## Kubernetes Networking

### Pod-to-Pod Communication
- Each Pod gets its own IP address
- Pods can communicate directly using IP addresses
- Network policies can control traffic between Pods

### Services and Load Balancing
- **ClusterIP**: Internal cluster communication
- **NodePort**: Exposes service on each node's IP
- **LoadBalancer**: Exposes service externally using cloud provider's load balancer
- **ExternalName**: Maps service to external DNS name

```bash
# Expose deployment as a service
kubectl expose deployment nginx-deployment --port=80 --type=NodePort

# Get service endpoints
kubectl get endpoints
```

## Kubernetes Storage

### Volumes
- **emptyDir**: Temporary storage that exists for Pod lifetime
- **hostPath**: Mounts directory from host node
- **persistentVolumeClaim**: Request for persistent storage

### Persistent Volumes (PV) and Persistent Volume Claims (PVC)
```yaml
# pvc.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: web-storage
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
```

## Common kubectl Commands

```bash
# Cluster Information
kubectl cluster-info
kubectl get nodes
kubectl top nodes

# Pod Management
kubectl get pods -o wide
kubectl logs <pod-name>
kubectl exec -it <pod-name> -- /bin/bash
kubectl port-forward <pod-name> 8080:80

# Resource Management
kubectl get all
kubectl get deployments
kubectl get services
kubectl get pv,pvc

# Debugging
kubectl describe pod <pod-name>
kubectl describe service <service-name>
kubectl get events --sort-by=.metadata.creationTimestamp

# Configuration
kubectl config view
kubectl config get-contexts
kubectl config use-context <context-name>
```

## Kubernetes Best Practices

### 1. Resource Management
- Always set resource requests and limits
- Use horizontal Pod autoscaling (HPA) for dynamic scaling
- Implement proper health checks (liveness and readiness probes)

### 2. Security
- Use least privilege principle with RBAC
- Scan container images for vulnerabilities
- Use network policies to control traffic
- Store sensitive data in Secrets, not ConfigMaps

### 3. Configuration
- Use declarative configuration (YAML files)
- Version control your manifests
- Use labels and annotations effectively
- Implement proper logging and monitoring

### 4. High Availability
- Distribute Pods across multiple nodes
- Use PodDisruptionBudgets for maintenance
- Implement proper backup strategies
- Use multiple replicas for critical services

## Troubleshooting Guide

### Common Issues and Solutions

```bash
# Pod not starting
kubectl describe pod <pod-name>
kubectl logs <pod-name>

# Service not accessible
kubectl get endpoints <service-name>
kubectl describe service <service-name>

# Resource issues
kubectl top pods
kubectl top nodes
kubectl describe node <node-name>

# Network connectivity
kubectl exec -it <pod-name> -- nslookup <service-name>
kubectl exec -it <pod-name> -- curl <service-ip>:<port>
```

## Additional Resources To Check on it

- [Official Kubernetes Documentation](https://kubernetes.io/docs/)
- [Kubernetes API Reference](https://kubernetes.io/docs/reference/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Kubernetes Best Practices](https://kubernetes.io/docs/concepts/configuration/overview/)
