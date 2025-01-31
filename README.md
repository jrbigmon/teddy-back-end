
# Encurtador de URL

## Descrição e regras

Essa API tem como objetivo encutar URLs fornecidas, contabilizar os clicks realizados e redirecionar os usuarios para a rota original.

As seguintes regras para a utilização são as seguintes:
- Qualquer usuário pode encutar uma URL, porém se não estiver devidamente autenticado e a mesma não pertencer a ele, não poderá remove-la, edita-la ou visualizar a contagem de clicks realizados.
- Qualquer usuário pode listar todas as URLs criadas.
- Qualquer usuário pode buscar uma URL pelo ID, porém os clicks só serão apresentados valores diferentes de nullo se estiver devidamente autenticado.
- Quando autenticado é listado apenas as URLs que pertençam ao usuário.


## Compatibilidade de versão Node

| Node Version         | Link                           |
| :------------------- | :----------------------------- |
| `>=18.17.0 <=23.6.0` | https://nodejs.org/en/download |
|                      |                                |

## Requisitos
Com docker
- Docker 
- Docker compose

Local
- Node >=18.17.0v <=23.6.0v
- Redis (localhost)


## Variáveis de Ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu .env.

Você pode escolher usar ambiente de demonstração (`demo`) ou desenvolvimento (`development`).

Oriente-se pelo `.env.sample` caso necessário.

- Demonstração
  ```bash
  # ENV
  NODE_ENV=demo

  # AUTH DATABASE
  AUTH_DATABASE_HOST=auth_db
  AUTH_DATABASE_PORT=5432
  AUTH_DATABASE_USER=auth_user
  AUTH_DATABASE_PASSWORD=password
  AUTH_DATABASE_NAME=auth
  AUTH_DATABASE_DIALECT=postgres
  AUTH_DATABASE_EMAIL=user@localhost.com

  # URL SHORTENER DATABASE
  URL_SHORTENER_DATABASE_HOST=url_shortener_db
  URL_SHORTENER_DATABASE_PORT=5432
  URL_SHORTENER_DATABASE_USER=url_shortener_user
  URL_SHORTENER_DATABASE_PASSWORD=password
  URL_SHORTENER_DATABASE_NAME=url_shortener
  URL_SHORTENER_DATABASE_DIALECT=postgres
  URL_SHORTENER_DATABASE_EMAIL=user@localhost.com

  # SECRETS
  JWT_SECRET=JRBIGMON

  # REDIS
  REDIS_HOST=redis_service
  REDIS_PORT=6379

  # SERVICES
  AUTH_PORT=3001
  URL_SHORTENER_PORT=3000
  ```

- Desenvolvimento
  ```bash
  # ENV
  NODE_ENV=development

  # AUTH DATABASE
  AUTH_DATABASE_HOST=:memory:
  AUTH_DATABASE_PORT=
  AUTH_DATABASE_USER=
  AUTH_DATABASE_PASSWORD=
  AUTH_DATABASE_NAME=auth
  AUTH_DATABASE_DIALECT=sqlite
  AUTH_DATABASE_EMAIL=

  # URL SHORTENER DATABASE
  URL_SHORTENER_DATABASE_HOST=:memory:
  URL_SHORTENER_DATABASE_PORT=
  URL_SHORTENER_DATABASE_USER=
  URL_SHORTENER_DATABASE_PASSWORD=
  URL_SHORTENER_DATABASE_NAME=url_shortener
  URL_SHORTENER_DATABASE_DIALECT=sqlite
  URL_SHORTENER_DATABASE_EMAIL=

  # SECRETS
  JWT_SECRET=JRBIGMON

  # REDIS
  REDIS_HOST=localhost
  REDIS_PORT=6379

  # SERVICES
  AUTH_PORT=3001
  URL_SHORTENER_PORT=3000
  ```



## Clonar e rodar

- Clonar

  ```bash
  git clone git@github.com:jrbigmon/teddy-back-end.git
  ```



### Rodar usando docker compose

- Acessar o repositório
  ```bash
  cd teddy-back-end
  ```

- Criar o arquivo `.env` e colar as variáveis de ambiente.
  ```bash
  cat > .env <<EOF
  # ENV
  NODE_ENV=demo

  # AUTH DATABASE
  AUTH_DATABASE_HOST=auth_db
  AUTH_DATABASE_PORT=5432
  AUTH_DATABASE_USER=auth_user
  AUTH_DATABASE_PASSWORD=password
  AUTH_DATABASE_NAME=auth
  AUTH_DATABASE_DIALECT=postgres
  AUTH_DATABASE_EMAIL=user@localhost.com

  # URL SHORTENER DATABASE
  URL_SHORTENER_DATABASE_HOST=url_shortener_db
  URL_SHORTENER_DATABASE_PORT=5432
  URL_SHORTENER_DATABASE_USER=url_shortener_user
  URL_SHORTENER_DATABASE_PASSWORD=password
  URL_SHORTENER_DATABASE_NAME=url_shortener
  URL_SHORTENER_DATABASE_DIALECT=postgres
  URL_SHORTENER_DATABASE_EMAIL=user@localhost.com

  # SECRETS
  JWT_SECRET=JRBIGMON

  # REDIS
  REDIS_HOST=redis_service
  REDIS_PORT=6379

  # SERVICES
  AUTH_PORT=3001
  URL_SHORTENER_PORT=3000
  EOF
  ```

- Iniciar o projeto com docker compose
  ```bash
  docker compose up --build
  ```

### Rodar localmente

- Acessar o repositório
  ```bash
  cd teddy-back-end
  ```

- Instalar as dependências
  ```bash
  yarn install
  ```

- Criar o arquivo `.env` e colar as variáveis de ambiente.
  ```bash
  cat > .env <<EOF
  # ENV
  NODE_ENV=development

  # AUTH DATABASE
  AUTH_DATABASE_HOST=:memory:
  AUTH_DATABASE_PORT=
  AUTH_DATABASE_USER=
  AUTH_DATABASE_PASSWORD=
  AUTH_DATABASE_NAME=auth
  AUTH_DATABASE_DIALECT=sqlite
  AUTH_DATABASE_EMAIL=

  # URL SHORTENER DATABASE
  URL_SHORTENER_DATABASE_HOST=:memory:
  URL_SHORTENER_DATABASE_PORT=
  URL_SHORTENER_DATABASE_USER=
  URL_SHORTENER_DATABASE_PASSWORD=
  URL_SHORTENER_DATABASE_NAME=url_shortener
  URL_SHORTENER_DATABASE_DIALECT=sqlite
  URL_SHORTENER_DATABASE_EMAIL=

  # SECRETS
  JWT_SECRET=JRBIGMON

  # REDIS
  REDIS_HOST=localhost
  REDIS_PORT=6379

  # SERVICES
  AUTH_PORT=3001
  URL_SHORTENER_PORT=3000
  EOF
  ```

## Documentação da API

- Auth Open API Swagger
  ```http
  GET http://localhost:3001/api
  ```

- Url shortener Open API Swagger
  ```http
  GET http://localhost:3000/api
  ```

## Melhorias para escalar horizontalmente
- Adicionar caching nas rotas de busca de URLs.
- Utilizar filas para persistência das URLs no banco de dados, evitando problemas de indisponibilidade do banco não criar a URL, suportando mais requisições.
  - Prós: Resiliência ao persistir os dados; Suportar mais requisições simultâneas sem delay da persistência do banco de dados, já que persistir em memória é mais rápido do que em disco.
  - Contras: Delay entre a persistência dos dados e a consulta do mesmo, caso venha ter consultas simultâneas a criação.


## Referências

 - [Docker](https://www.docker.com/)
 - [NestJs](https://nestjs.com/)
 - [Node](https://nodejs.org/en)
 - [Redis](https://redis.io/)
 - [Nest Bull](https://github.com/nestjs/bull)
 - [Sequelize](https://sequelize.org/)
 - [Jest](https://jestjs.io/pt-BR/)
 - [Swagger](https://swagger.io/)

