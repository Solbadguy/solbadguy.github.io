---
title: "Zabbix Proxy. Установка в Ubuntu 20.04 / 18.04"
date: 2020-07-01
categories: 
  - "ubuntu-server"
tags: 
  - "zabbix-proxy"
  - "zabbix-proksi"
---

В этом руководстве мы шаг за шагом пройдем путь от подготовки до полноценного запуска Zabbix Proxy 5 на Ubuntu 20.04 (Focal) или Ubuntu 18.04 (Bionic) LTS.<!--more-->

**Zabbix proxy**  - это сервис, который собирант данные о производительности и доступности конечных устройств, а затем  передает их Zabbix-серверу.

Как правило он используется для мониторинга инфраструктуры, которая находится за брандмауэром, либо для разгрузки Zabbix-сервера в больших средах.

* * *

А теперь мы установим последнюю версию 5.0 прокси-сервера Zabbix в Ubuntu (20.04, 18.04)

* * *

## **Шаг 1: Установка Zabbix Proxy в Ubuntu**

Для установки прокси мной была заранее подготовлена чистая вирт, на которой я и буду выполнять настройку этого сервиса.

```
sudo wget https://repo.zabbix.com/zabbix/5.0/ubuntu/pool/main/z/zabbix-release/zabbix-release_5.0-1+$(lsb_release -sc)_all.deb
sudo dpkg -i zabbix-release_5.0-1+$(lsb_release -sc)_all.deb
sudo apt update
sudo apt -y install zabbix-proxy-mysql
```

* * *

## **Шаг 2. Настройка базы данных**

Для примера я буду использовать пароль rootDBpass  в качестве пароля root-пользователя базы данных и zabbixDBpass  в качестве пароля базы данных Zabbix. Из соображений безопасности обязательно меняйте его на свой.

**2.1 Настройка Mysql**

```
sudo mysql_secure_installation

Enter current password for root (enter for none): Press the Enter
Set root password? [Y/n]: Y
New password: <Enter root DB password>
Re-enter new password: <Repeat root DB password>
Remove anonymous users? [Y/n]: Y
Disallow root login remotely? [Y/n]: Y
Remove test database and access to it? [Y/n]:  Y
Reload privilege tables now? [Y/n]:  Y
```

**2.2 Создание БД**

```
sudo mysql -uroot -p'rootDBpass'
mysql> create database zabbix_proxy character set utf8 collate utf8_bin;
mysql> grant all privileges on zabbix_proxy.* to zabbix@localhost identified by 'zabbixDBpass';
mysql> quit;
```

**3.1 Импорт схемы БД**

```
zcat /usr/share/doc/zabbix-proxy-mysql*/schema.sql.gz |  mysql -uzabbix -p'zabbixDBpass' zabbix_proxy

```

* * *

## **Шаг 3: Настройка прокси**

В рамках этой статья я назову свой прокси _**Zproxy**_ и настрою его для связи с Zabbix-сервером по адресу _**192.168.0.3**_  -  измените эти значения  в соответствии с вашей средой.

Сколпируйте, а затем откройте файл `zabbix_proxy.conf`с помощью команды:

```
sudo cp /etc/zabbix/zabbix_proxy.conf /etc/zabbix/zabbix_proxy.conf_bk
sudo nano /etc/zabbix/zabbix_proxy.conf
```

теперь нам надо исправить некоторые значения:

```
Server=192.168.0.3
Hostname=Zproxy
DBName=zabbix_proxy
DBUser=zabbix
```

Сохраните изменения.

* * *

## **Шаг 4. Запустите и включите прокси-сервис**

Перезапустим службу и включим автозапуск при загрузке ОС:

```
sudo systemctl restart zabbix-proxy
sudo systemctl enable zabbix-proxy
```

* * *

## **Шаг 5: Зарегистрируйте прокси-сервер в веб-интерфейсе Zabbix**

Теперь, когда ваш прокси-сервер работает, вам необходимо зарегистрировать его в веб-интерфейсе Zabbix.

Для этого перейдем по пути:

_Администрирование -> Прокси-> Создать прокси , где укажем следующее:_

- Имя - Zproxy
- Режим - Активный

Обратите внимание, что для работы прокси в активном режиме « _Имя прокси»_ должно совпадать с параметром « _hostname_ » в `zabbix_proxy.conf`.

* * *

## **Шаг 6: Настройте хосты в Zabbix для мониторинга через прокси**

На данный момент наш прокси работает, но он не передает никаких данных, т.к. мы не еще не создали ни одного узла сети, который бы работал через него.

В настройке узла нет ничего сложного, отмечу лишь, что адреса клиентов должны быть "локальными", т.е. находмться в той же сети что и сам прокси.

По окончании настройки не забудьте выбрать наш новенький прокси в одноименном пункте настроек.

* * *

## **Шаг 7. Настройка шифрования PSK на прокси (необязательно)**

Zabbix поддерживает зашифрованные соединения между сервером Zabbix и прокси-сервером, используя протокол TLS (vLS). Вы можете использовать шифрование на основании сертификатов или ключей (PSK). В этом руководстве мы настроим последнее.

**7.1. Создадим PSK ключ**

```
openssl rand -hex 32 
 382eb0sadasdc207cc4980cdb1bb181asdasd82b7fddcda00281311a8fb955
```

полученный ключ - _382eb0sadasdc207cc4980cdb1bb181asdasd82b7fddcda00281311a8fb955_

Создайте и откройте файл `zabbix_proxy.psk:`

```
sudo nano /etc/zabbix/zabbix_proxy.psk
```

скопируйте в него только что созданный ключ.

Изменим права:

```
sudo chown zabbix: zabbix /etc/zabbix/zabbix_proxy.psk 
sudo chmod 644 /etc/zabbix/zabbix_proxy.psk
```

**7.2. Настроим прокси для работы через PSK**

Откроем файл конф.:

```
sudo nano /etc/zabbix/zabbix_proxy.conf
```

Добавим строчки:

```
TLSConnect = psk 
TLSAccept = psk 
TLSPSKFile = /etc/zabbix/zabbix_proxy.psk 
TLSPSKIdentity = zproxy_psk
```

Перезапустим прокси:

```
sudo systemctl restart zabbix-proxy

```

**7.3. Включим шифрование на Zabbix-сервере**

Связь между прокси и Zabbix-сервером еще не зашифрована, потому что мы включили шифрование PSK на стороне прокси, но не на стороне сервера.

Нам нужно включить шифрование на стороне сервера, поэтому зайдите в веб-интерфейс и выберите свой прокси, а затем выберите параметр Шифрование, где:

- Установите тип PSK
- Скопируйте имя
- Скопируйте ключ

* * *

На этом настройку Zappix-proxy можно считать оконченной.

Напомню лишь, что его логи можно отслеживать командой:

```
tail -500 /var/log/zabbix/zabbix_proxy.log
```

а так же помните, что Zabbix-прокси использует порт **10051** для связи с Zabbix-сервером, поэтому убедитесь, что вы разрешаете тсходящий трафик на этом порту.
