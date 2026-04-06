---
title: "Переименование ноды Proxmox VE"
date: 2022-11-22
categories: 
  - "unix"
tags: 
  - "proxmox"
---

Во время одной из установок ОС была допущена опечатка в имени сервера. Под катом решение этой проблемы.<!--more-->

**Редактируем три файла, которые содержат имя хоста**

```
nano /etc/hosts
nano /etc/hostname
nano /etc/postfix/main.cf
```

**Перезагружаем ОС**

Копируем содержимое папки с неверным именем хоста в папку, которая именуется верно.

```
cd /etc/pve/nodes/
cp -r old_hostname/qemu-server new_hostname/qemu-server
rm -r old_hostname
cd /var/lib/rrdcached/db/pve2-node/
cp -r old_hostname new_hostname
rm -r old_hostname
```

Перед тем как удалять $old\_hostname проверьте содержимое qemu-server в $new\_hostname. На моем сервере возникла проблема и файлы конф ВМ не копировались по непонятным для меня причинам. Решилось копированием qemu-server в /etc/pve/nodes/, удалением папки $old\_hostname, а затем копированием qemu-server в $new\_hostname.
