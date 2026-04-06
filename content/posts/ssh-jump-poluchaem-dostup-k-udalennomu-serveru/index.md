---
title: "SSH-Jump. Получаем доступ к удаленному серверу."
date: 2022-04-29
categories: 
  - "unix"
---

Jump-host — это промежуточный хост или SSH-шлюз в удаленную сеть, через который можно установить соединение с другим хостом в другой сети, например демилитаризованной зоне ( **DMZ** ). <!--more-->

Настроим ssh config:

```
vi ~/.ssh/config

### Jump-host
Host ext-srv
  User ssh_user
  PreferredAuthentications publickey
  IdentityFile ~/.ssh/priv_key
  HostName extsrv.example.org
  Port 22

### Хост к которому получим доступ через jump
Host int-srv
  HostName intsrv.example.org
  User ssh_user
  PreferredAuthentications publickey
  IdentityFile ~/.ssh/priv_key
  ProxyJump ext-srv
```
