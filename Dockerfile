FROM wordpress:php8.1-apache
MAINTAINER Marcus Grant <marcusfg@gmail.com>
LABEL Description="My personal site's WordPress testing container"

# Add sudo to run wp-cli as www-data user & less,mysqlclient for wpcli
# RUN apt-get update && apt-get install -y less mysql-client
RUN apt-get update && apt-get install -y sudo less

# https://bit.ly/3M97nAu
# Add wp-cli
RUN curl -o /bin/wp-cli.phar https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
RUN echo "sudo -E -u www-data /bin/wp-cli.phar \"$@\"" > /bin/wp
RUN chmod +x /bin/wp-cli.phar /bin/wp

# Copy over theme unittest content XML
# COPY ./wordpress/themeunittestdata.wordpress.xml /etc/themeunittestdata.wordpress.xml
# RUN /bin/wp import /tmp/themeunittestdata.wordpress.xml

# Cleanup
RUN apt-get clean
RUN rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
