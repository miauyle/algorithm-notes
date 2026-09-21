---
title: 12 字符串与模拟
category: 综合专题
description: 字符串扫描、解析、格式化与规则模拟。
---

<a id="chapter-12"></a>

## 12 字符串与模拟

> [← 上一章](11-dynamic-programming.md) · [目录](../README.md) · [下一章 →](13-probability-bit.md)

这类题不一定有神奇优化，重点是把规则写全、按阶段执行。先列合法字符、终止条件、数值范围、输出格式，再写扫描器。

atoi 是跳空格→可选符号→连续数字；版本号是逐段比较；IPv4 是四段的长度、字符、前导零和值域检查。与面试官确认输入是否保证合法，别把平台题的有限规则当成完整的工业标准解析器。

**本章题目**

[14](#q-14) · [151](#q-151) · [6](#q-6) · [7](#q-7) · [8](#q-8) · [43](#q-43) · [165](#q-165) · [468](#q-468)


<a id="q-14"></a>

### [14. 最长公共前缀](https://leetcode.cn/problems/longest-common-prefix/)

**优先级 B · 题意**

求一组字符串的最长共同前缀。

**从直接思路到主解法**

先把第一个串作为候选前缀，与后续字符串逐个求公共前缀，候选只会缩短。

**手推例子**

[flower,flow,flight]：flower→flow→fl。

**正确性关键与边界**

某个串为空或候选已空即可终止；不是任意位置的公共子串。

**复杂度**

时间 O(S)，S 为输入总字符数的上界；临时候选字符串空间 O(L)。

**Java 主实现**

```java
class Solution {
    public String longestCommonPrefix(String[] strs) {
        if(strs.length == 0){
            return "";
        }
        String ans = strs[0];
        for(int i = 1; i < strs.length ; i++){
            ans = getSameStr(ans,strs[i]);
            if(ans.length() == 0){
                break;
            }
        }
        return ans;
    }
    private String getSameStr(String first,String second){
        int n = Math.min(first.length(),second.length());
        int index = 0;
        for(int i = 0;i < n ; i ++){
            if(first.charAt(i) == second.charAt(i)){
                index++;
            } else {
                break;
            }
        }
        return first.substring(0,index);
    }
}
```


<a id="q-151"></a>

### [151. 颠倒字符串中的单词](https://leetcode.cn/problems/reverse-words-in-a-string/)

**优先级 B · 题意**

倒转单词顺序，并把单词间空格规范为一个。

**从直接思路到主解法**

逐字符识别完整单词，把它们压到双端队列头部，最后用单空格连接。

**手推例子**

"  hello   world  " → "world hello"。

**正确性关键与边界**

不能直接倒转全部字符；要处理连续空格及首尾空格。Java String 不可变，输出本身需要新空间。

**复杂度**

时间 O(n)；辅助及输出空间 O(n)。

**Java 主实现**

```java
class Solution {
    public String reverseWords(String s) {
        int left = 0,right = s.length() -1;
        // 去掉头部的空格
        while(left <= right && s.charAt(left) == ' '){
            left++;
        }
        // 去掉尾部的空格
        while(left <= right && s.charAt(right) == ' '){
            right--;
        }
        // 字符串压入队列头部
        Deque<String> queue = new ArrayDeque<>();
        StringBuilder str = new StringBuilder();
        while(left <= right){
            char c = s.charAt(left);
            if(str.length() != 0 &&  c == ' '){
                queue.addFirst(str.toString());
                str.setLength(0);
            } else if(c != ' '){
                str.append(c);
            }
            left++;
        }
        queue.addFirst(str.toString());
        // 队列加入空格转为字符串
        return String.join(" ",queue);
    }
}
```


<a id="q-6"></a>

### [6. Z 字形变换](https://leetcode.cn/problems/zigzag-conversion/)

**优先级 C · 题意**

按 Z 字形排列字符，再逐行读出。

**从直接思路到主解法**

不用真的构造二维棋盘，只记录当前行和移动方向；到顶、到底才转向。

**手推例子**

ABCDE，3 行：第 0 行 AE，第 1 行 BD，第 2 行 C，得到 AEBDC。

**正确性关键与边界**

numRows=1 直接返回；方向是上下移动，与最终按行输出的顺序分开。

**复杂度**

时间 O(n)；辅助空间 O(n)。

**Java 主实现**

```java
class Solution {
    public  String convert(String s, int numRows) {
        if (numRows == 1) {
            return s;
        }
        // 先创建一个字符串StringBuilder 的list用来 存放不同行的字符
        List<StringBuilder> rows = new ArrayList<StringBuilder>();
        for (int rowNum = 0; rowNum < Math.min(numRows,s.length()); rowNum++) {
            rows.add(new StringBuilder());
        }
        // 根据字符在首行还是末行来变换 行方向 把得到的每一行字符串放到一个 StringBuilder中
        int row = 0;
        int step = 0;
        for (char c : s.toCharArray()) {
            rows.get(row).append(c);
            // 第一行 往后行要增加
            if (row == 0) {
                step = 1;
                // 最后一行，行要减小，往回走
            } else if (row == numRows - 1) {
                step = -1;
            }
            row += step;
        }
        // 遍历StringBuilder的list拼接字符串，然后返回
        StringBuilder ans = new StringBuilder();
        for (StringBuilder stringBuilder : rows) {
            ans.append(stringBuilder);
        }
        return ans.toString();
    }
}
```


<a id="q-7"></a>

### [7. 整数反转](https://leetcode.cn/problems/reverse-integer/)

**优先级 B · 题意**

反转 32 位有符号整数的十进制位；越界返回 0。

**从直接思路到主解法**

用取余拿末位，用除 10 去掉末位；每次在执行 rev*10+digit 前判断结果是否合法。

**手推例子**

120 → 21；-120 → -21；1534236469 → 0。

**正确性关键与边界**

正边界末位最多 7，负边界末位最少 -8。Java 负数取余保留负号，无需先取绝对值，避免 MIN_VALUE 的陷阱。

**复杂度**

时间 O(d)，d 为位数；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    public int reverse(int x) {
        int rev = 0;
        while (x != 0) {
            int digit = x % 10;
            x /= 10;
            if (rev > Integer.MAX_VALUE / 10 || (rev == Integer.MAX_VALUE / 10 && digit > 7)) return 0;
            if (rev < Integer.MIN_VALUE / 10 || (rev == Integer.MIN_VALUE / 10 && digit < -8)) return 0;
            rev = rev * 10 + digit;
        }
        return rev;
    }
}
```


<a id="q-8"></a>

### [8. 字符串转换整数 (atoi)](https://leetcode.cn/problems/string-to-integer-atoi/)

**优先级 B · 题意**

按题定规则解析前导空格、可选符号和连续数字，越界截断。

**从直接思路到主解法**

把扫描分成阶段：跳空格、读一个符号、读数字；首个非数字终止，不能重新在后面找数字。

**手推例子**

"  -42x7" → -42；"words 42" → 0；"+-12" → 0。

**正确性关键与边界**

边累加边检查范围，不要完整解析后才检查；负数的下界比正上界多一个单位。

**复杂度**

时间 O(n)；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    public static int myAtoi(String s) {
        int sign = 1,i = 0,n = s.length();
        long ans = 0;
        // 跳过空格
        while(i < n && s.charAt(i) == ' '){
            i++;
        }
        // 获取正负符号
        if(i < n && (s.charAt(i) == '-' || s.charAt(i) == '+' )){
            sign = s.charAt(i) == '-' ? -1 : 1;
            i++;
        }
        //读取数字
        for(;i < n ;i++){
            // 如果是数字
            if(s.charAt(i) >= '0' &&  s.charAt(i) <= '9'){
                // 如果越界整数范围
                ans = ans * 10 + s.charAt(i) - '0';
                if (ans > (long) Integer.MAX_VALUE) {
                    return sign == 1 ? Integer.MAX_VALUE : Integer.MIN_VALUE;
                }
            } else {
                // 不是数字，直接结束
                break;
            }
        }
        return (int)(sign * ans);
    }
}
```


<a id="q-43"></a>

### [43. 字符串相乘](https://leetcode.cn/problems/multiply-strings/)

**优先级 B · 题意**

两个非负整数字符串相乘，不转大整数。

**从直接思路到主解法**

模拟竖乘，i、j 位的乘积累加到 i+j+1；再从低位向高位统一处理进位。

**手推例子**

12×13：低位累加 6，中位 5，高位 1，得到 156。

**正确性关键与边界**

长度至多 m+n；高位可能是 0，要跳过但整体零不能变空串。标准输入无多余前导零。

**复杂度**

时间 O(mn)；辅助空间 O(m+n)。

**Java 主实现**

```java
class Solution {
    public String multiply(String num1, String num2) {
        if("0".equals(num1) || "0".equals(num2)){
            return "0";
        }
        int[] ans = new int[num1.length() + num2.length()];
        int ansLen = ans.length;
        // 分位分别计算乘积
        for(int i = num1.length() -1; i >= 0 ;i--){
            int n1 = num1.charAt(i) - '0';
            for(int j = num2.length() -1; j >= 0 ;j--){
                int n2 = num2.charAt(j) - '0';
                ans[i + j + 1] += n1 * n2;
            }
        }
        // 处理数组中乘积进位
        for(int i = ansLen - 1;i > 0;i--){
            ans[i - 1] += ans[i]/10;
            ans[i] %=10;
        }
        // 判断高位是否为0，为0舍弃高位
        int index = ans[0] == 0 ? 1 : 0;
        StringBuilder ansStr = new StringBuilder();
        while(index < ansLen){
            ansStr.append(ans[index++]);
        }
        return ansStr.toString();
    }
}
```


<a id="q-165"></a>

### [165. 比较版本号](https://leetcode.cn/problems/compare-version-numbers/)

**优先级 B · 题意**

按点分段比较版本号，忽略段前导零和末尾零段。

**从直接思路到主解法**

可 split 后逐段比较；双指针免去分割数组，用缺失段补零。实现进一步按去零后的长度和字典序比较，避免整数溢出。

**手推例子**

1.01 与 1.001 相等；1.0 与 1.0.0 相等；1.10 大于 1.2。

**正确性关键与边界**

不能当小数比较，也不能直接比较整串字典序；每个版本段必须按数值含义比较。

**复杂度**

时间 O(m+n)；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    public int compareVersion(String a, String b) {
        int i = 0, j = 0;
        while (i < a.length() || j < b.length()) {
            int endA = i, endB = j;
            while (endA < a.length() && a.charAt(endA) != '.') endA++;
            while (endB < b.length() && b.charAt(endB) != '.') endB++;
            while (i < endA && a.charAt(i) == '0') i++;
            while (j < endB && b.charAt(j) == '0') j++;
            int lenA = endA - i, lenB = endB - j;
            if (lenA != lenB) return lenA > lenB ? 1 : -1;
            for (int k = 0; k < lenA; k++) {
                if (a.charAt(i + k) != b.charAt(j + k)) {
                    return a.charAt(i + k) > b.charAt(j + k) ? 1 : -1;
                }
            }
            i = endA < a.length() ? endA + 1 : endA;
            j = endB < b.length() ? endB + 1 : endB;
        }
        return 0;
    }
}
```


<a id="q-468"></a>

### [468. 验证IP地址](https://leetcode.cn/problems/validate-ip-address/)

**优先级 C · 题意**

按题目限定格式判断 IPv4、IPv6 或 Neither。

**从直接思路到主解法**

先按分隔符识别候选类型，保留空段拆分，再逐段检查长度、字符集和值域。

**手推例子**

172.16.254.1 合法；172.16.254.01 非法；1.1.1.1. 非法。

**正确性关键与边界**

split 的 limit=-1 用于保留末尾空段；本题 IPv6 不支持 :: 压缩，不能冒充完整生产级 IP 校验器。

**复杂度**

时间 O(n)；分割字符串空间 O(n)。

**Java 主实现**

```java
class Solution {
    public String validIPAddress(String queryIP) {
        if(queryIP.chars().filter(ch -> ch == '.').count() == 3){
            return validIPv4(queryIP);
        } else if(queryIP.chars().filter(ch -> ch == ':').count() == 7){
            return validIPv6(queryIP);
        } else {
            return "Neither";
        }
    }
    private String validIPv4(String ip){
        String[] nums =  ip.split("\\.",-1);
        for(String num : nums){
            // 长度 1-3
            if(num.length() == 0 || num.length() > 3){
                return "Neither";
            }
            // 不含前导0
            if(num.charAt(0) == '0' && num.length() != 1){
                return "Neither";
            }
            // 都是数字
            for(char c :num.toCharArray()){
                if(c < '0' || c > '9'){
                    return "Neither";
                }
            }
            // 不大于255
            if(Integer.parseInt(num) > 255){
                return "Neither";
            }
        }
        return "IPv4";
    }
    private String validIPv6(String ip){
        String[] nums =  ip.split("\\:",-1);
        String hexdigits = "0123456789abcdefABCDEF";
        for(String num : nums){
            // 长度 4
            if(num.length() == 0 || num.length() > 4){
                return "Neither";
            }
            // 16进制数
            for(char c :num.toCharArray()){
                if(hexdigits.indexOf(c) == -1){
                    return "Neither";
                }
            }
        }
        return "IPv6";
    }
}
```



> [目录](../README.md)
