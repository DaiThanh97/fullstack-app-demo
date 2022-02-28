bootstrap-infra:
	@echo "==============================Bootstrapping architecture==============================" 
	helm repo add bitnami https://charts.bitnami.com/bitnami
	cd ./infra/helm && \
	helm install ingress bitnami/nginx-ingress-controller && \
	helm install redis --values redis.yaml bitnami/redis && \
	helm install nats --values nats.yaml bitnami/nats && \
	helm install mysql --values mysql.yaml bitnami/mariadb && \
	helm install mongodb --values mongodb.yaml bitnami/mongodb

bootstrap-server:
	@echo "==============================Preparing Images========================================" 
	docker build -t setel/orders ./backend/orders
	docker build -t setel/payment ./backend/payment
	docker build -t setel/gateway ./backend/gateway

	@echo "==============================Bootstrapping K8s=======================================" 
	k apply -f ./infra/k8s
	k apply -f ./infra/ingress

	@echo "==============================Bootstrapping Frontend===================================" 
	cd frontend && yarn start

	@echo "==============================Waiting for bootstrapping...============================="
	sleep 10

	@echo "Application is up and running. Now you can access application through http://localhost:3000"

cleanup:
	@echo "==============================Shutting down application==============================" 
	helm delete mongodb mysql nats redis
	k delete -f ./infra/k8s
	k delete -f ./infra/ingress
	
	@echo "==============================Processing...=============================="
	sleep 5

	@echo "Shut down complete"