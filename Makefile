build:
	docker compose -f docker-compose.production.yaml up --build -d --remove-orphans
up:
	docker compose -f docker-compose.production.yaml up -d
down:
	docker compose -f docker-compose.production.yaml down
show_logs:
	docker compose -f docker-compose.production.yaml logs