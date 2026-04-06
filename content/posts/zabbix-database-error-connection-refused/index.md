---
title: "Zabbix - Database error Connection refused"
date: 2022-09-09
categories: 
  - "unix"
tags: 
  - "zabbix"
---

Некоторое время назад понадобилось обновить zabbix до следующей версии, при этом ВМ, на которых работал фронт и БД жили отдельно, а настройки сети получали по dhcp. <!--more-->значения в файле `/etc/zabbix/zabbix_server.conf` поменял сразу, но проблемы это не решило. При этом напрямую подкл к базе через mysql -u -p -h xx.xx.xx.xx отрабатывало отлично.

А проблема заключалась чуть "глубже", в другом файле

`vi /usr/share/zabbix/conf/zabbix.conf.php`
