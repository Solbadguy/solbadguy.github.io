---
title: "Блокируем рекламу в домашней сети. Docker\PiHole + DnsCrypt"
date: 2020-09-24
categories: 
  - "unix"
tags: 
  - "dnscrypt"
  - "docker"
  - "pihole"
---

Короткая паста о том как поднять подобную связку на своем железе.<!--more-->Изобретать велосипед мы не будем поэтому воспользуемся своими навыками искать, открываем [github.com](http://github.com) и через пару секунд находим проект, который отвечает нашим задачам - [https://github.com/losuler/pihole-dnscrypt](https://github.com/losuler/pihole-dnscrypt)

* * *

### Нам потрбуется следующее ПО:

```
apt install docker docker-compose git -y
```

* * *

### Установка:

* * *

**Перейдем в рабочую папку:**

```
cd /opt
```

**Клонируем репозиторий:**

```
git clone https://gitlab.com/losuler/pihole-dnscrypt-docker
```

**Поправим путь в сервисе, корторый предлагает использовать автор:**

```
cd /opt/pihole-dnscrypt-docker

nano pihole-dnscrypt-docker.service 

Найдем строку и приведем к следующему виду

WorkingDirectory=/opt/pihole-dnscrypt-docker
```

**Скопируем только что исправленный сервис для systemd:**

```
cp pihole-dnscrypt-docker.service /etc/systemd/system/ 

```

**Поправим конфигурационный файл для Docker -a:**

```
nano docker-compose.yml
```

**На этом этапе есть важный момент, по умолчанию автором настроен проброс портов наружу, т.к. мне это было не нужно, я исправил это, оставив только доступ из локальной сети**

_Оригинальный файл_ - [https://raw.githubusercontent.com/losuler/pihole-dnscrypt-docker/master/docker-compose.yml](https://raw.githubusercontent.com/losuler/pihole-dnscrypt-docker/master/docker-compose.yml)

_Исправленная мной версия ниже:_

```
version: "3"

services:
  dnscrypt:
    container_name: dnscrypt-proxy
    image: klutchell/dnscrypt-proxy:latest
    networks:
      pihole_net:
        ipv4_address: 10.0.1.2
    environment:
     TZ: 'Europe/Moscow'
    volumes:
      - './etc-dnscrypt-proxy:/config'
    dns:
      - 1.1.1.1
    restart: unless-stopped

  pihole:
    container_name: pihole
    image: pihole/pihole:latest
    networks:
      pihole_net:
        ipv4_address: 10.0.1.3
    environment:
      TZ: 'Europe/Moscow'
      WEBPASSWORD: 'ВАШ ПАРОЛЬ ДЛЯ ДОСТУПА К ВЕБ-ПАНЕЛИ'
      DNS1: "10.0.1.2#5300"
      DNS2: "no"
    volumes:
       - './etc-pihole/:/etc/pihole/'
       - './etc-dnsmasq.d/:/etc/dnsmasq.d/'
    dns:
      - 1.1.1.1
    restart: unless-stopped
    depends_on:
      - dnscrypt

networks:
  pihole_net:
    driver: bridge
    ipam:
      config:
        - subnet: 10.0.1.0/24
```

**Перезагрузим конфигурацию systemd manager, чтобы он увидел наш новый сервис:**

```
systemctl daemon-reload 

```

**Включим и запустим службу systemd:**

```
systemctl enable --now pihole-dnscrypt-docker
```

 **Логи можно посмотреть так:**

```
systemctl status pihole-dnscrypt-docker
```

**Или так:**

```
journalctl -u pihole-dnscrypt-docker

```

* * *

**Обновить используемые в этом репо контейнеры можно следующей командой:**

```
docker-compose pull
```

**Затем перезапустим сервис:**

```
systemctl restart pihole-dnscrypt-docker
```

* * *

### UPD #1

По умолчанию в PiHole есть список рекламных хостов, одна проблема - заточен он не под РФ.  Поэтому спислок рекламных хостов нужно дополнить:

[https://firebog.net/](https://firebog.net/)

Мной были добавлены

```
https://adaway.org/hosts.txt
https://v.firebog.net/hosts/AdguardDNS.txt
```
