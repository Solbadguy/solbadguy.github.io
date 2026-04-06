---
title: "Администрирование 1C-сервера под Linux"
date: 2019-09-20
categories: 
  - "ubuntu-server"
tags: 
  - "1c"
  - "it"
  - "linux"
  - "ubuntu"
  - "komandnaya-stroka"
---

Наверное все те, кто сталкивался с администрирование 1С-сервера под Windows пользовались стандартной оснасткой "Администриарование сервера 1С". А как быть, если под руками есть только никсовая консоль? Далее коротко об этом.

<!--more-->

**Первым делом стартуем кластер**

```
/opt/1C/v8.3/x86_64/ras --daemon cluster
```

**Информация о кластере**

```
/opt/1C/v8.3/x86_64/rac cluster list
```

**Получаем список баз**

```
/opt/1C/v8.3/x86_64/rac infobase --cluster=UID summary list
```

где UID - результат вывода информации первой команды.

**Добавление базы**

```
/opt/1C/v8.3/x86_64/rac infobase --cluster=UID create --create-database --name=TEST --dbms=PostgreSQL --db-server=127.0.0.1 --db-name=TEST --locale=ru --db-user=postgres --db-pwd=PASSW --license-distribution=allow
```

**Удаление базы**

```
/opt/1C/v8.3/x86_64/rac infobase --cluster=UID drop --infobase=UID-Base
```
