---
title: "Netplan Wifi on Ubuntu 18.04"
date: 2020-05-12
categories: 
  - "unix"
tags: 
  - "netplan"
---

Пару слов о том как настроить WiFI подключение из консоли.<!--more-->

**Первое, что необходимо помнить при настройке сети через Netplan - интервалы, отступы и т.д. имеют решающее значение и должны быть точными.**

**Пример настройки наиболее распространенных вариантов подключения можно найти по адресу:**

```
cat /usr/share/doc/netplan/examples/

```

**В данном случае меня интересует файл:**

```
cat /usr/share/doc/netplan/examples/wireless.yaml
```

```
network:
  version: 2
  renderer: networkd
  wifis:
    wlp2s0b1:
      dhcp4: yes
      dhcp6: no
      addresses: [192.168.0.21/24]
      gateway4: 192.168.0.1
      nameservers:
        addresses: [192.168.0.1, 8.8.8.8]
      access-points:
        "network_ssid_name":
          password: "**********"

```

**Создадим файл для нового подключения:**

```
touch /etc/netplan/00-wifi-config.yaml
```

**Скопируем содержимое примера и исправим строчки:**

- _dhcp4: yes_ (если в сети есть dhcp-srv)
- _wlp2s0b1:_ (исправим на имя своего беспроводного интерфейса)
- _addresses: \[192.168.0.21/24\] / gateway4: 192.168.0.1_  (правим в соотв. со своим адресным пространством)
- _"network\_ssid\_name":_ (на имя своего SSID)
- _password: "\*\*\*\*\*\*\*\*\*\*"_ (на пароль к своей точке)

**Сохраним файл.**

**Применим изменения:**

```
sudo netplan apply
```

**Перезапустим подключение:**

```
sudo ip link set wlp2s0b1 down
sudo ip link set wlp2s0b1 up
```

Проверим его статус:

```
ip a
```

В результате наш интерфейс должен получить ip-адрес, который мы указали.
