---
title: "Connection error 401: permission denied - invalid PVE ticket"
date: 2022-11-14
categories: 
  - "unix"
tags: 
  - "proxmox"
  - "pve"
---

Не совсем очевидное решение данной ошибки.<!--more-->

1\. Удаляем файлы:

- /etc/pve/pve-root-ca.pem
- /etc/pve/priv/pve-root-ca.key
- /etc/pve/nodes/<node>/pve-ssl.pem
- /etc/pve/nodes/<node>/pve-ssl.key
- /etc/pve/authkey.pub
- /etc/pve/priv/authkey.key
- /etc/pve/priv/authorized\_keys

2\. pvecm updatecerts -f 3 systemctl restart pvedaemon pveproxy
