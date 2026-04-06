---
title: "Chrony Forward time jump detected! / Chrony время не синхронизируется"
date: 2022-05-13
categories: 
  - "unix"
tags: 
  - "chrony"
---

Заметил, что после перезагрузки ноутбука время отображается неверно. Решение под катом.<!--more-->

```
systemctl status chronyd

chronyd[1311]: Forward time jump detected!

chronyc sources -v

  .-- Source mode  '^' = server, '=' = peer, '#' = local clock.
 / .- Source state '*' = current best, '+' = combined, '-' = not combined,
| /             'x' = may be in error, '~' = too variable, '?' = unusable.
||                                                 .- xxxx [ yyyy ] +/- zzzz
||      Reachability register (octal) -.           |  xxxx = adjusted offset,
||      Log2(Polling interval) --.      |          |  yyyy = measured offset,
||                                \     |          |  zzzz = estimated error.
||                                 |    |           \
MS Name/IP address         Stratum Poll Reach LastRx Last sample               
===============================================================================
^? mail.rks-energo.ru            0  10     0     - +0ns[   +0ns] +/- 0ns

```

Ага! ntp серверы недоступны. Исправим.

```
sudo nano /etc/chrony.conf

добавим новые серверы.

# These servers were defined in the installation:
#server nag.aleksdem.com iburst
#server mail.rks-energo.ru iburst
server 0.ru.pool.ntp.org iburst
server 1.ru.pool.ntp.org iburst
server 2.ru.pool.ntp.org iburst
server 3.ru.pool.ntp.org iburst

```

Перезапустим службу и вуаля

```
systemctl restart chronyd

chronyc sources -v

  .-- Source mode  '^' = server, '=' = peer, '#' = local clock.
 / .- Source state '*' = current best, '+' = combined, '-' = not combined,
| /             'x' = may be in error, '~' = too variable, '?' = unusable.
||                                                 .- xxxx [ yyyy ] +/- zzzz
||      Reachability register (octal) -.           |  xxxx = adjusted offset,
||      Log2(Polling interval) --.      |          |  yyyy = measured offset,
||                                \     |          |  zzzz = estimated error.
||                                 |    |           \
MS Name/IP address         Stratum Poll Reach LastRx Last sample               
===============================================================================
^? ns1.ooonet.ru                 2   6     3     2    +51ms[  +51ms] +/- 146ms
^- ftpshare1.corbina.net         2   6     7     1  +3098us[+4374us] +/- 99ms
^+ 89-110-32-178.static.ava>     2   6     7     1    -23ms[  -22ms] +/- 129ms
^? ip-79-111-152-5.bb.netby>     1   6     7     1    +65ms[  +66ms] +/- 105ms

```

Время отображается верно.
