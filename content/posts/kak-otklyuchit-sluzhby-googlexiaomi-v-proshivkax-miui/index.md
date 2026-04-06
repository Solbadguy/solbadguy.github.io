---
title: "Как отключить службы Google/Xiaomi в прошивках MIUI"
date: 2016-08-31
categories: 
  - "sovety-po-nastrojke-android-os"
tags: 
  - "android"
  - "google"
  - "miui"
  - "root"
  - "optimizaciya-pamyati"
---

Ранее я уже писал о том, какие программы можно удалять из прошивок MIUI, в этот раз мне бы хотелось затронуть тему сервисов от производителя (Xiaomi) и корпорации добра (Google). В статье описан способ, который позволит отключать и включать эти сервисы по желанию.<!--more-->

Чем этот способ лучше удаления сервисов Google/Xiaomi? Ответ напрашивается сам собой - при необходимости вы сможете вернуть все в исходное состояние (например вам нужно установить программу из каталога программ Google, установить стороннюю тему MIUI).

* * *

**СПОСОБ ОПРОБОВАН МНОЙ НА DEVELOPER MIUI 7, РАБОТА НА 8 НЕ ГАРАНТИРОВАНА!**

* * *

**Перед запуском скрипта желательно сделать бэкап раздела system, через TWRP, на случай, если что-то пойдет не так.**

## Как отключить службы Google/Xiaomi в прошивках MIUI

**Для успешного выполнения нам потребуется:**

1. Root-доступ на вашем устройстве
2. [BusyBox](https://play.google.com/store/apps/details?id=stericson.busybox&hl=ru) (как правило уже есть в MIUI)
3. [Terminal Emulator for Android](https://play.google.com/store/apps/details?id=jackpal.androidterm&hl=ru)
4. TWRP

* * *

**Установка:**

- Скачиваем [архив](/upload/Disable_Services.zip)
- Копируем его на флеш-карту устройства
- Устанавливаем через TWRP

* * *

**Запуск скрипта:**

1\. После установки и загрузки системы открываем эмулятор терминала; 2. Вводим команду:

```
su
```

3\. На запрос SuperSU о запросе прав отвечаем "предоставить";

4\. В терминале вводим команду:

```
sh /data/local/tmp/miui/services.sh
```

5\. Скрипт предложит несколько вариантов его работы - вводим 2(сервисы google) и\\или 3(xiaomi) тем самым отключая их (если они уже были выключены соотв. включаем). Можно оставить те или другие сервисы включенными\\отключенными.

6\. После выбора скрипт будет запущен, после чего телефон должен будет перезагрузиться.

* * *

Отключение сервисов освободило примерно 100мб оперативной памяти, на моем девайсе. Ко всему прочему кол-во исходящих соединений (при подключении к сети интернет) уменьшилось в несколько раз.

**Список сервисов, которые "отрабатывает" скрипт можно найти ниже.**

**Xiaomi**

```
Bugreport
Cloud Backup
Cloud Service
Find Device
Game Center
MiDrop
MiLink
MiLiveTalk
MiPlay
Mipub
MiVoip
Payment Service
StepsProvider
Whetstone
Xiaomi Account
Xiaomi Market
Xiaomi Vip
Xiaomi Service Framework
```

 

**Google**

```
com.android.vending;
com.google.androidforwork;
com.google.android.apps.books;
com.google.android.apps.cloudprint;
com.google.android.apps.enterprise.dmagent;
com.google.android.apps.docs;
com.google.android.apps.docs.editors.docs;
com.google.android.apps.docs.editors.sheets;
com.google.android.apps.docs.editors.slides;
com.google.android.apps.fitness;
com.google.android.apps.genie.geniewidget;
com.google.android.apps.gcs;
com.google.android.apps.magazines;
com.google.android.apps.maps;
com.google.android.apps.messaging;
com.google.android.apps.photos;
com.google.android.apps.plus;
com.google.android.apps.translate;
com.google.android.apps.tycho;
com.google.android.backuptransport;
com.google.android.calculator;
com.google.android.calendar;
com.google.android.configupdater;
com.google.android.contacts;
com.google.android.deskclock;
com.google.android.ears;
com.google.android.earth;
com.google.android.gm.exchange;
com.google.android.gm;
com.google.android.gms;
com.google.android.googlequicksearchbox;
com.google.android.gsf;
com.google.android.gsf.login;
com.google.android.facelock;
com.google.android.feedback;
com.google.android.inputmetod.hindi;
com.google.android.inputmetod.japanese;
com.google.android.inputmetod.korean;
com.google.android.inputmetod.pinyin;
com.google.android.inputmetod.zhuyin;
com.google.android.keep;
com.google.android.marvin.talkback;
com.google.android.music;
com.google.android.onetimeinitializer;
com.google.android.partnersetup;
com.google.android.play.games;
com.google.android.street;
com.google.android.syncadapters.calendar;
com.google.android.syncadapters.contacts;
com.google.android.tag;
com.google.android.talk;
com.google.android.tts;
com.google.android.videos;
com.google.android.walletfcrel;
com.google.android.webview;
com.google.android.youtube;
```
