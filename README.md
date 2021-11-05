# Sistemas Operativos 1, Segundo Semestre 2021, SquidGame

## Requisitos
- Cloud Shell
## Iniciando Cluster
*Nota: all-in y all-out son reglas de firewall que permiten todo el trafico*
```
gcloud container clusters create proyecto-cluster --num-nodes=3 --tags=all-in,all-out --machine-type=n1-standard-1 --no-enable-network-policy --region=us-central1-a --project={PROJECT-ID}
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
*Nota: Una correcta inyeccion deberia crear 2 pods*
```
kubectl get deployment nginx-ingress-ingress-nginx-controller -n nginx-ingress  -o yaml | linkerd inject - | kubectl apply -f -
kubectl get pods -n nginx-ingress 
```
### Obtener IP de Ingress Load Balancer
```
kubectl get svc -n nginx-ingress
```
## Deploy de Proyecto
```
kubectl apply -f main.yaml
```
## 
