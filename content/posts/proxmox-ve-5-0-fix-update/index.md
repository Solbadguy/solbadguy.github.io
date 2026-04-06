---
title: "Proxmox VE 5.0 fix update"
date: 2017-10-16
categories: 
  - "unix"
---

Сразу после установки Proxmox 5.0 абсолютно все сталкиваются с ошибкой обновления. Дело том, что обновление по умолчанию стучится на корпоративные репозитории, где без подписки получает отпул. В итоге, после того как ввести в терминале apt update пользователь получает примерно такое сообщение:<!--more-->

```
W: The repository 'https://enterprise.proxmox.com/debian/pve stretch Release' does not have a Release file.
N: Data from such a repository can't be authenticated and is therefore potentially dangerous to use.
N: See apt-secure(8) manpage for repository creation and user configuration details.
E: Failed to fetch https://enterprise.proxmox.com/debian/pve/dists/stretch/pve-enterprise/binary-amd64/Packages  401  Unauthorized
E: Some index files failed to download. They have been ignored, or old ones used instead.
root@proxmox:~# reboot
```

Исправляется заменой одной строки

```
# nano /etc/apt/sources.list

```

Добавим строку

```
deb http : //download.proxmox.com/debian stretch pve-no-subscription
```

Затем удалим дефолтное репо

```
rm -f /etc/apt/sources.list.d/pve-enterprise.list
```

Правленный sources.list выглядит примерно так

```
deb http://ftp.debian.org/debian stretch main contrib
deb http://download.proxmox.com/debian stretch pve-no-subscription
deb http://security.debian.org stretch/updates main contrib
```
