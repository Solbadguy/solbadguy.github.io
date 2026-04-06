---
title: "Motd script for SSH login"
date: 2018-02-21
categories: 
  - "unix"
tags: 
  - "linux"
  - "motd"
  - "ssh"
---

В этом небольшом руководстве пойдет речь о кастомизации сообщения motd при авторизации в системе. В РУнете информация устарела, либо ее нет, либо я плохо искал. В продолжении статьи готовый скрипт, примерный выхлоп и пошаговое руководство.

При необходимости скрипт легко меняется под ваши нужды.

<!--more-->

### Примерный результат

![](images/raspilogin2.jpg)

* * *

### Код скрипта

```
#!/bin/sh
 
upSeconds="$(/usr/bin/cut -d. -f1 /proc/uptime)"
secs=$((${upSeconds}%60))
mins=$((${upSeconds}/60%60))
hours=$((${upSeconds}/3600%24))
days=$((${upSeconds}/86400))
UPTIME=`printf "%d days, %02dh%02dm%02ds" "$days" "$hours" "$mins" "$secs"`
 
# get the load averages
read one five fifteen rest < /proc/loadavg
 
echo "$(tput setaf 2)
   .~~.   .~~.    `date +"%A, %e %B %Y, %r"`
  '. \ ' ' / .'   `uname -srmo`$(tput setaf 1)
   .~ .~~~..~.
  : .~.'~'.~. :   Uptime.............: ${UPTIME}
 ~ (   ) (   ) ~  Memory.............: $(free -h | grep Mem | awk '{print  $4" (Free) / " $3" (Used) / " $2 " (Total)"}')
( : '~'.~.'~' : ) Load Averages......: ${one}, ${five}, ${fifteen} (1, 5, 15 min)
 ~ .~ (   ) ~. ~  Running Processes..: `ps ax | wc -l | tr -d " "`
  (  : '~' :  )   Zombie Processes.... $(($(ps aux | grep 'Z' | wc -l) - 2 ))
   '~ .~~~. ~'    IP Addresses.......: `ip a | grep glo | awk '{print $2}' | head -1 | cut -f1 -d/` and `wget -q -O - http://icanhazip.com/ | tail`
       '~'        
$(tput sgr0)"

for DISK in $(df -h | awk '{print $1}' |grep "/dev/" | uniq)
do
echo "Disk $DISK Used Space...........: $(df -h | grep $DISK | awk '{print $5}')"
done

```

* * *

### Как добавить в свою систему:

```
mkdir -p /etc/update-motd.d
rm -f /etc/motd
ln -sf /var/run/motd /etc/motd
wget -q -O 10login-message.zip http://admin.netlab-kursk.ru/upload/modt-script-master.zip
unzip 10login-message.zip
mv modt-script-master/motd_script.sh  /etc/update-motd.d/20-login
rm -rf modt-script-master
chmod a-x /etc/update-motd.d/*
chmod a+x /etc/update-motd.d/20-login
service ssh reload

```

После этого логинимся в системе еще раз, выхлоп должен быть перед вами.

* * *

Спасибо [nachoparker](https://ownyourbits.com/author/cisquero_admin/) [Кириллу](https://github.com/kazarin-ka/modt-script)

* * *

**Дополнение**

От "родного" приветствия я не отказываюсь полностью, кол-во доступных обновлений и необходимость перезагрузки - полезная информация.

Вернуть назад их очень просто

```
chmod a+x 00-header & chmod a+x 90-updates-available & chmod a+x 98-reboot-required
```
