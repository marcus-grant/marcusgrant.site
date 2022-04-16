#!/bin/sh

# HOST=$(echo $WORDPRESS_DB_HOST | cut -d: -f1)
# PORT=$(echo $WORDPRESS_DB_HOST | cut -d: -f2)
HOST="wp-db"
PORT="3306"
WORDPRESS_DB_NAME="wordpress"
WORDPRESS_DB_USER="admin"
WORDPRESS_DB_PASSWORD="pass"

until mysql -h $HOST -P $PORT -D $WORDPRESS_DB_NAME -u $WORDPRESS_DB_USER -p$WORDPRESS_DB_PASSWORD -e '\q'; do
  >&2 echo "Mysql is unavailable - sleeping..."
  sleep 2
done

wp core install \
  --path="/var/www/html" \
  --url="localhost" \
  --title="My Testing WordPress Site" \
  --admin_user=admin \
  --admin_password=pass \
  --admin_email=marcusfg@gmail.com \
  --skip-email

# wp import /etc/themeunittestdata.wordpress.xml --authors=create
