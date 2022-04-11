FROM wordpress:php7.4-apache

COPY packages/mars-theme /var/www/html/wp-content/themes/mars-theme/
# COPY plugins /var/www/html/wp-content/plugins/
