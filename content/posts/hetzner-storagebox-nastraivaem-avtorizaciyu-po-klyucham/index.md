---
title: "Hetzner StorageBox. Настраиваем авторизацию по ключам."
date: 2020-01-21
categories: 
  - "unix"
tags: 
  - "hetzner"
  - "ssh"
  - "ssh-keygen"
---

Эта заметка в первую очередь написана для себя самого, дабы упростить авторизацию в удаленном хранилище авторы предлагают использовать ключи. В продолжении паста с оф.вики Хетцнера.<!--more-->

**Первым делаем сгенерируем ключи (если их еще нет)**:

```
ssh-keygen

Generating public/private rsa key pair.
Enter file in which to save the key (/root/.ssh/id_rsa):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /root/.ssh/id_rsa.
Your public key has been saved in /root/.ssh/id_rsa.pub.
The key fingerprint is:
cb:3c:a0:39:69:39:ec:35:d5:66:f3:c5:92:99:2f:e1 root@server
The key's randomart image is:
+--[ RSA 2048]----+
|                 |
|                 |
|                 |
|         .   =   |
|      . S = * o  |
|   . = = + + =   |
|    X o =   E .  |
|   o + . .   .   |
|    .            |
+-----------------+
```

* * *

**Преобразование вашего ключа в формат RFC4716:**

_Это необходимо, только если вы хотите использовать SCP или SFTP через порт SSH 22. Чтобы преобразовать открытый ключ SSH в правильный формат, введите следующую команду:_

```
ssh-keygen -e -f .ssh/id_rsa.pub | grep -v "Comment:" > .ssh/id_rsa_rfc.pub
```

* * *

**Создадим authorized\_keys файл**:

```
cat .ssh/id_rsa_rfc.pub >> storagebox_authorized_keys
```

* * *

**Отправим файл с ключами в наше удаленное хранилище**:

```
echo -e "mkdir .ssh \n chmod 700 .ssh \n put storagebox_authorized_keys .ssh/authorized_keys \n chmod 600 .ssh/authorized_keys" | sftp <username>@<username>.your-storagebox.de
```

Вводим пароль от учетной записи, после его запроса.

* * *

**Проверяем результат**:

```
sftp <username>@<username>.your-storagebox.de

Connected to <username>.your-storagebox.de.
sftp>
```
