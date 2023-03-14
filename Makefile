all:
	docker compose up -d
clean:
	docker compose down

fclean: clean
	docker compose down --rmi all
	docker system prune -af
	 docker volume rm $$(docker volume ls -q)
studio:
	docker exec ft_transcendence-backend-1  npx prisma studio