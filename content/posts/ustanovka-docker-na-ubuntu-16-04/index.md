---
title: "Установка Docker на Ubuntu 16.04"
date: 2018-09-04
categories: 
  - "unix"
tags: 
  - "docker"
  - "ubuntu"
---

**Docker** — программное обеспечение для автоматизации развёртывания и управления приложениями в среде виртуализации на уровне операционной системы<!--more-->

### Что имеем:

- Свежеустановленную ОС Ubuntu 16.04
- Root-доступ
- Доступ в интернет

* * *

### Установка Docker

**Обновим базу данных пакетов системы**:

```
apt-get update
```

**Импортируем GPG ключ оф. репо Docker:**apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D

**Добавим репо Docker в список источников пакетов:**

```
apt-add-repository 'deb https://apt.dockerproject.org/repo ubuntu-xenial main'
```

**Обновим базу данных пакетов системы:**

```
apt-get update
```

**Установим Docker:**

```
apt-get install -y docker-engine
```

**Проверим, что процесс запущен:**

```
service docker status
```

* * *

### Установка в пару кликов

```
cd ~/ & nano install-docker
```

**Копируем следующие команды и сохраняем файл**

```
#!/bin/bash
## add key
apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
#add repo
apt-add-repository 'deb https://apt.dockerproject.org/repo ubuntu-xenial main' 
#upd
apt-get update
#install docker
apt-get install -y docker-engine
```

**Сделаем файл исполняемым**

```
chmod +x install-docker
```

**Установим docker**

```
sh install-docker
```

* * *

### **Упрощаем  работу**

Иногда мне приходится в интенсивном режиме отдавать команды Docker -у и порой надоедает набирать однотипный текст в консоли. Избавить себя от этого просто - **создадим алиасы**.

```
cd ~/ & nano .bashrc
```

В конец файла добавим название алиаса и команду, которая будет выполняться

```
alias dsta='docker start'
alias dsto='docker stop'
alias dps='docker ps'
alias dlo='docker logs'

```
