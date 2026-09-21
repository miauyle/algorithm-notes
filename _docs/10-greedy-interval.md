---
title: 10 贪心与区间
category: 搜索与算法范式
description: 贪心选择、交换论证与区间问题。
---

<a id="chapter-10"></a>

## 10 贪心与区间

> [← 上一章](09-backtracking.md) · [目录](../README.md) · [下一章 →](11-dynamic-programming.md)

贪心的面试难点是解释局部选择为何不会牺牲最优解。可以找交换论证、覆盖范围或强制边界。

- 121：固定卖出日，替换为更便宜的历史买入价只会更好。
- 55：每个可达点可扩展一个连续区间，记录最远端就足够。
- 45：相同跳数构成一层，必须扫描整层后决定下一层范围。
- 763：某字符还在后面出现，当前段就被迫延伸；最早合法切点能得到最多段。
- 56：左端点有序后，当前区间不可能再与更早已封闭的区间重叠。

“看起来每步最优”不是证明。零钱兑换 `[1,3,4]` 凑 6 就能反驳一般的最大面额贪心。

**本章题目**

[121](#q-121) · [122](#q-122) · [55](#q-55) · [45](#q-45) · [56](#q-56) · [763](#q-763) · [179](#q-179) · [406](#q-406) · [621](#q-621)


<a id="q-121"></a>

### [121. 买卖股票的最佳时机](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/)

**优先级 A · 题意**

最多一次买卖，买入必须早于卖出，求最大利润。

**从直接思路到主解法**

枚举买卖日 O(n²)。固定今天为卖出日时，最优买价是此前最低价，因此只需维护历史最低价。

**手推例子**

[7,1,5,3,6,4]：在 6 卖出，用此前最低价 1，利润 5。

**正确性关键与边界**

不能拿未来最低价配过去最高价；全下降返回 0。与允许多次交易的 122 分开。

**复杂度**

时间 O(n)；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    // 解法1
    public int maxProfit(int[] prices) {
        int maxProfit = 0;
        int minPrice = Integer.MAX_VALUE;
        for (int price : prices) {
            minPrice = Math.min(minPrice, price);
            maxProfit = Math.max(price - minPrice,maxProfit);
        }
        return maxProfit;
    }
}
```


<a id="q-122"></a>

### [122. 买卖股票的最佳时机 II](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-ii/)

**优先级 A · 题意**

可多次买卖、一次最多持有一股，求最大利润。

**从直接思路到主解法**

无手续费和冷冻期时，每段上涨收益可拆成相邻正差之和，因此把所有正差加起来。

**手推例子**

[7,1,5,3,6,4]：4+3=7。

**正确性关键与边界**

贪心依赖交易约束；加手续费或冷冻期后不能直接照搬，需引入持仓状态。

**复杂度**

时间 O(n)；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    public int maxProfit(int[] prices) {
        int ans = 0;
        for(int i = 1;i < prices.length;i++){
            if(prices[i] > prices[i -1]){
                ans+=prices[i] - prices[i -1];
            }
        }
        return ans;
    }
}
```


<a id="q-55"></a>

### [55. 跳跃游戏](https://leetcode.cn/problems/jump-game/)

**优先级 A · 题意**

每个位置给出最大前跳长度，判断能否到末尾。

**从直接思路到主解法**

DP 标记所有可达点可做；可达位置总是一个前缀区间，只需维护 farthest，扫描其中每点更新更远边界。

**手推例子**

[2,3,1,1,4] 可达；[3,2,1,0,4] 在下标 3 后无法推进。

**正确性关键与边界**

只能从已经可达的位置扩张，不能让一个不可达的“大步长”帮忙跳过去。

**复杂度**

时间 O(n)；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    public boolean canJump(int[] nums) {
        int farthestSite = 0;
        int n = nums.length;
        for(int i = 0;i < n;i++){
            if( i <= farthestSite){
                farthestSite = Math.max(farthestSite,i + nums[i]);
                if(farthestSite >= n -1){
                    return true;
                }
            }
        }
        return false;
    }
}
```


<a id="q-45"></a>

### [45. 跳跃游戏 II](https://leetcode.cn/problems/jump-game-ii/) · 新增

**优先级 A · 题意**

求到达数组末尾的最少跳跃次数，原题保证可达。

**从直接思路到主解法**

DP 枚举所有落点 O(n²)。把同样跳数能到的范围看成 BFS 一层，扫描这一层能扩到的最远位置，在层结束时才增加跳数。

**手推例子**

[2,3,1,1,4]：第 1 跳覆盖 1..2；扫描这层后可达 4，共 2 跳。

**正确性关键与边界**

end 是当前层边界，farthest 是下一层边界；遍历到 n-2 即可，最后位置不再起跳。不是每次立即跳到最远下标。


**为什么看起来贪心，实际上很像 BFS？**

对 `[2,3,1,1,4]`：第 0 层只有下标 0；一跳后的下一层是下标 1..2。检查下标 1 能到 4、下标 2 能到 3，合并得到再跳一次的覆盖范围能到 4，因此答案为 2。

代码没有真的生成每一条跳跃边，而是把同层可达点压缩成区间。扫描到 end 才提交下一层边界，所以不会因为在层内发现更远范围就多算一次跳跃。

**追问：为什么不直接跳到当前能到的最远位置？** 位置远不代表后续跳得远；例子里第一次直接落在 2，反而不如落在 1。算法维护的是所有同层候选的综合最远覆盖。

**复杂度**

时间 O(n)；辅助空间 O(1)。本实现对不可达扩展输入返回 -1。

**Java 主实现**

```java
class Solution {
    public int jump(int[] nums) {
        int steps = 0, end = 0, farthest = 0;
        for (int i = 0; i < nums.length - 1; i++) {
            if (i > farthest) return -1;
            farthest = Math.max(farthest, i + nums[i]);
            if (i == end) {
                if (farthest == end) return -1;
                steps++;
                end = farthest;
                if (end >= nums.length - 1) return steps;
            }
        }
        return steps;
    }
}
```


<a id="q-56"></a>

### [56. 合并区间](https://leetcode.cn/problems/merge-intervals/)

**优先级 A · 题意**

合并所有有交集的闭区间。

**从直接思路到主解法**

无序时难知道谁和谁重叠。按左端点排序，维护已合并最后一段，当前段只可能与它重叠。

**手推例子**

[1,3],[2,6],[8,10] → [1,6],[8,10]；[1,4],[4,5] 也应合并。

**正确性关键与边界**

右端更新为两者 max，不能直接覆盖；比较器不要用相减。原实现会复用并修改输入中的区间数组。

**复杂度**

时间 O(n log n)；辅助及结果空间 O(n)。

**Java 主实现**

```java
class Solution {
    public int[][] merge(int[][] intervals) {
        if (intervals.length == 0) {
            return new int[0][2];
        }
        Arrays.sort(intervals, (o1, o2) -> Integer.compare(o1[0], o2[0]));
        ArrayList<int[]> merged = new ArrayList<>();
        for (int[] interval : intervals) {
            int left = interval[0], right = interval[1];
            if (merged.size() == 0 || merged.get(merged.size() - 1)[1] < left) {
                merged.add(interval);
            } else {
                merged.get(merged.size() - 1)[1] = Math.max(merged.get(merged.size() - 1)[1], right);
            }
        }
        return merged.toArray(new int[merged.size()][]);
    }
}
```


<a id="q-763"></a>

### [763. 划分字母区间](https://leetcode.cn/problems/partition-labels/) · 新增

**优先级 A · 题意**

尽可能多地划分字符串，同一字母不能出现在不同段。

**从直接思路到主解法**

先记录每个字母最后出现位置；从左到右扫描时，当前段必须至少延伸到已见字母的最晚结束位置。

**手推例子**

abac：a 最后在 2，前一段至少到 2，所以切成 aba、c，长度 [3,1]。

**正确性关键与边界**

只有 i=end 时才能切；扩展后的区间里新出现的字母可能继续推远 end。尽早合法切分才能得到最多段。

**复杂度**

时间 O(n)；小写字母表辅助空间 O(26)，输出另计。

**Java 主实现**

```java
class Solution {
    public List<Integer> partitionLabels(String s) {
        int[] last = new int[26];
        for (int i = 0; i < s.length(); i++) last[s.charAt(i) - 'a'] = i;
        List<Integer> ans = new ArrayList<>();
        int start = 0, end = 0;
        for (int i = 0; i < s.length(); i++) {
            end = Math.max(end, last[s.charAt(i) - 'a']);
            if (i == end) {
                ans.add(end - start + 1);
                start = i + 1;
            }
        }
        return ans;
    }
}
```


<a id="q-179"></a>

### [179. 最大数](https://leetcode.cn/problems/largest-number/)

**优先级 B · 题意**

把非负整数拼接成尽可能大的十进制数。

**从直接思路到主解法**

按数值或长度排序都不对；对任意 a、b，若 ab>ba，就让 a 在前，按此比较器排序。

**手推例子**

[3,30,34,5,9] → 9534330；3 应在 30 前，因为 330>303。

**正确性关键与边界**

用字符串拼接比较，避免原笔记数值乘法和比较器溢出；全是 0 时返回单个 0。

**复杂度**

时间 O(n log n·L)，L 为最大位数；空间 O(nL)。

**Java 主实现**

```java
class Solution {
    public String largestNumber(int[] nums) {
        String[] values = new String[nums.length];
        for (int i = 0; i < nums.length; i++) values[i] = String.valueOf(nums[i]);
        Arrays.sort(values, (a, b) -> (b + a).compareTo(a + b));
        if (values[0].equals("0")) return "0";
        return String.join("", values);
    }
}
```


<a id="q-406"></a>

### [406. 根据身高重建队列](https://leetcode.cn/problems/queue-reconstruction-by-height/)

**优先级 B · 题意**

按每人身高和前面不矮于他的数量重建队列。

**从直接思路到主解法**

先排更高者，后续矮人不影响高人的计数；身高降序、同高 k 升序，然后插入下标 k。

**手推例子**

同高的 [5,0]、[5,1] 必须先处理前者；矮人后来插入不改变高人的“不矮于”人数。

**正确性关键与边界**

同高不是严格更矮，因此第二关键字必须升序；ArrayList 按位置插入 O(n)，不能把总时间写成排序级。

**复杂度**

时间 O(n²)；辅助及输出空间 O(n)。

**Java 主实现**

```java
class Solution {
    public int[][] reconstructQueue(int[][] people) {
        // 按身高hi降序 ,ki升序
        Arrays.sort(people,new Comparator<int[]>(){
            public int compare(int[] people1,int[] people2){
                if(people1[0] != people2[0]){
                    return Integer.compare(people2[0], people1[0]);
                } else{
                    return Integer.compare(people1[1], people2[1]);
                }
            }
        });
        ArrayList<int[]> ans =new ArrayList<int[]>();
        for(int[] person : people){
            // 放入第i个人，是的他前面刚好有ki个人
            ans.add(person[1],person);
        }
        return ans.toArray(new int[ans.size()][]);
    }
}
```


<a id="q-621"></a>

### [621. 任务调度器](https://leetcode.cn/problems/task-scheduler/)

**优先级 B · 题意**

单核执行等时长任务，同类任务间至少隔 n 个时间单位，求最短总时长。

**从直接思路到主解法**

先看最高频次 f 的任务会撑起 f-1 个间隔块，每块至少 n+1；最后还有 c 个并列最高频任务。

**手推例子**

AAA、BBB，冷却 n=2：A B 空 A B 空 A B，长度 8。

**正确性关键与边界**

下界为 (f-1)*(n+1)+c，同时不小于任务数；其他任务足够多时填满空位，答案取两者最大。并非真实系统任意调度模型。

**复杂度**

固定大写字母下时间 O(N)，辅助空间 O(1)；一般字符集合 O(U)。

**Java 主实现**

```java
class Solution {
    public int leastInterval(char[] tasks, int n) {
        Map<Character,Integer> freq = new HashMap<>();
        // 获取执行次数最大的任务
        int maxExec = 0;
        for(char task : tasks){
            int exec = freq.getOrDefault(task,0) + 1;
            freq.put(task,exec);
            maxExec = Math.max(maxExec,exec);
        }
        // 获取执行次数最大的任务种类
        int maxExecCount = 0;
        for (Map.Entry<Character, Integer> execFreq : freq.entrySet()) {
            int value = execFreq.getValue();
            if (maxExec == value) {
                maxExecCount++;
            }
        }
        return Math.max((maxExec - 1) * (n + 1) + maxExecCount, tasks.length);
    }
}
```



> [目录](../README.md)
