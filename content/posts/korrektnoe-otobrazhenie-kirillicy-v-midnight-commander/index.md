---
title: "Корректное отображение кириллицы в Midnight Commander"
date: 2017-01-18
categories: 
  - "ubuntu-server"
tags: 
  - "linux"
  - "soft"
  - "redaktory"
---

Возникла необходимость воспользоваться специализированным дистрибутивом, который работает под Debian, так вот русской локализации в нем конечно же не было. Файлы и папки в консоли\\ файловом менеджере в названии которых была кириллица отображались неправильно - вместо букв отображались знаки вопроса. Решить эту проблему очень просто.

<!--more-->

## Корректное отображение кириллицы в Midnight Commander

* * *

**Настраиваем языковые параметры**

```
dpkg-reconfigure locales
```

Активируем локали ru\_RU.CP1251 CP1251 и ru\_RU.UTF-8 UTF-8, в следующем вопросе по-умолчанию выбираем ru\_RU.UTF-8 UTF-8

Отключаемся от текущей сессии. При следующем подключении к серверу по SHH проверяем локаль командой:

```
locale
```

**Результат**:

```
LANG=ru_RU.UTF-8
LANGUAGE=
LC_CTYPE="ru_RU.UTF-8"
LC_NUMERIC="ru_RU.UTF-8"
LC_TIME="ru_RU.UTF-8"
LC_COLLATE="ru_RU.UTF-8"
LC_MONETARY="ru_RU.UTF-8"
LC_MESSAGES="ru_RU.UTF-8"
LC_PAPER="ru_RU.UTF-8"
LC_NAME="ru_RU.UTF-8"
LC_ADDRESS="ru_RU.UTF-8"
LC_TELEPHONE="ru_RU.UTF-8"
LC_MEASUREMENT="ru_RU.UTF-8"
LC_IDENTIFICATION="ru_RU.UTF-8"
LC_ALL=
```
