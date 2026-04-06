---
title: "Vagrant problem solving"
date: 2019-05-22
categories: 
  - "unix"
tags: 
  - "vagrant"
---

<!--more-->**Проблема:  
**mount: unknown filesystem type 'vboxsf'  
**Решение:  
**vagrant plugin install vagrant-vbguest  
  
**Проблема:**  
conflicting dependencies fog-core (~> 1.43.0) and fog-core (= 1.45.0)                     
 Activated fog-core-1.45.0                                                                                          
 which does not match conflicting dependency (~> 1.43.0)                                                                                                                
 Conflicting dependency chains:                                                        
   fog-core (= 1.45.0), 1.45.0 activated                                                                                                      
 versus:                                                                                                            
   vagrant-libvirt (> 0), 0.0.41 activated, depends on                                             
   fog-core (~> 1.43.0)    
**Решение:**  
wget -c https://releases.hashicorp.com/vagrant/2.0.3/vagrant\_2.0.3\_x86\_64.deb  
sudo dpkg -i vagrant\_2.0.3\_x86\_64.deb
