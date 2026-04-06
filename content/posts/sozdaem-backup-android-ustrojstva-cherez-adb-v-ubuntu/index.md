---
title: "Создаем backup android-устройства через ADB в Ubuntu"
date: 2018-12-05
categories: 
  - "android"
tags: 
  - "android"
---

Ранее я писал на эту [тему](/kak-sozdat-rezervnuyu-kopiyu-proshivki-telefona/) отдельную заметку, с тех пор было выпущено несколько версий ОС android, каждый из нас наверняка узнал что-то новое. Я в частности немного поработал с ADB, об этом и пойдет речь ниже.

## <!--more-->Что такое ADB:

* * *

**ADB** - Android Debug Bridge. Это утилита командной строки, которая позволяет вам выполнять следующее:

- Управлять своим устройством Android через USB с компьютера
- Копировать файлы туда-сюда.
- Устанавливать и удалять приложения
- Запускать команды оболочки
- и етс

* * *

## Установка ADB:

```
sudo apt update
sudo apt install android-tools-adb android-tools-fastboot
```

### Проверим его версию:

```
adb version
Выхлоп:
Android Debug Bridge version 1.0.32
```

* * *

## Включим USB-отладку на устройстве:

- Перейдите в настройки Android
- Опуститесь вниз и выберите пункт- `О телефоне \``Об устройстве \ Система`
- Затем нажмите  на `Номер сборки` 7 раз, что сделает вас разработчиком. Если у Вас нет таких кнопок ищите "стать разработчиком имяустройсва"
- В том же меню появился новый пункт `Для разработчиков`
- Включите USB-отладку.

* * *

## Подготовка:

Подключите устройство к компьютеру с помощью USB-кабеля. После этого введите в окне терминала Ubuntu следующую команду:

```
adb start-server
```

**Сразу после ввода команды в терминале разблокируйте экран смартфона, там должен быть запрос на разрешение отладки - разрешайте.**

* * *

**Проверим работает ли ADB правильно**

```
adb devices
```

**В ответ получите примерно такое**:

```
List of devices attached 
KSJDJS6623DYPL	device

```

Отлично, телефон корректно определился, разрешение получено.

**Или такое:**

```
List of devices attached
????????????    no permissions
```

**Решение**:

```
sudo adb kill-server
sudo adb start-server
```

#### _на этом подготовительные действия закончены._

* * *

## Создаем бэкап устройства:

```
adb backup -apk -noshared -all -f backup-smartfon.adb

```

на устройстве всплывет запрос пароля для архива - вводим. Сам процесс резервирования лично у меня занимал где-то 23 минуты.

## Восстанавливаем копию на устройстве:

```
adb restore backup-smartfon.adb
```

* * *

### Паста из справки по опциям

```
adb backup [-f <file>] [-apk|-noapk] [-obb|-noobb] [-shared|-noshared] [-all] [-system|-nosystem] [<packages...>]
                              - write an archive of the device's data to <file>.
                                If no -f option is supplied then the data is written
                                to "backup.ab" in the current directory.
                                (-apk|-noapk enable/disable backup of the .apks themselves
                                   in the archive; the default is noapk.)
                                (-obb|-noobb enable/disable backup of any installed apk expansion
                                   (aka .obb) files associated with each application; the default
                                   is noobb.)
                                (-shared|-noshared enable/disable backup of the device's
                                   shared storage / SD card contents; the default is noshared.)
                                (-all means to back up all installed applications)
                                (-system|-nosystem toggles whether -all automatically includes
                                   system applications; the default is to include system apps)
                                (<packages...> is the list of applications to be backed up.  If
                                   the -all or -shared flags are passed, then the package
                                   list is optional.  Applications explicitly given on the
                                   command line will be included even if -nosystem would
                                   ordinarily cause them to be omitted.)

```
