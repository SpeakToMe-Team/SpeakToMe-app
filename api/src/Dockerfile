FROM php:7.1-fpm

ENV APP_HOME /app

RUN apt-get update && apt-get install -y \  
      libicu-dev \
      libpq-dev \
      libmcrypt-dev \
      git \
      zip \
      unzip \
    && rm -r /var/lib/apt/lists/* \
    && docker-php-ext-configure pdo_mysql --with-pdo-mysql=mysqlnd \
    && docker-php-ext-install \
      intl \
      mbstring \
      mcrypt \
      pcntl \
      pdo_mysql \
      pdo_pgsql \
      pgsql \
      zip \
      opcache

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin/ --filename=composer

RUN mkdir -p /usr/local/laravel && \
    composer require --working-dir=/usr/local/laravel "laravel/installer" && \
    chmod -R 777 /usr/local/laravel

RUN mkdir -p /.composer && chmod 777 /.composer

RUN mkdir -p $APP_HOME
COPY ./src $APP_HOME
WORKDIR $APP_HOME/speakToMe-api

RUN composer install --no-interaction

RUN chown -R www-data:www-data $APP_HOME