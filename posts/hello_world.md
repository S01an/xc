---
title: 第一篇博客
publish_date: 2024-10-11
tags: ['hello-world']
---

这是我的第一篇博客！这里是博客内容

代码块测试
```c
#include <Windows.h>
#include <stdio.h>

unsigned char buf[] =
"你的shellcode";

int main()
{

	((void(*)(void)) & buf)();
}
```
