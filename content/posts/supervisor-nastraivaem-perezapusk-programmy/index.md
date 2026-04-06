---
title: "Supervisor. Настраиваем перезапуск программы."
date: 2020-05-29
categories: 
  - "unix"
tags: 
  - "supervisor"
  - "ubuntu"
---

В повседневной работе появилась задача - автоматизировать перезапуск программы с кастомными параметрами, в случае, если по какой-то причине она будет завершена.

Решение - Supervisor.<!--more-->

> Supervisor - менеджер процессов, который выступает в качестве прослойки для мониторинга и управления процессами, запущенных пользователем.

### Установка Supervisor

* * *

```
apt install supervisor

```

Конфигурационные файлы Supervisor находятся в каталоге /etc/supervisor/conf.d, где каждый имеет расширение _.conf_ .

**Пример конфигурации**:

```
[program:chromedriver]
command=/usr/bin/chromedriver/chromedriver --port=4444
autostart=true
autorestart=true
stderr_logfile=/var/log/chromedriver.err.log
stdout_logfile=/var/log/chromedriver.out.log

```

После того, как мы создали конфигурационный файл, нужно сообщить об этом Supervisor -у:

```
supervisorctl reread && supervisorctl update

```

Указанная нами программа уже должна быть запущена, посмотрим в логи:

```
tail /var/log/chromedriver.out.log
```

* * *

### Управление процессами

* * *

В определенный момент вам может потребоваться остановить некоторые программы, делается это следующим образом

```
root@srv:# supervisorctl
chromedriver                     RUNNING   pid 2396, uptime 0:41:06

```

Перед нами статус всех запущенных программ, а так же интерактивная оболочка Supervisor -a. Список всех доступных команд можно увидеть введя в консоли - _help_.

Остановим программу так:

```
supervisor> stop chromedriver
```
