---
title: "Настраиваем отправку почты с сервера через пакет SSMTP"
date: 2020-07-24
categories: 
  - "unix"
tags: 
  - "ssmtp"
---

Заметку эту написал для локальной вики, а затем решил выложить и здесь.<!--more-->

**#1 Установка**

```
apt-get install ssmtp -y
```

* * *

**#2 Настройка**

Редактируем основной конф. файл:

```
nano /etc/ssmtp/ssmtp.conf
```

Приведем его к такому виду:

```
#от имени кого будут отправляться письма
root=username@domen.ru
#С какого домена будут приходить письма
rewriteDomain=domen.ru
#Сервер яндекса
mailhub=smtp.yandex.ru:465
#имя нашего сервера
hostname=domen.ru
#Разрешаем шифрование
UseTLS=YES
#авторизация на Яндексе
AuthUser=username@domen.ru
AuthPass=yourpassword
#разрешаем пользователям менять поле From
FromLineOverride=YES
```

* * *

Редактируем конфиг с алиасами пользователей:

```
nano /etc/ssmtp/revaliases
```

Приведем его к такому виду:

```
root:username@domen.ru:smtp.yandex.ru:465
www.domen.ru:username@domen.ru:smtp.yandex.ru:465
www-data:username@domen.ru:smtp.yandex.ru:465
```

* * *

**#3 Настроим PHP**

Откроем php.ini и отредактируем его:

```
nano /etc/php/7.2/fpm/php.ini
```

Найдем строку с указанием пути до бинарника и приведем к виду:

```
sendmail_path = /usr/sbin/ssmtp -t
```

**#4 Дебаг**

В конфигурационном файле ssmtp.conf Добавляем в самое начало конфига строчку:

```
Debug=YES
```

Затем смотрим лог:

```
tail -f /var/log/mail.err
```

**#5 Проверка работы**

```
echo "Это тестовое письмо из консоли" | ssmtp -v -s адрескудаотправляем@domain.com
```
