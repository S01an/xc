---
title: EDU实战案例
publish_date: 2024-11-07
---

## 杂谈

前段时间一直在实网环境挖洞，但是没出多少货，整个人很郁闷低沉，想过很多，也用过类似于“好挖的洞都被前辈们挖的差不多了，我们现在只是在凭运气碰洞”这种话来安慰自己，但到头来还是得沉下心慢慢挖。只不过不再内耗自己，每天起来告诉自己今天有进步就可以了，再为自己逃脱的话就是说，自己注定不是专门干挖SRC之类的，还是得综合性进步。

## 案例

是一个大学的接口导致敏感信息泄露

还是web渗透起手式信息收集到了该学校的一个学生账号，登录到统一门户后还是老样子在手工测试，无意间点了下漏扫插件，发现一个swagger-ui 的接口泄露

![image](https://github.com/user-attachments/assets/3e70003d-dd2b-4188-a8b5-bb5106383d77)


像这种东西一般就是粘贴到txt里面简单处理了一下然后放到Intruder里面跑一下看看响应包，跑的时候发现了一个响应包

接口：/api/shiro/group/activeUser

![image](https://github.com/user-attachments/assets/30dd2047-ffb3-42a3-994e-3daab65177f0)


其实这种情况很常见，甚至我前段时间有一次构造到已经能读目标服务器文件了，可惜到最后一步的时候被禁止了

构造pageNum参数后提示还缺个参数pageSize，跟这个包基本上一摸一样，通过构造得到一下得到以下数据包，经过测试这两个参数可以遍历全校学生老师，如下图

![image](https://github.com/user-attachments/assets/a84e8c47-0155-43e5-85e1-5806e09867af)

![image](https://github.com/user-attachments/assets/e14afa15-14e4-4cd5-b79e-214f07f294ec)

但是这里其实说到底没什么信息敏感，所以我们还得再找一下哪里能看敏感信息，本系统的个人中心身份证打码了，数据包里面也是打码的所以只能去翻翻其他地方，最后在应用中心-学工系统-学工应用-学生信息管理，找到以下页面

![image](https://github.com/user-attachments/assets/dff74e06-fad6-47d8-886f-2dbfe0256702)


抓包如图

前面测试越权的时候已经测试过了这个系统主要由sid，也就是sessionid来鉴权，替换显示不行让重新登陆，仔细观察对比后发现还有个id这个参数，我们继续替换，发包后，ok，回显包里面带回来了身份证

![image](https://github.com/user-attachments/assets/8e1fefc1-2808-4ab9-8ac4-b2b9897bf37d)

目前还在审不知道能给个几rank，总的来说就是接口测试加构造数据包。
学着学着发现接口测试博大精深，前几天还碰到个wsdl的接口测试，不过最后因为没权限不了了之。
最后还是要拒绝内耗，每天不论什么方面进步一点就够了。
