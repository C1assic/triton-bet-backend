FROM nginx:1.23.2-alpine as base

COPY ./start-nginx.sh /start-nginx.sh

RUN chmod +x /start-nginx.sh

FROM base as production
COPY ./production.conf /etc/nginx/conf.d/default.conf
EXPOSE 443
CMD [ "/start-nginx.sh" ]

FROM base as development
COPY ./development.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD [ "/start-nginx.sh" ]