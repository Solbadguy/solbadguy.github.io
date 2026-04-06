---
title: "Logrotate. Добавляем ротацию логов для виртуальных хостов Nginx"
date: 2020-01-15
categories: 
  - "unix"
tags: 
  - "logrotate"
  - "nginx"
  - "ubuntu"
---

Logrotate - это системная утилита, которая управляет автоматической ротацией и сжатием лог-файлов. Если в процессе длительной работы сервера файлы не были ротированы, сжаты и периодически не удалялись, то рано или поздно они могут занять весь доступный объем памяти.<!--more-->

**Если вы используете сервер, отличный от Ubuntu, убедитесь, что утилита установлена, запросив информацию**:

```
logrotate --version
```

**Ожидаемый результат**:

```
logrotate 3.8.7

```

### Logrotate. Добавляем ротацию логов для виртуальных хостов Nginx

* * *

Информация о конфигурации Logrotate обычно может быть найдена в двух местах на Ubuntu:

- /etc/logrotate.conf - этот файл содержит некоторые настройки по умолчанию и устанавливает ротацию для нескольких журналов, которые не принадлежат никаким системным пакетам. Он также использует оператор include для настройки конфигурации из любого файла в каталоге /etc/logrotate.d.
- /etc/logrotate.d/ - в этой директории любые пакеты, которые вы устанавливаете, будут размещать свою конфигурацию Logrotate. При стандартной установке у вас уже должны быть файлы для базовых системных инструментов, таких как apt, dpkg, rsyslog и т.д.

По умолчанию logrotate.conf настроит еженедельную (weekly) ротацию лог-файлов, принадлежащие пользователю root и группе syslog (su root syslog), с сохранением четырех лог-файлов (rotate 4) и новых пустых файлов журнала созданный после того, как текущий обновится (create).

* * *

**Рассмотрим конфигурационный файл Logrotate /etc/logrotate.d для веб-сервера Nginx**:

```
cat cat /etc/logrotate.d/nginx
```

**Содержимое файла**:

```
/var/log/nginx/*.log {
  daily
  missingok
  rotate 14
  compress
  delaycompress
  notifempty
  create 0640 www-data adm
  sharedscripts
  prerotate
    if [ -d /etc/logrotate.d/httpd-prerotate ]; then \
      run-parts /etc/logrotate.d/httpd-prerotate; \
    fi \
  endscript
  postrotate
    invoke-rc.d nginx rotate >/dev/null 2>&1
  endscript
}

```

* * *

Как мы видим авторами пакета уже создан готовый шаблон для выбранного нами веб-сервера.  Т.к. во время конфигурации вирт. хостов я выбрал альтернативные пути хранения логов для каждого сайта, мне потребовалось создать еще пару конфигов, в которых я изменял только одну строчку - путь.

```
/path/to/logs/new/site/*.log {
  daily
  missingok
  rotate 14
  compress
  delaycompress
  notifempty
  create 0640 www-data adm
  sharedscripts
  prerotate
    if [ -d /etc/logrotate.d/httpd-prerotate ]; then \
      run-parts /etc/logrotate.d/httpd-prerotate; \
    fi \
  endscript
  postrotate
    invoke-rc.d nginx rotate >/dev/null 2>&1
  endscript
}

```

* * *

**Для того, чтобы убедиться в том, что logrotate взял под контроль новые файлы логов, выполним команду**:

```
logrotate /etc/logrotate.conf --debug
```

в выхлопе вы увидите добавленные вами пути и краткий отчет о состоянии.

* * *

_при написании в качестве справки использовался материал сайта - [1cloud.ru](https://1cloud.ru/help/linux/upravlenie-logami-s-pomoshch'yu-logrotate-na-ubuntu-16-04)_
