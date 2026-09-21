---
title: 02 窗口与前缀
category: 基础数据结构
description: 滑动窗口、前缀和与区间统计。
---

<a id="chapter-02"></a>

## 02 窗口与前缀

> [← 上一章](01-array-two-pointers.md) · [目录](../README.md) · [下一章 →](03-binary-search.md)

先分清“滑动窗口”和“前缀和”。窗口依赖左右边界可单向移动；前缀和把区间关系变成两个前缀之间的关系。

| 问题 | 状态 | 何时移动左端 | 何时记录 |
| --- | --- | --- | --- |
| 3 最长无重复 | 窗口字符集合 | 出现重复时一直缩 | 恢复无重复之后 |
| 209 最短达标和 | 窗口和 | 和已达到目标时一直缩 | 缩小之前 |
| 76 最小覆盖 | 还欠多少字符 | 不再欠字符时一直缩 | 缩小之前 |
| 438 异位词 | 固定长度频率表 | 长度超过模式串 | 长度恰好满足时 |
| 560 和为 K | 历史前缀频数 | 不使用左右滑窗 | 查询 pre-k 的次数 |

一个反例就能解释正数前提：数组 `[1,-1,5]`、目标 `5`。普通“达标才缩”的算法在总和为 5 时先记长度 3，删除 1 后和为 4 就停止，错过后面的单元素 `[5]`。允许负数时，要重新设计方法。

Java 的 `char` 是 UTF-16 代码单元。这里沿用题目的字符语义；若面试改问任意 Unicode 字符，需要先确认是否按 code point 或用户可见字符计数。

**本章题目**

[3](#q-3) · [209](#q-209) · [76](#q-76) · [438](#q-438) · [560](#q-560) · [238](#q-238) · [437](#q-437)


<a id="q-3"></a>

### [3. 无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/)

**优先级 A · 题意**

求不含重复字符的最长连续子串长度。

**从直接思路到主解法**

枚举起点并扫描可到 O(n²)。保留上一轮窗口的字符集合；右端加入重复字符时，左端一直移到重复消失。

**手推例子**

abba：读第二个 b 时先删 a 再删旧 b，窗口成为 b；最后得到 ba，答案 2。

**正确性关键与边界**

维护窗口内无重复；不能只删一次，也不能把子串写成可跳过字符的子序列。两端各最多移动 n 次。


**把“为什么能滑动”讲完整**

当右端读到一个重复字符时，旧窗口内部原本没有重复，因此冲突来自新字符和窗口内的同字符。删除左端元素直到旧同字符离开，恢复合法窗口。对这个右端而言，这是能保留的最长合法后缀；之后再比较全局最大值即可。

| right 读入 | 调整前窗口 | 左端删除 | 调整后窗口 | 当前最大长度 |
| --- | --- | --- | --- | --- |
| a | 空 | 无 | a | 1 |
| b | a | 无 | ab | 2 |
| b | ab | a、旧 b | b | 2 |
| a | b | 无 | ba | 2 |

**追问：可否直接跳 left？** 可以，记录每个字符上次下标，令 `left=max(left,last[c]+1)`。max 不能省：旧下标可能已经在窗口之外，不能让 left 后退。

**复杂度**

时间 O(n)（哈希平均）；辅助空间 O(min(n,字符集大小))。

**Java 主实现**

```java
class Solution {
    public int lengthOfLongestSubstring(String s) {
        Set<Character> window = new HashSet<>();
        int left = 0, ans = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            while (window.contains(c)) window.remove(s.charAt(left++));
            window.add(c);
            ans = Math.max(ans, right - left + 1);
        }
        return ans;
    }
}
```


<a id="q-209"></a>

### [209. 长度最小的子数组](https://leetcode.cn/problems/minimum-size-subarray-sum/)

**优先级 A · 题意**

正整数数组中，求和至少为 target 的最短连续子数组长度。

**从直接思路到主解法**

枚举区间 O(n²)。正数保证右扩使和不减、左缩使和不增，达到目标后不断缩左并更新最短长度。

**手推例子**

target=7、[2,3,1,2,4,3] → [4,3]，长度 2。

**正确性关键与边界**

必须是正数条件；若允许负数，普通滑窗不再可靠。无解返回 0，窗口长度含两端。

**复杂度**

时间 O(n)；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    public int minSubArrayLen(int target, int[] nums) {
        if(nums.length == 0){
            return 0;
        }
        int start = 0,end = 0,sum = 0,n = nums.length;
        int minLength = Integer.MAX_VALUE;
        while(end < n){
            sum+=nums[end];
            while(sum >= target){
                minLength = Math.min(minLength,end - start + 1);
                sum-=nums[start++];
            }
            end++;
        }
        return minLength == Integer.MAX_VALUE ? 0 : minLength;
    }
}
```


<a id="q-76"></a>

### [76. 最小覆盖子串](https://leetcode.cn/problems/minimum-window-substring/)

**优先级 A · 题意**

找包含 t 全部字符及其重复次数的最短子串。

**从直接思路到主解法**

枚举所有子串代价高。右端扩张至覆盖，左端尽量收缩；用 missing 记录尚缺字符总数，避免每次扫描整张频率表。

**手推例子**

s="AAABBC"，t="AABC"：两个 A 都必须保留，最短为 AABBC。

**正确性关键与边界**

不是只判断字符种类；合法时先记录答案再移左端。空 t 返回空串。实现用 char 频率表，按 UTF-16 代码单元处理。


**need 的正负到底是什么意思？**

初始化 need 为目标频率；每加入一个字符就减 1。因此正数表示还缺，零表示刚好够，负数表示多余。missing 只在加入“原本还缺”的字符时减少，只在移出后“重新变缺”的字符时增加。

例子 `s=AAABBC, t=AABC`：右端到 C 时第一次覆盖，窗口 AAABBC。删除第一个 A 后仍够，可得到 AABBC；再删一个 A 就不足两个 A，于是停止缩小。这解释了为什么合法窗口要用 while 不断收缩，而不是只移动一次。

**追问：为什么每个右端只检查这条收缩路径就够？** 更长的合法窗口不会更优；一旦缩到不合法，继续缩只会丢更多字符，无法重新合法，因此应等待右端扩张。

**复杂度**

时间 O(n+m+U)，U=65536；辅助空间 O(U)，返回子串另计。

**Java 主实现**

```java
class Solution {
    public String minWindow(String s, String t) {
        if (t.isEmpty() || s.length() < t.length()) return "";
        int[] need = new int[65536];
        for (int i = 0; i < t.length(); i++) need[t.charAt(i)]++;
        int missing = t.length(), left = 0, bestStart = 0, bestLen = Integer.MAX_VALUE;
        for (int right = 0; right < s.length(); right++) {
            char in = s.charAt(right);
            if (need[in] > 0) missing--;
            need[in]--;
            while (missing == 0) {
                if (right - left + 1 < bestLen) {
                    bestLen = right - left + 1;
                    bestStart = left;
                }
                char out = s.charAt(left++);
                need[out]++;
                if (need[out] > 0) missing++;
            }
        }
        return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestStart, bestStart + bestLen);
    }
}
```


<a id="q-438"></a>

### [438. 找到字符串中所有字母异位词](https://leetcode.cn/problems/find-all-anagrams-in-a-string/)

**优先级 A · 题意**

找 s 中所有与 p 互为字母异位词的连续子串起点。

**从直接思路到主解法**

逐窗排序代价高；固定长度窗口更新移出、移入字符计数，比较 26 个小写字母频率即可。

**手推例子**

s=cbaebabacd，p=abc → 起点 0、6。

**正确性关键与边界**

窗口长度必须等于 p.length；同字符的出现次数也要相等。固定 26 比较已经是线性，无需先追求差分计数技巧。

**复杂度**

时间 O(26n+m)=O(n+m)；辅助空间 O(26)，输出另计。

**Java 主实现**

```java
class Solution {
    public List<Integer> findAnagrams(String s, String p) {
        List<Integer> ans = new ArrayList<>();
        if (s.length() < p.length() || p.isEmpty()) return ans;
        int[] need = new int[26], window = new int[26];
        for (char c : p.toCharArray()) need[c - 'a']++;
        for (int right = 0; right < s.length(); right++) {
            window[s.charAt(right) - 'a']++;
            if (right >= p.length()) window[s.charAt(right - p.length()) - 'a']--;
            if (right >= p.length() - 1 && Arrays.equals(need, window)) {
                ans.add(right - p.length() + 1);
            }
        }
        return ans;
    }
}
```


<a id="q-560"></a>

### [560. 和为 K 的子数组](https://leetcode.cn/problems/subarray-sum-equals-k/)

**优先级 A · 题意**

统计和恰为 k 的连续子数组个数，可含负数。

**从直接思路到主解法**

前缀和让区间和变成 pre[r]-pre[l]；扫描当前 pre 时只需数此前出现过多少 pre-k。

**手推例子**

[1,-1,0]、k=0：前缀 0、1、0、0，共有 3 个符合区间。

**正确性关键与边界**

Map 存频数而非布尔值；初始 (0,1) 代表空前缀；先查再插，避免把空区间算入。


**从区间枚举推到哈希表**

定义 `prefix[0]=0`，`prefix[r+1]` 为前 r+1 个数的和。区间 `[l,r]` 和为 k，等价于 `prefix[l]=prefix[r+1]-k`。扫描右端时，把所有合法左边界的前缀频数收集起来，就不用再枚举它们。

对 `[1,-1,0]`、k=0：

| 当前元素 | 当前 prefix | 查询已有 prefix-0 的次数 | 累计答案 | 再登记当前 prefix |
| --- | --- | --- | --- | --- |
| 1 | 1 | 0 | 0 | 1 出现 1 次 |
| -1 | 0 | 1（空前缀） | 1 | 0 出现 2 次 |
| 0 | 0 | 2 | 3 | 0 出现 3 次 |

**追问：为什么先查再插？** 若 k=0 先插入当前前缀，会把当前前缀减自身形成的空区间计入，而题目要求非空区间。

**复杂度**

时间 O(n)（哈希平均）；辅助空间 O(n)。

**Java 主实现**

```java
class Solution {
    public int subarraySum(int[] nums, int k) {
        Map<Long, Integer> freq = new HashMap<>();
        freq.put(0L, 1);
        long prefix = 0;
        int ans = 0;
        for (int x : nums) {
            prefix += x;
            ans += freq.getOrDefault(prefix - k, 0);
            freq.put(prefix, freq.getOrDefault(prefix, 0) + 1);
        }
        return ans;
    }
}
```


<a id="q-238"></a>

### [238. 除自身以外数组的乘积](https://leetcode.cn/problems/product-of-array-except-self/)

**优先级 A · 题意**

对每个位置返回其他全部元素的乘积，不能用除法。

**从直接思路到主解法**

每个位置重复相乘 O(n²)。答案等于左侧乘积×右侧乘积；答案数组先存左积，再反向用一个变量乘右积。

**手推例子**

[1,2,3,4] → [24,12,8,6]；[0,2,3] → [6,0,0]。

**正确性关键与边界**

左右乘积都不含当前位置；先写答案再把当前值纳入累计。零无需特殊分支。

**复杂度**

时间 O(n)；辅助空间 O(1)，输出 O(n)。

**Java 主实现**

```java
class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] ans = new int[n];
        // 因为0索引位置左边没有值了，所以为1
        ans[0] = 1;
        // nums[i] 乘以 他左边的数字相乘的积
        for(int i = 1; i < n ;i++){
            ans[i] = ans[i - 1] * nums[i -1];
        }
        // 因为 n-1索引右边没有值了， 所以为1
        int right = 1;
        // nums[i] 乘以 他右边的数字相乘的积
        for(int i = n - 1; i >= 0; i--){
            ans[i] = ans[i] * right;
            // nums[i -1]右边的数的乘积
            right *= nums[i];
        }
        return ans;
    }
}
```


<a id="q-437"></a>

### [437. 路径总和 III](https://leetcode.cn/problems/path-sum-iii/)

**优先级 B · 题意**

统计树中向下的任意起点路径，路径和等于目标。

**从直接思路到主解法**

每个节点作起点 DFS 最坏 O(n²)。把 560 的前缀和频数放到根到当前节点的路径上，用 DFS 进入时增加、退出时减少。

**手推例子**

根 1、左右孩子都为 1，target=2，答案 2，不能拼出左孩子→右孩子的向下路径。

**正确性关键与边界**

Map 只代表当前祖先链，回溯时必须撤销，且计数归零删除键，才能维持 O(h) 活跃映射；前缀和用 long。

**复杂度**

平均时间 O(n)；辅助空间 O(h)。

**Java 主实现**

```java
class Solution {
    public int pathSum(TreeNode root, int targetSum) {
        Map<Long,Integer> prefix = new HashMap<>();
        // 前缀和为0
        prefix.put(0L,1);
        return dfs(root,targetSum,prefix,0);
    }
    private int dfs(TreeNode root, int targetSum,Map<Long,Integer> prefix,long curr){
        if(root == null){
            return 0;
        }
        int ret = 0;
        // 前缀和
        curr+=root.val;
        // 前缀和 = root到当前节点的前缀和 - targetSum,即存在targetSum
        ret = prefix.getOrDefault(curr - targetSum,0);
        // 更新前缀和curr对应的路径
        prefix.put(curr,prefix.getOrDefault(curr,0) + 1);
        // 更新左右子树上的 存在路径和为targetSum的个数
        ret+=dfs(root.left,targetSum,prefix,curr);
        ret+=dfs(root.right,targetSum,prefix,curr);
        // 回溯curr的路径
        int remaining = prefix.get(curr) - 1;
        if (remaining == 0) prefix.remove(curr);
        else prefix.put(curr, remaining);
        return ret;
    }
}
```



> [目录](../README.md)
