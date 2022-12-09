#!/usr/bin/env sh

mkdir -p /etc/nginx/certs

echo "$NGINX_CERT" | tr ';' '\n' > /etc/nginx/certs/certificate.crt
echo "$NGINX_CERT_KEY" | tr ';' '\n' > /etc/nginx/certs/certificate.key

nginx -g 'daemon off;'