---
title: "Nextcloud через webDAV: «Windows не может получить доступ ..."
date: 2019-06-04
categories: 
  - "novosti"
tags: 
  - "nextcloud"
  - "webdav"
  - "windows"
---

Ошибка возникает при попытке подключения сетевого хранилища через webdav стандартными средствами Windows.

<!--more-->

**Ошибка при попытке восстановления подключения:**

![](images/Restoring-Network-Connections.png)

**Ошибка при попытке добавить новое подключение:**

![](images/Network-Error.png)

**Причина:**

Статус службы "Веб-клиент" по умолчанию находится в положении "Запускать в ручную".

![](images/Region.png)

Изменяем тип запуска на " Запускать автоматически". Пробуем подключиться еще раз.

* * *

Процесс подключения сетевого хранилища через webdav пошагово описан на _[яндексе](https://yandex.ru/support/disk/webdav/webdav-win.html)._

* * *

Источник - _[bayton.org](https://bayton.org/docs/nextcloud/connecting-to-nextcloud-via-webdav-windows-cannot-access/)_
