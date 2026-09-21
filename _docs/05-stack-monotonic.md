---
title: 05 栈与单调结构
category: 基础数据结构
description: 栈、单调栈、单调队列与表达式处理。
---

<a id="chapter-05"></a>

## 05 栈与单调结构

> [← 上一章](04-linked-list.md) · [目录](../README.md) · [下一章 →](06-heap-design.md)

普通栈处理后进先出的嵌套关系；单调栈/队列保留还可能成为答案的候选。一个元素被丢弃时，必须有明确理由。

| 题目 | 存什么 | 单调方向 | 弹出的含义 |
| --- | --- | --- | --- |
| 739 每日温度 | 下标 | 温度从栈底到顶不增 | 找到了它的第一个更高温度 |
| 84 最大矩形 | 下标 | 高度从栈底到顶递增 | 某柱子的右边界已确定 |
| 239 窗口最大值 | 下标 | 值从队头到尾递减 | 被更晚且不小的值支配，或已经过期 |
| 402 移掉 K 位 | 数字 | 倾向保持不降 | 删除较高位的大数字使数更小 |

嵌套 while 并不自动意味着平方时间：每个下标只进出一次，所以这些线性扫描通常可以按“总入栈和出栈次数”分析。

**本章题目**

[20](#q-20) · [232](#q-232) · [739](#q-739) · [239](#q-239) · [84](#q-84) · [85](#q-85) · [402](#q-402) · [32](#q-32) · [394](#q-394) · [227](#q-227) · [224](#q-224)


<a id="q-20"></a>

### [20. 有效的括号](https://leetcode.cn/problems/valid-parentheses/)

**优先级 A · 题意**

判断三类括号是否正确嵌套。

**从直接思路到主解法**

计数只能判断数量，无法区分 ([)]。栈记录尚未匹配的左括号，右括号必须与最近一个左括号配对。

**手推例子**

([]) 为 true；([)] 为 false。

**正确性关键与边界**

右括号出现时栈不能为空；遍历结束栈必须空。题目只含括号；一般解析器还要定义其他字符行为。

**复杂度**

时间 O(n)；辅助空间 O(n)。

**Java 主实现**

```java
class Solution {
    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') stack.push(c);
            else {
                if (stack.isEmpty()) return false;
                char left = stack.pop();
                if (c == ')' && left != '(') return false;
                if (c == ']' && left != '[') return false;
                if (c == '}' && left != '{') return false;
            }
        }
        return stack.isEmpty();
    }
}
```


<a id="q-232"></a>

### [232. 用栈实现队列](https://leetcode.cn/problems/implement-queue-using-stacks/)

**优先级 A · 题意**

仅使用栈实现队列的入队、出队、查看队头。

**从直接思路到主解法**

一个栈压入，一个栈弹出；输出栈为空时，把输入栈全部倒过去，顺序恰好反转。

**手推例子**

push(1),push(2),pop() 得 1；随后 push(3)，下一次 pop 仍应得 2。

**正确性关键与边界**

只有输出栈为空才能倒入，否则破坏旧元素顺序。一次倒入可能 O(n)，不是每次操作最坏 O(1)。

**复杂度**

操作均摊 O(1)，单次 pop/peek 最坏 O(n)；空间 O(n)。

**Java 主实现**

```java
class MyQueue {
    private Deque<Integer> inStack;
    private Deque<Integer> outStack;
    public MyQueue() {
        inStack = new ArrayDeque<>();
        outStack = new ArrayDeque<>();
    }
    public void push(int x) {
        inStack.push(x);
    }
    public int pop() {
        if (outStack.isEmpty()) {
            inToOut();
        }
        return outStack.pop();
    }
    public int peek() {
        if (outStack.isEmpty()) {
            inToOut();
        }
        return outStack.peek();
    }
    public boolean empty() {
        return inStack.isEmpty() && outStack.isEmpty();
    }
    private void inToOut() {
        while (!inStack.isEmpty()) {
            outStack.push(inStack.pop());
        }
    }
}
```


<a id="q-739"></a>

### [739. 每日温度](https://leetcode.cn/problems/daily-temperatures/)

**优先级 A · 题意**

每一天要等几天才出现更高温度，无则 0。

**从直接思路到主解法**

逐天向后扫 O(n²)。单调递减栈保存尚未等到更高温度的下标，新温度出现时批量结算较低项。

**手推例子**

[73,74,75,71,69,72] → [1,1,0,2,1,0]。

**正确性关键与边界**

只有严格更高才能弹出；答案是下标差，不是温度差。栈里不是全部历史，只是尚未解决的候选。

**复杂度**

时间 O(n)；辅助空间 O(n)，输出 O(n)。

**Java 主实现**

```java
class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        if(temperatures.length == 0){
            return new int[0];
        }
        int n = temperatures.length;
        int[] ans = new int[n];
        LinkedList<Integer> stack = new LinkedList<Integer>();
        for(int i = 0;i < n ;i++){
            while(!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]){
                int preIndex = stack.poll();
                ans[preIndex] = i - preIndex;
            }
            stack.push(i);
        }
        return ans;
    }
}
```


<a id="q-239"></a>

### [239. 滑动窗口最大值](https://leetcode.cn/problems/sliding-window-maximum/)

**优先级 A · 题意**

输出每个长度为 k 的滑动窗口最大值。

**从直接思路到主解法**

每窗扫描 O(nk)，堆 O(n log n)。单调队列删除更早且不更大的候选，它们既不优于新元素，又更早过期。

**手推例子**

[1,3,-1,-3,5]，k=3 → [3,3,5]。

**正确性关键与边界**

队列存下标才能判断过期；队头过期条件 index≤i-k；队尾按值维护递减。每个下标至多入队、出队一次。

**复杂度**

时间 O(n)；辅助空间 O(k)，输出 O(n-k+1)。

**Java 主实现**

```java
class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        Deque<Integer> deque = new LinkedList<Integer>();
        // 先遍历k个元素长度
        for(int i = 0;i < k;i++){
            while(!deque.isEmpty() && nums[i] >= nums[deque.peekLast()]){
                deque.pollLast();
            }
            deque.offerLast(i);
        }
        int[] ans = new int[nums.length - k + 1];
        ans[0] = nums[deque.peekFirst()];
        // 移动指针，保持窗口长度为k
        for(int i = k; i < nums.length ;i++){
            // 如果当前元素对应值大于队列末尾元素对于值，说明对列尾对应元素已无效
            while(!deque.isEmpty() && nums[i] >= nums[deque.peekLast()]){
                deque.pollLast();
            }
            deque.offerLast(i);
            // 保持窗口长度为k，删除窗口外下标
            while(deque.peekFirst() <= i - k){
                deque.pollFirst();
            }
            // 收集每次指针移动窗口中的最大值
            ans[i - k + 1] = nums[deque.peekFirst()];
        }
        return ans;
    }
}
```


<a id="q-84"></a>

### [84. 柱状图中最大的矩形](https://leetcode.cn/problems/largest-rectangle-in-histogram/)

**优先级 B · 题意**

在柱状图中找最大矩形面积。

**从直接思路到主解法**

枚举每根柱子向两侧找矮柱是 O(n²)。单调递增栈在遇到更矮柱时确定此前柱子的右边界，栈内前驱给左边界。

**手推例子**

[2,1,5,6,2,3]：高度 5 能覆盖 5、6 两列，面积 10。

**正确性关键与边界**

宽度=右边界-左边界-1；相等高度的处理要与边界定义一致。本实现左边严格小，右边小于等于，仍不漏最大值。

**复杂度**

时间 O(n)；辅助空间 O(n)。

**Java 主实现**

```java
class Solution {
    public int largestRectangleArea(int[] heights) {
        int n = heights.length;
        Deque<Integer> stack = new LinkedList<Integer>();
        int[] left = new int[n];
        int[] right = new int[n];
        Arrays.fill(right, n);
        for(int i = 0; i < n; i++){
            while(!stack.isEmpty() && heights[stack.peek()] >= heights[i]){
                right[stack.pop()] = i;
            }
            left[i] = stack.isEmpty() ? -1 : stack.peek();
            stack.push(i);
        }
        int ans = 0;
        // 计算面积
        for(int i = 0; i < n ; i++){
            ans = Math.max(ans,(right[i] - left[i] - 1) * heights[i]);
        }
        return ans;
    }
}
```


<a id="q-85"></a>

### [85. 最大矩形](https://leetcode.cn/problems/maximal-rectangle/)

**优先级 C · 题意**

在 0/1 矩阵里找全 1 的最大矩形。

**从直接思路到主解法**

按行累积各列连续 1 的高度，每处理一行就得到一个 84 题的柱状图；逐行求最大矩形。

**手推例子**

当前高度 [2,1,2] 下一行 [1,1,0] 更新为 [3,2,0]，然后求柱状图面积。

**正确性关键与边界**

遇到 0 高度必须清零；不能把正方形的 min 三邻居公式直接用于任意矩形。

**复杂度**

时间 O(mn)；辅助空间 O(n)，n 为列数。

**Java 主实现**

```java
class Solution {
    public int maximalRectangle(char[][] matrix) {
        if (matrix.length == 0 || matrix[0].length == 0) return 0;
        int[] heights = new int[matrix[0].length];
        int ans = 0;
        for (char[] row : matrix) {
            for (int c = 0; c < heights.length; c++) {
                heights[c] = row[c] == '1' ? heights[c] + 1 : 0;
            }
            ans = Math.max(ans, rectangle(heights));
        }
        return ans;
    }
    private int rectangle(int[] h) {
        Deque<Integer> stack = new ArrayDeque<>();
        int ans = 0;
        for (int i = 0; i <= h.length; i++) {
            int cur = i == h.length ? 0 : h[i];
            while (!stack.isEmpty() && h[stack.peek()] > cur) {
                int height = h[stack.pop()];
                int left = stack.isEmpty() ? -1 : stack.peek();
                ans = Math.max(ans, height * (i - left - 1));
            }
            if (i < h.length) stack.push(i);
        }
        return ans;
    }
}
```


<a id="q-402"></a>

### [402. 移掉 K 位数字](https://leetcode.cn/problems/remove-k-digits/)

**优先级 B · 题意**

删除 k 个数字，使剩余数字表示的非负数最小。

**从直接思路到主解法**

从左到右看，较高位越小越优；新数字更小时尽量删除前面较大的尾部，形成单调栈。

**手推例子**

1432219 删 3 位 → 1219；10200 删 1 位 → 200。

**正确性关键与边界**

遍历后若还剩删除额度，从尾部删；再去前导零，空结果返回 0。

**复杂度**

时间 O(n)；辅助空间 O(n)。

**Java 主实现**

```java
class Solution {
    public String removeKdigits(String num, int k) {
        if(num == null){
            return "0";
        }
        LinkedList<Character> queue = new LinkedList<>();
        for(int i = 0; i < num.length(); i++){
            char cur = num.charAt(i);
            // 删除栈顶大于当前数的栈顶元素
            while(!queue.isEmpty() && k > 0 && queue.peekLast() > cur){
                queue.pollLast();
                k--;
            }
            queue.offerLast(cur);
        }
        // 删后，还没删到k个，继续删栈顶元素（数字后面开始删）
        for(int i = 0; i < k; i++){
            queue.pollLast();
        }
        // 从栈中组装会最小数字，如果有前导0，跳过，不组装它
        StringBuilder str = new StringBuilder();
        // 前导零
        boolean leaderZero = true;
        while(!queue.isEmpty()){
            char cur = queue.pollFirst();
            if(leaderZero && cur == '0'){
                continue;
            }
            leaderZero = false;
            str.append(cur);
        }
        return str.length() == 0 ? "0" : str.toString();
    }
}
```


<a id="q-32"></a>

### [32. 最长有效括号](https://leetcode.cn/problems/longest-valid-parentheses/)

**优先级 B · 题意**

求最长连续合法括号子串的长度。

**从直接思路到主解法**

暴力检查区间；栈可记未匹配位置。更省空间的方案左右各扫一次，计数相等时更新，失衡时清零。

**手推例子**

"(()" 从左扫会漏掉末尾 ()；反向扫描补足，答案 2。

**正确性关键与边界**

左扫遇右括号过多清零；右扫遇左括号过多清零。该常数空间方案只适用于一种括号。

**复杂度**

时间 O(n)；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    public int longestValidParentheses(String s) {
        int left = 0, right = 0,maxLength = 0;
        for(int i = 0 ;i < s.length() ;i++){
            if(s.charAt(i) == '('){
                left++;
            } else{
                right++;
            }
            if(left == right){
                maxLength = Math.max(maxLength,right * 2);
            } else if(right > left){
                left = right = 0;
            }
        }
        left = right = 0;
        for(int i =  s.length() - 1 ;i >=0  ;i--){
            if(s.charAt(i) == '('){
                left++;
            } else{
                right++;
            }
            if(left == right){
                maxLength = Math.max(maxLength,right * 2);
            } else if(left > right){
                left = right = 0;
            }
        }
        return maxLength;
    }
}
```


<a id="q-394"></a>

### [394. 字符串解码](https://leetcode.cn/problems/decode-string/)

**优先级 B · 题意**

展开 k[片段]，允许嵌套和多位次数。

**从直接思路到主解法**

遇到左括号保存外层已完成字符串和重复次数，开始新片段；遇到右括号恢复外层并追加重复片段。

**手推例子**

2[a3[b]]：先解出 abbb，再重复得到 abbbabbb。

**正确性关键与边界**

数字需要累积多位；进入括号后 num 清零；复杂度要计解码后的长度，不能只看输入。

**复杂度**

设输入 n、输出 L、嵌套深度 d；本实现保守时间 O(n+(d+1)L)，空间 O(n+L)。

**Java 主实现**

```java
class Solution {
    public String decodeString(String s) {
        Deque<Integer> counts = new ArrayDeque<>();
        Deque<StringBuilder> prefixes = new ArrayDeque<>();
        StringBuilder cur = new StringBuilder();
        int num = 0;
        for (char ch : s.toCharArray()) {
            if (ch >= '0' && ch <= '9') num = num * 10 + ch - '0';
            else if (ch == '[') {
                counts.push(num);
                prefixes.push(cur);
                cur = new StringBuilder();
                num = 0;
            } else if (ch == ']') {
                int repeat = counts.pop();
                StringBuilder outer = prefixes.pop();
                for (int i = 0; i < repeat; i++) outer.append(cur);
                cur = outer;
            } else cur.append(ch);
        }
        return cur.toString();
    }
}
```


<a id="q-227"></a>

### [227. 基本计算器 II](https://leetcode.cn/problems/basic-calculator-ii/)

**优先级 B · 题意**

计算含 +、-、*、/ 和空格的合法表达式，不含括号。

**从直接思路到主解法**

加减先存为带符号项，乘除立即作用到上一项；最后求和即可实现优先级。

**手推例子**

3+2*2：栈先有 3，2 与后一项相乘变 4，求和 7。

**正确性关键与边界**

preSign 是当前数字前的运算符；最后一个字符也要触发结算；整数除法向零截断。

**复杂度**

时间 O(n)；辅助空间 O(n)。

**Java 主实现**

```java
class Solution {
    public int calculate(String s) {
        // 数字前符号
        char preSign = '+';
        LinkedList<Integer> stack = new LinkedList<>();
        // 遍历到的数字
        int num = 0,n = s.length();
        for (int i = 0; i < n; i++) {
            // 如果是数字，把数字字符串转化成int
            char cha = s.charAt(i);
            if (Character.isDigit(cha)) {
                num = num * 10 + cha - '0';
            }
            // 如果是运算符号,或者最后一个字符（最后一个字符不可能是运算符，直接加入计算）
            if (!Character.isDigit(cha) && cha != ' ' || i == n - 1) {
                switch (preSign) {
                    case '+':
                    stack.push(num);
                    break;
                    case '-':
                    stack.push(-num);
                    break;
                    case '*':
                    stack.push(stack.pop() * num);
                    break;
                    default:
                    stack.push(stack.pop() / num);
                }
                // 给下一个数字前的符号赋值
                preSign = cha;
                // num 置空
                num = 0;
            }
        }
        int ans = 0;
        while (!stack.isEmpty()) {
            ans += stack.pop();
        }
        return ans;
    }
}
```


<a id="q-224"></a>

### [224. 基本计算器](https://leetcode.cn/problems/basic-calculator/)

**优先级 B · 题意**

计算含 +、-、括号与空格的合法表达式。

**从直接思路到主解法**

括号外的负号会翻转内部符号；栈保存每层的累计符号，扫描数字后乘当前符号加到总和。

**手推例子**

1-(2-3)=2：内层 2 带负号，3 经两次翻转带正号。

**正确性关键与边界**

此法利用只有加减；不能直接扩展为有乘除的完整表达式解析器。注意一元负号。

**复杂度**

时间 O(n)；辅助空间 O(d)，d 为括号深度。

**Java 主实现**

```java
class Solution {
    public int calculate(String s) {
        LinkedList<Integer> ops = new LinkedList<>();
        int n = s.length(),index = 0,sign = 1;
        ops.push(1);
        int ans = 0;
        while(index < n){
            char cur = s.charAt(index);
            if(cur == ' '){
                index++;
            } else if(cur == '+'){
                sign = ops.peek();
                index++;
            } else if(cur == '-'){
                sign = -ops.peek();
                index++;
            } else if(cur == '('){
                ops.push(sign);
                index++;
            } else if(cur == ')'){
                ops.pop();
                index++;
            } else {
                // 根据符号累加数字
                int num = 0;
                while(index < n && Character.isDigit(s.charAt(index))){
                    num = num * 10 + s.charAt(index++) - '0';
                }
                ans+= sign * num;
            }
        }
        return ans;
    }
}
```



> [目录](../README.md)
