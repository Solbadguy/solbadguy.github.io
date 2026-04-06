---
title: "Получаем WildCard от Let’s Encrypt"
date: 2022-11-07
categories: 
  - "unix"
tags: 
  - "lets-encrypt"
  - "linux"
  - "ssl"
---

Немного о том как вручную получить WildCard для домена и его поддоменов, используя верификацию через dns record.

<!--more-->

Установим certbot

```
apt install certbot -y
```

Протестируем

```
sudo certbot --dry-run --manual --agree-tos --preferred-challenges dns certonly --server https://acme-v02.api.letsencrypt.org/directory -d *.netlab-kursk.ru -d netlab-kursk.ru
```

Важный момент  - в процессе работы certbot попросит добавить две txt-записи на вашем DNS-сервере. (ttl выставляем 60 сек)

Статус обновления DNS-записей удобно отслеживать тут - [https://toolbox.googleapps.com/apps/dig/#TXT/](https://toolbox.googleapps.com/apps/dig/#TXT/),

либо через cli и утилиту dig

```
dig -t txt _acme-challenge.netlab-kursk.ru
```

Получим сертификаты

```
sudo certbot --manual --agree-tos --manual-public-ip-logging-ok --preferred-challenges dns certonly --server https://acme-v02.api.letsencrypt.org/directory -d *.netlab-kursk.ru -d netlab-kursk.ru

```

Искать тут

```
/etc/letsencrypt/live/
```
