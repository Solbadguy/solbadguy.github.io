---
title: "Debian 11 - объединение сетевых интерфейсов\bonding setup"
date: 2022-11-25
categories: 
  - "unix"
tags: 
  - "bond"
---

Появилась задача объединить все сетевые интерфейсы на сервере, для того, чтобы обеспечить максимальную пропускную способность в обе стороны. Шаги под катом.<!--more-->

**Возможные варианты**:

1.  Balance-rr/mode 0
2.  Active-backup/mode 1
3.  Balance-xor/mode 2
4.  Broadcast/mode 3
5.  802.3ad/mode 4
6.  Balance-tlb/mode 5
7.  Balance-alb/mode 6

* * *

**Есть два способа настроить**:

- Используя конф. файл /etc/network/interfaces
- Используя нетворк менеджер - NMCLI

Я использую первый вариант.

* * *

```
Установим ПО
```

```
sudo apt update && sudo apt upgrade
sudo apt install ifenslave
sudo modprobe bonding
sudo echo 'bonding' >> /etc/modules
```

**Настроим**

```
sudo vim /etc/network/interfaces

```

```
# This file describes the network interfaces available on your system
# and how to activate them. For more information, see interfaces(5).

source /etc/network/interfaces.d/*

# The loopback network interface
auto lo
iface lo inet loopback

# Frontend bond interface
auto bond0
iface bond0 inet static
  address 192.168.56.2/24
  gateway 192.168.56.1
  bond-slaves enp0s3 enp0s8
  bond-mode 1
  bond-primary enp0s3
  bond-miimon 100
  bond-downdelay 300
  bond-updelay 700
```

**Перезапустим сеть**

```
sudo ifdown enp0s3 enp0s8
sudo ifup bond0 

or 

sudo service networking restart

```

**Проверим статус**

```
more /proc/net/bonding/bond0

Ethernet Channel Bonding Driver: v5.10.0-11-amd64

Bonding Mode: fault-tolerance (active-backup)
Primary Slave: enp0s3 (primary_reselect always)
Currently Active Slave: enp0s3
MII Status: up
MII Polling Interval (ms): 100
Up Delay (ms): 700
Down Delay (ms): 300
Peer Notification Delay (ms): 0

Slave Interface: enp0s3
MII Status: up
Speed: 1000 Mbps
Duplex: full
Link Failure Count: 0
Permanent HW addr: 08:00:27:e1:5f:56
Slave queue ID: 0

Slave Interface: enp0s8
MII Status: up
Speed: 1000 Mbps
Duplex: full
Link Failure Count: 0
Permanent HW addr: 08:00:27:00:96:03
Slave queue ID: 0
```

_tnx [claudiokuenzle](https://www.claudiokuenzler.com/) for the bug reports for package version 1.22_
