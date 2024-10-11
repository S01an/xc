---
title: Kioptix Level 1
publish_date: 2024-10-11
---

# 搭建

[靶场下载地址（下载器下载要挂代理）](https://www.vulnhub.com/entry/hacknos-os-hacknos,401/)

直接导入下载的.ova文件即可

如果出现扫不到靶机ip或开放端口可参考[OS-hackNos-1无ip解决方案](https://blog.csdn.net/witwitwiter/article/details/119889384)

# 探测网络

nmap探测靶机ip

![image](https://github.com/user-attachments/assets/88e06096-5597-453d-b6a9-097109d1aa6d)


nmap开放端口探测

![image](https://github.com/user-attachments/assets/626baf85-9758-4afa-ae1f-e196b91be647)


# 80

## 扫目录

![image](https://github.com/user-attachments/assets/fad4a967-20e8-4795-8a40-ad99609f6d35)


访问发现网站使用了Drupal版本是7

![image](https://github.com/user-attachments/assets/56eaa087-1e23-4e23-a51a-52732b0abbc0)


![image](https://github.com/user-attachments/assets/07bb70c2-399b-4f1f-951f-caa9d5554a37)


## Drupal

### getshell

网上搜该CMS的漏洞exp

https://github.com/dreadlocked/Drupalgeddon2.git

![image](https://github.com/user-attachments/assets/059093e5-86c9-4287-a165-8b4e8a1c9bdc)


运行脚本，成功getshell

![image](https://github.com/user-attachments/assets/03ec6f8a-34fc-42e6-9b5c-2b077bbd024c)


发现是linux机器，但是权限很低

为了方便操作传一下shell连蚁剑

![image](https://github.com/user-attachments/assets/efe9610f-418c-483d-8143-9b18a145a6bc)


![image](https://github.com/user-attachments/assets/6c4b41e6-6d3c-463d-8c62-7d61de08d69b)


测试发现靶机是有curl wget的

![image](https://github.com/user-attachments/assets/b98ba5bc-6942-4fc4-bc8e-7ff21ed0f23e)


下载下我们的马

![image](https://github.com/user-attachments/assets/523efbd0-2130-4bdf-83e5-61f505359f8c)


![image](https://github.com/user-attachments/assets/de889f88-d40e-408a-8c75-c32ae7988e45)


但是这里有个问题，shell.php是用curl下载的，可以给777权限，但是wget下载的shell1.php给不了权限，但是连shell.php时返回数据为空，shell1.php却可以成功连接

![image](https://github.com/user-attachments/assets/b862fe0a-5675-4257-991e-8eceefeebe4b)


### flag1

翻一翻文件，发现第一个flag，刚开始还不知道是个啥玩意还去解密了下

![image](https://github.com/user-attachments/assets/7c053d12-cb45-46c3-8b7b-9175d33996f7)


Rahul Gehlaut

### 提权

不行，先提权吧

前面发现wget可用

看一下passwd能操作不

![image](https://github.com/user-attachments/assets/d551336f-c5d7-433c-b287-f3aefae2035c)


给他复制下来

然后在kali中加密一个密码出来

![image](https://github.com/user-attachments/assets/137a67a9-274c-428f-b84f-687d08c45724)


![image](https://github.com/user-attachments/assets/8f6baf8a-efec-49fb-b2d3-1cbc8ebf57b4)


给他加到靶机passwd后面。然后使用wget覆盖

![image](https://github.com/user-attachments/assets/b8f4ed8c-d727-4c69-99fb-52a1c72c31c2)


已经成功添加了

![image](https://github.com/user-attachments/assets/d909e796-7576-42d5-b564-9c38a675e5c3)


### 反弹shell

但是su命令要在shell中才能执行，所以我们需要反弹一个shell回来

但是正常的反弹shell方法不知道为啥总是出错包括

蚁剑虚拟终端执行命令

bp抓包通过一句话post传参

最终是由msf成功弹回shell，并且成功登录拥有root权限的xc用户

搜索drupal

![image](https://github.com/user-attachments/assets/7789b967-039c-48f4-8cfd-417cd16ca3cc)


设置攻击参数

![image](https://github.com/user-attachments/assets/b7aaf0c4-2ed5-41cf-a2cf-28342dc28799)


创建shell，并登录xc账户

`python3 -c 'import pty; pty.spawn("/bin/bash")'` 
这个命令的作用是通过 Python 启动一个伪终端，并将其连接到 `/bin/bash`，从而获得一个交互式 Bash shell。

![image](https://github.com/user-attachments/assets/3a4452e5-d4bb-44cd-9596-f61485fd919e)


### flag2

切换到root目录下发现有个root.txt打开它，得到第二个flag

![image](https://github.com/user-attachments/assets/5292dcda-ba66-450b-8412-72c981a60943)


bae11ce4f67af91fa58576c1da2aad4b

# 22

使用root权限的xc账户ssh链接认证失败

查到以下原因

### 1. **SSH 服务器配置问题**

- **检查 SSH 服务器是否允许密码认证**：
服务器的 SSH 配置文件 `/etc/ssh/sshd_config` 中可能禁用了密码认证。确保以下设置是允许的：如果设置为 `no`，需要将其修改为 `yes`，然后重启 SSH 服务：
    
    ```bash
    PasswordAuthentication yes
    ```
    
    ```bash
    sudo systemctl restart sshd
    ```
    

### 2. **账户权限问题**

- **确保账户没有被锁定**：
使用以下命令检查账户是否被锁定：
    
    ```bash
    sudo passwd -S 用户名
    ```
    
    如果账户状态是 `L`（locked），可以解锁账户：
    
    ```bash
    sudo passwd -u 用户名
    ```
    
- **账户是否有 SSH 登录权限**：
检查 `/etc/ssh/sshd_config` 中是否有 `AllowUsers` 或 `DenyUsers` 指令，确保你的用户被允许登录。

### 3. **网络问题**

- **确保网络连接正常**：
检查是否能从本地机器 ping 到服务器：
    
    ```bash
    ping 服务器地址
    ```
    
- **防火墙或安全组限制**：
检查服务器上的防火墙或云服务提供商的安全组配置，确认 SSH 端口（默认 22）是否允许入站连接。

### 4. **权限问题**

- **私钥文件权限错误**：
如果你使用的是 SSH 密钥认证，确保本地的私钥文件权限正确。私钥文件的权限应当是 `600`：
    
    ```bash
    chmod 600 ~/.ssh/id_rsa
    ```
    

### 5. **服务器密码策略**

- **密码过期或强制修改**：
服务器可能启用了密码过期策略，导致即使输入正确密码，也无法认证成功。使用管理员账户检查是否需要重置密码。

### 6. **SELinux 或 AppArmor 限制**

如果服务器启用了安全模块（如 SELinux 或 AppArmor），这些模块可能阻止 SSH 登录。可以暂时禁用这些安全模块进行测试。

### 7. **登录日志检查**

- 查看 `/var/log/auth.log` 或 `/var/log/secure` 中的日志，查找与 SSH 相关的错误信息，这通常能帮助定位问题的根源：
    
    ```bash
    tail -f /var/log/auth.log
    ```
