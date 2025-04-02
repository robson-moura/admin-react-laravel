FROM php:8.1-fpm

# Atualizar pacotes e instalar dependências necessárias
RUN apt update \
    && apt install -y zlib1g-dev g++ git libicu-dev zip libzip-dev unzip curl vim \
    && docker-php-ext-install intl opcache pdo pdo_mysql \
    && docker-php-ext-configure zip \
    && docker-php-ext-install zip

# Instalar o Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Configurar o diretório de trabalho
WORKDIR /var/www/projeto_base
