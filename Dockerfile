FROM nginx:1.27-alpine

# Configuration nginx personnalisée (gzip, cache, fallback)
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# On ne copie QUE ce qui sert en production (pas legacy/, notes/, uploads/, docs)
COPY index.html /usr/share/nginx/html/
COPY css/    /usr/share/nginx/html/css/
COPY js/     /usr/share/nginx/html/js/
COPY assets/ /usr/share/nginx/html/assets/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1
