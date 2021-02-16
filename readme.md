# Description

A functional web application to keep track of your crypto currency transactions. Rather than a full practical application, this is more of an exploration of a microservice architecture components including databases, event buses, and distributed caching.

## Architecture

![arch](doc/arch.png)

The architecture diagram above consists of:

- Account service (account management and login capability)
- Transactions service (managing crypto transactions)
- API gateway (WIP)
- RabbitMQ (event bus to communicate between the account and transaction services)
- MySQL (DB for each service)
- Redis (for caching latest prices to avoid multiple round trips to external provider)
- Angular client. See bottom for screenshots

The components with dashed borders are infrastructure components that can be stood up with the docker compose file docker-compose-i.yml.

## Nuget packages
- Pomelo MySQL
- StackExchangeRedis
- Polly
- Swashbuckle
- EasyNetQ

#### Todo
- Add API gateway
- Incorporate external API service to obtain current cryptocurrency prices


#### Angular client screenshots

Login page
![login](doc/client-login.png)

Register page
![register](doc/client-register.png)

Main page
![main screen](doc/client-main.png)

Main page mobile
![responsive](doc/client-mobile.png)
