---
title: "Let’s Encrypt сертификат для сайта. Centos\Nginx"
date: 2019-08-21
categories: 
  - "unix"
tags: 
  - "centos"
  - "https"
  - "lets-encrypt"
  - "nginx"
  - "ssl"
  - "sertifikat"
---

## **Установка бесплатного SSL сертификата Let’s Encrypt на Nginx на серверах под управлением ОС Centos.**

<!--more-->

* * *

**Установка Git**

```
yum install git
```

**Получение файлов Let’s Encrypt certbot в папку /tmp**

```
cd /tmp; git clone https://github.com/certbot/certbot
```

**Выставляем права на запуск**

```
cd certbot; chmod a+x ./certbot-auto
```

**Выпускаем сертификат**

```
./certbot-auto certonly --webroot --agree-tos --email admin@site.ru -w /home/bitrix/www/public/ -d site.ru -d www.site.ru
```

**Установка сертификата (SSL должен быть настроен)**

```
ssl_certificate /etc/letsencrypt/live/site.ru/fullchain.pem;ssl_certificate_key /etc/letsencrypt/live/site.ru/privkey.pem;
```

**Перезагрузка Nginx**

```
service nginx reload
```

**Периодическое обновление через Cron**

```
crontab -e* 1 * * 1 /tmp/certbot/certbot-auto renew --quietservice crond restart
```

Источник: [https://wsrubi.ru/blog/SSL-sertifikat\_Let-s\_Encrypt\_na\_Centos\_dlya\_Nginx/](https://wsrubi.ru/blog/SSL-sertifikat_Let-s_Encrypt_na_Centos_dlya_Nginx/)
