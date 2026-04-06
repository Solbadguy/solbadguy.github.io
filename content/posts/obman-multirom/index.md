---
title: "Обман MultiRom"
date: 2016-07-27
categories: 
  - "stati"
tags: 
  - "android"
  - "miui"
---

Сразу хочу сказать, что ничего не имею против отдельных личностей и команды MultiRom  в целом. Они делают по настоящему хорошие переводы. Однако на просторах интернета я очень часто слышал мнение, что "они самые лучшие", т.к." ОПТИМИЗИРУюТ прошивки", "там больше свободной Оперативной памяти" и т.п. .  Неприятно было узнать о том, что это просто фокус.

<!--more-->

**Теперь факты.**

MultiROM пошли простым путем, по адресу: _/system/app/miuisystem/miuisystem.apk/miui/util/HardwareInfo.java ,_ находится метод getFreeMemory, который отвечает за вывод информации о свободной памяти.

Что они сделали: переименовали оригинальный файл, создали новый, а далее количество свободной памяти берется из оригинала и увеличивается на 10% во вновь созданном файле, если значение будет больше общего количества ОП, то возвращается оригинальное значение. Само собой, что в списке недавних приложений выводится "оптимизированное" количество ОП.

Вот так код выглядит в оригинале:

```
public static long getFreeMemory()
  {
    long l1 = getAndroidCacheMemory();
    long l2 = getTotalPhysicalMemory();
    long l3 = getTotalMemory();
    return (MiuiProcessUtil.getFreeMemory() / 1024L + l1) * (2L * l2 - l3) / l2 * 1024L;
  }

```

Вот так после "их магии"

```
public static long getFreeMemory()
{
  long l1 = getFreeMemory_source();
  long l2 = getTotalPhysicalMemory();
  long l3 = Math.round(l2 * 0.1D + l1);
  if (l3 > l2) {
    return l1;
  }
  return l3;
}

public static long getFreeMemory_source()
{
  long l1 = getAndroidCacheMemory();
  long l2 = getTotalPhysicalMemory();
  long l3 = getTotalMemory();
  return (MiuiProcessUtil.getFreeMemory() / 1024L + l1) * (2L * l2 - l3) / l2 * 1024L;
}
```

Как итог - прошивки модифицированные этой командой действительно хорошие, но совсем не лучшие.
