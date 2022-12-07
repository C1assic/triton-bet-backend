build:
	docker compose -f docker-compose.production up --build -d --remove-orphans
up:
	docker compose -f docker-compose.production up -d
down:
	docker compose -f docker-compose.production down
show_logs:
	docker compose -f docker-compose.production logs