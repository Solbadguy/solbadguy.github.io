---
title: "connect to nextcloud waiting for authorization"
date: 2020-10-30
categories: 
  - "ubuntu-server"
tags: 
  - "nextcloud"
---

Не так давно мне потребовалось настроить крайнюю версию Nextcloud -a на виртуальной машине. В данной заметке пойдет речь об одной из ошибок, которые пришлось решать на пути к его полноценной работе.<!--more-->

**Дано:**

- Ubuntu srv 20.04
- Nextcloud 20
- Клиентское приложение под Debian в формате .appimage.

* * *

**Проблема:**

Клиент настольной синхронизации никак не может авторизоваться в клауде.

* * *

**Решение:**

Правим файл /var/nextcloud/config/config.php

Добавим туда строки

```
'overwrite.cli.url' => 'https://example.com',
 'overwriteprotocol' => 'https',
 'overwritehost' => 'example.com',
```
