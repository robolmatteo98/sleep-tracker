# SLEEP TRACKER

# PRIMO UTILIZZO
## Creazione db
docker run --name my-postgres -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=password -e POSTGRES_DB=sleep_db -p <host_free_port>:5432 -d postgres

docker cp db/4-sleep_data_2025-02-11.csv my-postgres:/4-sleep_data_2025-02-11.csv

docker exec -it my-postgres psql -U admin -d sleep_db

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_enc VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
)

CREATE TABLE sleep_day (
  id SERIAL PRIMARY KEY,
  day DATE NOT NULL,
  fk_users INTEGER NOT NULL,
  CONSTRAINT fk_sleep_day_users FOREIGN KEY (fk_users) REFERENCES users(id)
);

CREATE TABLE sleep_data (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP NOT NULL,
  sleep_stage VARCHAR(50) NOT NULL,
  fk_sleep_day INTEGER,
  CONSTRAINT fk_sleep_data_format_sleep_day FOREIGN KEY (fk_sleep_day) REFERENCES sleep_day(id)
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
