---
title: "Используем Docker, AceStream & AceProxy для просмотра \"Торрент ТВ\" на смартфонах, телевизорах и etc"
date: 2018-09-04
categories: 
  - "unix"
tags: 
  - "aceproxy"
  - "acestream"
  - "ubuntu"
  - "tv"
---

В статье будет описана установка, настройка и несколько способов просмотра видеопотока через трансляции p2p телевидения. Результатом выполнения этой инструкции будет "комбайн", который позволит одновременный просмотр такого ТВ с разных устройств в высоком качестве.<!--more-->

* * *

**AceStream** - это протокол одноранговой мультимедийной потоковой передачи, построенный с использованием технологии BitTorrent, для трансляции и просмотра "тяжелых" видеопотоков.

**AceProxy** - прокси, который написан на Python + gevent и должен работать как на Linux, так и на Windows. Позволяет просматривать потоки Ace Stream или файлы BitTorrent через HTTP.

**Docker** — программное обеспечение для автоматизации развёртывания и управления приложениями в среде виртуализации на уровне операционной системы.

* * *

### Установка Docker

**Почему бы не установить весь этот "комбайн" на рабочую систему?**

1. Крайняя версия AceStream выпущена для ubuntu 16 (за окном уже 18.04);
2. Избавимся от лишних проблем;
3. С контейнером работать удобнее.

* * *

**Установка Docker была описана ранее** - _[читать тут](/ustanovka-docker-na-ubuntu-16-04/)_.

* * *

**Cначала получим чистую Ubuntu 16.04**

```
docker pull ubuntu
```

**Запустим контейнер, предварительно открыв нужный для работы AceProxy порт**

```
docker run -d -p 8000:8000 --name tv --restart always ubuntu:16.04 tail -f /dev/null
```

**Проверим, что контейнер успешно запустился**

```
docker ps
```

**Выхлоп**

```
63d3fba11111        ubuntu:16.04                     "tail -f /dev/null"      10 seconds ago      Up 9 seconds        0.0.0.0:8000->8000/tcp   tv

```

* * *

### Установка AceStream

**Переходим в наш контейнер**

```
docker exec -it tv /bin/bash
```

**Обновим БД пакетов и  установим необходимые нам утилиты**

```
apt update & apt install nano mc wget -y
```

**Скачаем архив с AceStream и распакуем его**

```
wget http://dl.acestream.org/linux/acestream_3.1.16_ubuntu_16.04_x86_64.tar.gz && tar zxvf acestream_3.1.16_ubuntu_16.04_x86_64.tar.gz && rm acestream_3.1.16_ubuntu_16.04_x86_64.tar.gz
```

**Перенесем все в /opt/**

```
mv acestream_3.1.16_ubuntu_16.04_x86_64/ /opt/acestream
```

**Установим зависимости**

```
apt-get install python python-setuptools python-m2crypto python-apsw python-pip -y
pip install greenlet gevent psutil
```

Готово.

* * *

### Установка AceProxy

**Установим необходимые утилиты**

```
apt-get install python-gevent git python-psutil python-pkg-resources -y
```

Скопируем свежую версию AceProxy от [Pepsik-Kiev](https://github.com/pepsik-kiev).

```
cd /opt && git clone https://github.com/pepsik-kiev/HTTPAceProxy.git
```

**Поправим конфиг**

```
nano /opt/HTTPAceProxy/aceconfig.py

```

Нужно изменить две строчки

|   **Было**  ``` acespawn = False acecmd = 'acestreamengine --client-console --live-buffer 25 --vod-buffer 10 --vod-drop-max-age 120'  ```   |  **Стало**  ``` acespawn = True acecmd = '/opt/acestream/acestreamengine --client-console --live-buffer 25 --vod-buffer 10 --vod-drop-max-age 120'  ```   |
| --- | --- |

**Запустим прокси**

```
python /opt/HTTPAceProxy/acehttp.py
```

**Примерный выхлоп**

```
Ace Stream HTTP Proxy server on Python 2.7.12 starting .....
Ace Stream HTTP Proxy server IP: 172.17.0.8 autodetected
Ace Stream engine spawned with pid 26
Server started at 172.17.0.9:8000 Use <Ctrl-C> to stop

```

**Основная часть уже сделана. Дело за малым - найти плейлист.**

Этот момент я описывать не буду. Задача простая, если уметь в гуглпоиск.

* * *

### Использование AceProxy

Итак плейлист вы нашли, а устройство с docker -ом на борту в вашей домашней сети имеет адрес 192.168.1.15. На устройстве воспроизведения адрес плейлиста будет таким:

```
http://addrsite.m3u?ip=192.168.1.15:8000
```

По мимо готовых плейлистов прокси умеет проигрывать acestream id

```
http://192.168.1.15:8000/pid/acestreamid/stream.mp4
```

Найти такие адреса можно в интернете например через https://acestreamsearch.com/.  Используя этот сайт можно даже создать свой плейлист, который должен выглядеть примерно так

```
#EXTM3U
#EXTINF:-1,Название1 (Категория)
http://192.168.1.15:8000/pid/xxxxxxxxxxxxxxxxxxxxxx/stream. mp4
#EXTINF:-1,Название2 (Категория)
http://192.168.1.15:8000/pid/yyyyyyyyyyyyyyyyyyyyyy/stream. mp4
#EXTINF:-1,Название3 (Категория)
http://192.168.1.15:8000/pid/zzzzzzzzzzzzzzzzzzzzzz/stream. mp4

```

_где x,y,z - адреса трансляций формата acestream._ Пробел перед mp4 не нужен.

* * *

### **Постскриптум**

Со временем каждый наверняка заметит, что если смотреть ТТВ долго и часто, то в домашней папке пользователя накопится достаточное количество файлов кэша, причем они могут занимать очень много места. Встроенный механизм удаления кэша где-то есть, но искать его я не стал.

#### Удаление кеша

* * *

**Открываем список заданий на хосте**

```
crontab -e
```

**Добавляем в конец файла**

```
00 10,17,01 * * * docker exec tv bash -c "find /root/.ACEStream/.acestream_cache/live.* -delete"
01 10,17,01 * * * docker exec tv bash -c "find /root/.ACEStream/.acestream_cache/hls.* -delete"
```

Файлы кэша будут удаляться в 10, 17 и 1 ночи.

#### Upd#2 Авт. обновление прокси

* * *

**Создадим исполняемый скрипт и добавим его в пользовательский крон**

```
touch auto-update-aceproxy.sh & nano auto-update-aceproxy.sh
```

**Код скрипта**

```
#!/bin/bash
DATE=$(date +%Y%m%d)
mkdir /opt/BackUP-HTTPAceProxy/$DATE
tar -czf /opt/BackUP-HTTPAceProxy/$DATE/aceproxy.tar.gz /opt/HTTPAceProxy/
rm -R /opt/HTTPAceProxy
cd /opt && git clone https://github.com/pepsik-kiev/HTTPAceProxy.git
cd /opt/HTTPAceProxy
sed -i.bak aceconfig.py
sed -i 's/acespawn = False/acespawn = True/' aceconfig.py sed -i "s/acecmd = 'acestreamengine --client-console --live-buffer 25 --vod-buffer 10 --vod-drop-max-age 120'/acecmd = '\/opt\/acestream\/acestreamengine --client-console --live-buffer 25 --vod-buffer 10 --vod-drop-max-age 120'/" aceconfig.py
python /opt/HTTPAceProxy/acehttp.py 
exit
```

**Добавим скрипт в планировщик**

```
crontab -e
@weekly docker exec container_name /bin/bash -c "sh /path_to_script/acestream_update.sh"

```

Раз в неделю скрипт будет создавать резервную копию рабочей версии прокси (архивируя папку и перенося ее в /opt/BackUP...). Удалять текущую версию, скачивать новую + править конфиг.

#### Upd#3 Удаление старых архивов с РК

* * *

```
crontab -e
0 0 1 * * docker exec ttv bash -c "find /opt/BackUP-HTTPAceProxy/ -mtime +21 -print0 | xargs -0 rm -f"
```

Раз в месяц будет выполняться команда, которая удаляет архивы старше трех недель (21 дня).

* * *
