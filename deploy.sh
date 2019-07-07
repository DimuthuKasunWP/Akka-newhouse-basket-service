#!/bin/bash
set -eu

# Use SSH Private key for authentication with Kubernetes cluster
eval $(ssh-agent)
ssh-add <(echo "$KUBE_SSH_PRIVATE_KEY")
echo "$KUBE_SSH_PRIVATE_KEY" > ./id_rsa_kubernetes

# Install 'azure-cli' and other tools
echo "Installing tools..."
apt-get update && apt-get install apt-transport-https
echo "deb [arch=amd64] https://packages.microsoft.com/repos/azure-cli/ wheezy main" | \
     tee /etc/apt/sources.list.d/azure-cli.list
apt-key adv --keyserver packages.microsoft.com --recv-keys 417A0893
apt-get update && apt-get install azure-cli
apt-get install jq

# Login into Kubernetes cluster
echo "Login Kubernetes cluster..."
az login --service-principal -u $AZURE_SERVICE_PRINCIPAL_USER --password "$AZURE_SERVICE_PRINCIPAL_PASSWORD" --tenant $AZURE_TENANT > /dev/null
az acs kubernetes get-credentials --resource-group=${AZURE_RESOURCEGROUP} --name=${ENVIRONMENT} --ssh-key-file ./id_rsa_kubernetes
az acs kubernetes install-cli

# Prepare templates
echo "Prepare templates..."
cd deployment
yarn install
yarn start

# Deleting existing and create new service and ingress
echo "Start deployment of service..."
kubectl apply -f ./service.yaml
kubectl apply -f ./ingress.yaml
kubectl apply -f ./deployment.yaml

# wait for deployed state
deployment_json=$(kubectl get deployment/$REPOSITORYNAME -o json)
desiredReplicas=$(echo $deployment_json | jq -r ".spec.replicas")
updatedReplicas=0
iterations=0
while [ "$updatedReplicas" -lt "$desiredReplicas" ]
do
  echo "Waiting for deployment to finish... Updated replicas: $updatedReplicas"
  sleep 5s
  deployment_json=$(kubectl get deployment/$REPOSITORYNAME -o json)
  updatedReplicas=$(echo $deployment_json | jq -r ".status.updatedReplicas")
  iterations=$((iterations+1))
  if [[ "$iterations" == "10" ]]
  then
    kubectl rollout undo deployment/$REPOSITORYNAME
    break
  fi
done




