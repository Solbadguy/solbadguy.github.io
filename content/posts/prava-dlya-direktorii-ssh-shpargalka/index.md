---
title: "Права для директории .ssh - шпаргалка"
date: 2024-11-18
summary: "Краткая шпаргалка по правильным правам для каталога .ssh и его содержимого."
categories: 
  - "unix"
tags: 
  - "linux"
  - "permissions"
---

Если создаете папки и файлы руками, не забывайте про правильные права на файлы

<!--more-->

| Имя | Файл\\Директория | Права |
| --- | --- | --- |
| SSH folder | `~/.ssh` | `700` |
| Public key | `~/.ssh/id_rsa.pub` | `644` |
| Private key | `~/.ssh/id_rsa` | `600` |
| Home folder | `~` | `755` at most |
| authorized\_keys | ~/.ssh/authorized\_keys | `600` |
