sudo docker container rm -f digital-queue-software digital-queue-mysql
sudo docker image rm -f digital-queue-software:latest
sudo docker network rm digital-queue-software_default
sudo docker-compose up -d
