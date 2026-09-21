---
title: 13 概率与位运算
category: 综合专题
description: 位运算性质、随机映射与概率说明。
---

<a id="chapter-13"></a>

## 13 概率与位运算

> [← 上一章](12-string-simulation.md) · [目录](../README.md)

位运算题先说清性质与前提。异或消对只适用于对应的出现次数模型；`x & (x-1)` 每次删掉一个 1；随机数题则必须解释每个输出的概率为何相同。

复杂度里也要明确模型：32 位机器整数的逐位处理可视作常数时间；若题目推广到任意位长大整数，就必须把位数纳入分析。

**本章题目**

[136](#q-136) · [461](#q-461) · [338](#q-338) · [470](#q-470)


<a id="q-136"></a>

### [136. 只出现一次的数字](https://leetcode.cn/problems/single-number/)

**优先级 A · 题意**

其余元素恰好出现两次，只有一个出现一次，找它。

**从直接思路到主解法**

哈希计数能做；异或满足 x^x=0、x^0=x，并满足交换结合律，所以全部异或只剩单值。

**手推例子**

[4,1,2,1,2] 异或后剩 4。

**正确性关键与边界**

依赖其他元素恰出现两次；出现三次或两个单值都要换模型。

**复杂度**

时间 O(n)；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    public int singleNumber(int[] nums) {
        int ans = 0;
        for(int num : nums){
            ans ^=num;
        }
        return ans;
    }
}
```


<a id="q-461"></a>

### [461. 汉明距离](https://leetcode.cn/problems/hamming-distance/)

**优先级 B · 题意**

求两个整数二进制表示不同位的数量。

**从直接思路到主解法**

异或后为 1 的位恰好不同；反复执行 z=z&(z-1) 删除最低位的 1 并计数。

**手推例子**

1=001、4=100，异或 101，有 2 个 1。

**正确性关键与边界**

固定 32 位整数上最多 32 次；不能拿十进制字符做比较。

**复杂度**

时间 O(popcount(x^y))，32 位下视为 O(1)；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    public int hammingDistance(int x, int y) {
        int z = x ^ y,ans = 0;
        while (z != 0) {
            z &=z-1;
            ans++;
        }
        return ans;
    }
}
```


<a id="q-338"></a>

### [338. 比特位计数](https://leetcode.cn/problems/counting-bits/)

**优先级 B · 题意**

返回 0..n 每个整数二进制 1 的数量。

**从直接思路到主解法**

每个数单独数位 O(n log n)；去掉最低位后问题已算过，bits[i]=bits[i>>1]+(i&1)。

**手推例子**

5 为 101，bits[5]=bits[2]+1=2。

**正确性关键与边界**

数组本身占 O(n)；只有在明确不计返回结果时，额外空间才是 O(1)。

**复杂度**

时间 O(n)；额外辅助 O(1)，输出 O(n)。

**Java 主实现**

```java
class Solution {
    public int[] countBits(int n) {
        int[] bits = new int[n +1];
        for(int i = 0;i <= n; i++){
            bits[i] = bits[i >> 1] + (i &1);
        }
        return bits;
    }
}
```


<a id="q-470"></a>

### [470. 用 Rand7() 实现 Rand10()](https://leetcode.cn/problems/implement-rand10-using-rand7/)

**优先级 C · 题意**

仅调用均匀且独立的 rand7，生成均匀 rand10。

**从直接思路到主解法**

两次 rand7 组成 7×7 的 49 个等概率格子，保留其中 40 个并按 10 等分；剩余 9 个重试。

**手推例子**

x=(rand7()-1)*7+rand7()；若 x≤40，返回 (x-1)%10+1。

**正确性关键与边界**

直接 rand7()%10 或两个随机数相加都不均匀。拒绝采样次数没有有限最坏上界，但期望有限。

**复杂度**

期望 O(1) 时间，辅助空间 O(1)；基础版期望 rand7 调用次数为 2×49/40。

**Java 主实现**

```java
class Solution extends SolBase {
    public int rand10() {
        while (true) {
            int x = (rand7() - 1) * 7 + rand7();
            if (x <= 40) return (x - 1) % 10 + 1;
        }
    }
}
```



> [目录](../README.md)
