# SLEEP TRACKER

# PRIMO UTILIZZO
## Creazione db
docker run --name my-postgres -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=password -e POSTGRES_DB=sleep_db -p <host_free_port>:5432 -d postgres

docker cp db/4-sleep_data_2025-02-11.csv my-postgres:/4-sleep_data_2025-02-11.csv

docker exec -it my-postgres psql -U admin -d sleep_db

CREATE TABLE sleep_data (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP NOT NULL,
  sleep_stage VARCHAR(50) NOT NULL
);

COPY sleep_data_format(timestamp, sleep_stage)
FROM '/4-sleep_data_2025-02-11.csv'
DELIMITER ','
CSV HEADER;

## Setting docker
docker network create app-network

docker network connect app-network <nome_container>


# UTILIZZO SVILUPPATORE (sviluppo - dev)
## Avviare il db
docker start <container-id>

## Avviare il back-end (sviluppo)
cd sleep-backend-api
npm i
node index.js

## Avviare il front-end (sviluppo)
cd sleep-frontend
npm i
npm run dev


# UTILIZZO PRODUZIONE
## Avvio il db
docker start <container-id>

## Avvio automatico applicazione
docker compose up
