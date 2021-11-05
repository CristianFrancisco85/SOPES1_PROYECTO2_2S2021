# Sistemas Operativos 1, Segundo Semestre 2021, SquidGame

## Requisitos
- Cloud Shell
## Iniciando Cluster
```
gcloud container clusters create proyecto-cluster --num-nodes=3 --tags=all-in,all-out --machine-type=n1-standard-1 --no-enable-network-policy --region=us-central1-a --project={PROJECT-ID}
```
*Nota: all-in y all-out son reglas de firewall que permiten todo el trafico*
### Creando Namespace principal
```
kubectl create namespace squidgame
```

## Instalando NGINX Ingress Controller
```
kubectl create ns nginx-ingress
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx 
helm repo update 
helm install nginx-ingress ingress-nginx/ingress-nginx -n nginx-ingress
kubectl get services -n nginx-ingress
```
## Instalando Linkerd
```
curl -fsL https://run.linkerd.io/install | sh
linkerd version
linkerd check --pre
linkerd install | kubectl apply -f -
linkerd check
linkerd viz install | kubectl apply -f -
linkerd check
export PATH=$PATH:/home/{YOUR-USER}/.linkerd2/bin
linkerd viz dashboard
```
## Injectando NGINX ingress-controller
Una correcta inyeccion deberia crear 2 pods
```
kubectl get deployment nginx-ingress-ingress-nginx-controller -n nginx-ingress  -o yaml | linkerd inject - | kubectl apply -f -
kubectl get pods -n nginx-ingress 
```
### Obtener IP de Ingress Load Balancer
Esta IP debe ser remplazada el header *host* de la definicion del Ingress Service llamado *main-ingress*
```
kubectl get svc -n nginx-ingress
```
## Instalando Kafka con Strimzi
Esperaremos a que el servicio de Kafka este arriba
```
kubectl create -f 'https://strimzi.io/install/latest?namespace=squidgame' -n squidgame
kubectl apply -f https://strimzi.io/examples/latest/kafka/kafka-persistent-single.yaml -n squidgame
kubectl wait kafka/my-cluster --for=condition=Ready --timeout=300s -n kafka
```
## Deploy de Proyecto
```
kubectl apply -f main.yaml
```
