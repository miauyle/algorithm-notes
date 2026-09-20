<a id="chapter-11"></a>

## 11 动态规划

> [← 上一章](10-greedy-interval.md) · [目录](../README.md) · [下一章 →](12-string-simulation.md)

写代码前，依次回答：状态是什么、最后一步有哪些可能、初始状态是什么、按什么顺序算、答案在哪。先讲二维/完整状态，再压缩空间。

| 状态含义 | 代表题 | 答案位置 |
| --- | --- | --- |
| 必须以 i 结尾 | 53、152、LIS 的基础 DP | 对所有结尾取 max |
| 前 i 项的整体最优 | 198、139 | 最后一个前缀 |
| 两个前缀的关系 | 1143、72、10 | dp[m][n] |
| 两个位置结尾的连续匹配 | 718 | 整张表的最大值 |
| 用已处理元素凑金额 | 416、518、494 | 目标金额状态 |
| 子树根的选择状态 | 337 | 根的两个状态取 max |
| 固定边界的区间答案 | 312 | 整个区间 |

“背包循环方向”来自依赖，不来自口诀：0/1 背包本轮只能读上一轮状态，所以一维金额倒序；完全背包允许继续使用当前物品，所以金额正序。518 的“组合数”还要求币种放外层，防止同一组合不同顺序重复计数。

**本章题目**

[70](#q-70) · [118](#q-118) · [62](#q-62) · [64](#q-64) · [53](#q-53) · [152](#q-152) · [198](#q-198) · [337](#q-337) · [309](#q-309) · [300](#q-300) · [1143](#q-1143) · [718](#q-718) · [72](#q-72) · [5](#q-5) · [647](#q-647) · [221](#q-221) · [322](#q-322) · [279](#q-279) · [416](#q-416) · [494](#q-494) · [518](#q-518) · [139](#q-139) · [96](#q-96) · [312](#q-312) · [10](#q-10)


<a id="q-70"></a>

### [70. 爬楼梯](https://leetcode.cn/problems/climbing-stairs/)

**优先级 A · 题意**

每次爬 1 或 2 阶，求到达 n 阶的方法数。

**从直接思路到主解法**

递归枚举重复求同一台阶。最后一步来自 n-1 或 n-2，两组不重叠，故 ways[n]=ways[n-1]+ways[n-2]。

**手推例子**

n=3：111、12、21，共 3 种。

**正确性关键与边界**

ways[0]=1 表示一种空走法，便于递推；只依赖前两项可以滚动。不把“路径不同”误算成“步数组合”。

**复杂度**

时间 O(n)；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    public int climbStairs(int n) {
        int a = 1, b = 1;
        for (int i = 2; i <= n; i++) {
            int next = a + b;
            a = b;
            b = next;
        }
        return b;
    }
}
```


<a id="q-118"></a>

### [118. 杨辉三角](https://leetcode.cn/problems/pascals-triangle/) · 新增

**优先级 A · 题意**

生成杨辉三角前 numRows 行。

**从直接思路到主解法**

按行构造，首尾为 1，内部来自上一行左上与正上之和；不需组合数公式。

**手推例子**

前 4 行为 [1]、[1,1]、[1,2,1]、[1,3,3,1]。

**正确性关键与边界**

本题返回所有行，不能把整体空间写成 O(n)；若只求第 n 行，才可一维数组从右向左滚动。

**复杂度**

时间 O(n²)；辅助空间 O(1)（不计返回结果），输出 O(n²)。

**Java 主实现**

```java
class Solution {
    public List<List<Integer>> generate(int numRows) {
        List<List<Integer>> ans = new ArrayList<>();
        for (int r = 0; r < numRows; r++) {
            List<Integer> row = new ArrayList<>();
            for (int c = 0; c <= r; c++) {
                if (c == 0 || c == r) row.add(1);
                else row.add(ans.get(r - 1).get(c - 1) + ans.get(r - 1).get(c));
            }
            ans.add(row);
        }
        return ans;
    }
}
```


<a id="q-62"></a>

### [62. 不同路径](https://leetcode.cn/problems/unique-paths/)

**优先级 A · 题意**

m×n 网格仅向右或向下，求不同走法数。

**从直接思路到主解法**

每格走法等于上方与左方走法之和；第一行、第一列均只有一种。先写 DP，再考虑组合数。

**手推例子**

2×3 网格需要一次向下、两次向右，共 3 种排列。

**正确性关键与边界**

这里求数量，用加法；64 求最低代价，用 min 加当前权重。组合数实现还要考虑中间乘法溢出。

**复杂度**

本实现时间 O(mn)；辅助空间 O(n)。

**Java 主实现**

```java
class Solution {
    public int uniquePaths(int m, int n) {
        int[] dp = new int[n];
        Arrays.fill(dp, 1);
        for (int r = 1; r < m; r++) {
            for (int c = 1; c < n; c++) dp[c] += dp[c - 1];
        }
        return dp[n - 1];
    }
}
```


<a id="q-64"></a>

### [64. 最小路径和](https://leetcode.cn/problems/minimum-path-sum/)

**优先级 A · 题意**

网格中仅向右或向下走，求左上到右下的最小路径和。

**从直接思路到主解法**

每条路径都枚举会重复到达相同格子。dp[i][j] 表示到这里的最低代价，来自上方或左方的较小者再加当前值。

**手推例子**

[[1,3,1],[1,5,1],[4,2,1]] 的最小路径和为 7。

**正确性关键与边界**

起点包含自己的值；第一行、第一列只有一个来源。若直接复用 grid，会修改输入，本实现另开 dp。

**复杂度**

时间 O(mn)；本实现辅助空间 O(mn)。

**Java 主实现**

```java
class Solution {
    public int minPathSum(int[][] grid) {
        if(grid == null || grid.length == 0 || grid[0].length ==0){
            return 0;
        }
        int rows = grid.length,columns = grid[0].length;
        int[][] dp = new int[rows][columns];
        dp[0][0] = grid[0][0];
        // 从第二行开始的第一列
        for(int i = 1; i < rows;i++){
            dp[i][0] = dp[i -1][0] + grid[i][0];
        }
        // 从第二列开始的第一行
        for(int j = 1; j < columns ;j++){
            dp[0][j] = dp[0][j -1] + grid[0][j];
        }
        // 第二行、第二列开始往后
        for(int i = 1; i < rows;i++){
            for(int j = 1; j < columns ;j++){
                dp[i][j] = Math.min(dp[i -1][j],dp[i][j -1]) + grid[i][j];
            }
        }
        return dp[rows -1][columns -1];
    }
}
```


<a id="q-53"></a>

### [53. 最大子数组和](https://leetcode.cn/problems/maximum-subarray/)

**优先级 A · 题意**

求非空连续子数组的最大和。

**从直接思路到主解法**

枚举区间 O(n²)。以 i 结尾的最佳区间只有两种：从 i 重新开始，或接在以 i-1 结尾的最佳区间后。

**手推例子**

[-2,1,-3,4,-1,2,1]：以 4 开始的一段达到 6。

**正确性关键与边界**

end=max(x,end+x)，全局答案再对 end 取最大。end 和 ans 不是同一状态；全负数组不能默认答案 0。

**复杂度**

时间 O(n)；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    public int maxSubArray(int[] nums) {
        int pre =0,sum = nums[0];
        for(int num : nums){
            // pre其实就是num前面的子数组的累加和
            pre = Math.max(pre + num,num);
            sum = Math.max(pre,sum);
        }
        return sum;
    }
}
```


<a id="q-152"></a>

### [152. 乘积最大子数组](https://leetcode.cn/problems/maximum-product-subarray/)

**优先级 B · 题意**

求连续非空子数组的最大乘积。

**从直接思路到主解法**

只保存最大值不够，负数乘最小负值可能成为最大正值；同时维护以当前位置结尾的最大、最小乘积。

**手推例子**

[-2,3,-4]：-6 乘 -4 变 24，所以不能丢掉负的最小状态。

**正确性关键与边界**

更新两状态都要使用旧 max/min；零会自然重启区间。代码依赖题目乘积范围约束。

**复杂度**

时间 O(n)；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    public int maxProduct(int[] nums) {
        int fMax = nums[0],fMin = nums[0],ans = nums[0];
        for(int i = 1;i < nums.length ;i++){
            int mx = fMax,mn = fMin;
            fMax = Math.max(nums[i] * mx, Math.max(nums[i] * mn, nums[i]));
            fMin = Math.min(nums[i] * mx, Math.min(nums[i] * mn, nums[i]));
            ans = Math.max(ans, fMax);
        }
        return ans;
    }
}
```


<a id="q-198"></a>

### [198. 打家劫舍](https://leetcode.cn/problems/house-robber/)

**优先级 A · 题意**

相邻房屋不能同时选，求最大金额。

**从直接思路到主解法**

枚举选不选会重复子问题。对当前房屋，选则接 i-2 的最优值，不选则接 i-1，取更大者。

**手推例子**

[2,7,9,3,1]：选 2、9、1，总额 12。

**正确性关键与边界**

dp[i] 是前缀最佳，不是必须选择 i。滚动时先保存旧状态，避免覆盖依赖。

**复杂度**

时间 O(n)；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    public int rob(int[] nums) {
        if(nums == null || nums.length == 0){
            return 0;
        }
        int n = nums.length;
        if(n == 1){
            return nums[0];
        }
        // 用first、second代替数组
        int first = nums[0],second = Math.max(nums[0],nums[1]);
        for(int i = 2;i < n;i++){
            // 把当前的i-1保存下来，后面传给first,在下一次循环中就是i-2了
            int temp = second;
            second =  Math.max(first+ nums[i],second);
            // i-2 是first, second是i -1
            first = temp;
        }
        return second;
    }
}
```


<a id="q-337"></a>

### [337. 打家劫舍 III](https://leetcode.cn/problems/house-robber-iii/)

**优先级 B · 题意**

树上的房屋不能同时选择父子，求最大收益。

**从直接思路到主解法**

对子树反复重算孙子会重复。每个节点返回两个状态：选它的最佳收益、不选它的最佳收益。

**手推例子**

根值 3，左右各值 2、3：选根时只能取孩子“不选”状态，不选根时孩子自由选优。

**正确性关键与边界**

选中状态必须包含 root.val，原笔记文字公式漏了这一项；不选时左右各自取 max，不能统一都不选。

**复杂度**

时间 O(n)；辅助空间 O(h)。

**Java 主实现**

```java
class Solution {
    public int rob(TreeNode root) {
        if(root == null){
            return 0;
        }
        int[] countRoot = dfs(root);
        return Math.max(countRoot[0],countRoot[1]);
    }
    private int[] dfs(TreeNode root){
        if(root == null){
            return new int[]{0,0};
        }
        int[] l = dfs(root.left);
        int[] r = dfs(root.right);
        int selected = root.val + l[1] + r[1];
        int notSelected = Math.max(l[0],l[1]) + Math.max(r[0],r[1]);
        return new int[]{selected,notSelected};
    }
}
```


<a id="q-309"></a>

### [309. 最佳买卖股票时机含冷冻期](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-with-cooldown/)

**优先级 B · 题意**

多次买卖，卖出后隔一天才能再买。

**从直接思路到主解法**

普通正差贪心失效。记录持股 hold、刚卖 sold、可买 rest 三个状态；买入只能来自前一天 rest。

**手推例子**

[1,2,3,0,2]：第 2 天卖出后冷冻一天，再买 0 卖 2，总收益 3。

**正确性关键与边界**

今日 hold=max(旧 hold,旧 rest-price)，sold=旧 hold+price，rest=max(旧 rest,旧 sold)。同一天新状态不能相互污染。

**复杂度**

时间 O(n)；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    public int maxProfit(int[] prices) {
        if(prices.length == 0){
            return 0;
        }
        int n = prices.length;
        int dp0 = -prices[0];
        int dp1 = 0;
        int dp2 = 0;
        for(int i = 1;i < n;i++){
            int temp0 = dp0,temp1 = dp1,temp2 = dp2;
            // 当天持股(今天买入/今天没操作(昨天持股)) 累计最大收益
            dp0 = Math.max(temp1 - prices[i],temp0);
            // 当天不持股且且非冻结期(昨天是冻结期/或者昨天不持股非冻结期) 累计最大收益
            dp1 = Math.max(temp2,temp1);
            // 当天不持股且冻结期(当天卖出的) 累计最大收益
            dp2 = temp0 + prices[i];
        }
        return Math.max(dp1,dp2);
    }
}
```


<a id="q-300"></a>

### [300. 最长递增子序列](https://leetcode.cn/problems/longest-increasing-subsequence/)

**优先级 A · 题意**

求严格递增子序列的最大长度，可跳过元素。

**从直接思路到主解法**

先定义 dp[i]=以 i 结尾的最长长度，枚举更小前驱得到 O(n²)。再维护 tails[len]=该长度的最小尾值，用二分更新到 O(n log n)。

**手推例子**

[2,5,3,4]：tails 为 [2]、[2,5]、[2,3]、[2,3,4]，答案 3。

**正确性关键与边界**

替换第一个 ≥x 的位置；严格递增不能让相等元素延长。tails 保证长度正确，但不保证本身是原数组的合法子序列。


**先能写 O(n²)，再讲二分版**

基础状态：`dp[i]` 是以 `nums[i]` 结尾的最长严格递增子序列长度，初始 1。对所有 `j<i` 且 `nums[j]<nums[i]`，尝试 `dp[j]+1`。这一步很重要：它先确定“我需要什么前驱”。

优化观察：同样长度的序列，末尾越小，未来越容易接上一个更大的数。所以每个长度只保留最小可能尾值。这个尾值表有序，能二分找到 x 应替换的位置。

**为什么替换不会抹掉真实答案？** 被替换的较大尾值不会比更小尾值更利于未来延长；长度仍可达到，并没有删去一个长度。

**追问：要输出序列怎么办？** 只存尾值不够，需要尾值对应原下标和每个元素的前驱下标，最后逆向恢复。比如 `[3,5,6,2]` 的 tails 可能为 `[2,5,6]`，它不是原数组按下标顺序的子序列。

**复杂度**

主实现时间 O(n log n)；辅助空间 O(n)。

**Java 主实现**

```java
class Solution {
    public int lengthOfLIS(int[] nums) {
        int[] tails = new int[nums.length];
        int size = 0;
        for (int x : nums) {
            int left = 0, right = size;
            while (left < right) {
                int mid = left + (right - left) / 2;
                if (tails[mid] < x) left = mid + 1;
                else right = mid;
            }
            tails[left] = x;
            if (left == size) size++;
        }
        return size;
    }
}
```


<a id="q-1143"></a>

### [1143. 最长公共子序列](https://leetcode.cn/problems/longest-common-subsequence/)

**优先级 A · 题意**

求两个字符串的最长公共子序列长度，字符可不连续。

**从直接思路到主解法**

暴力枚举子序列是指数级。dp[i][j] 表示两个前缀的 LCS；末字符相等可同时选，否则至少放弃其中一个末字符。

**手推例子**

abcde 与 ace：a、c、e 可跳过 b、d，长度 3。

**正确性关键与边界**

相等取 dp[i-1][j-1]+1，否则取 max(dp[i-1][j],dp[i][j-1])；不是 718 的连续公共子数组，不相等时不能清零。


**为什么末字符不同，可以丢掉一个？**

两个末字符不同，不可能同时作为公共子序列的最后一个字符。最优答案要么不使用 text1 的末字符，要么不使用 text2 的末字符；取这两种前缀问题的最大值即可。

| s 的前缀 / t 的前缀 | 空 | a | ac |
| --- | --- | --- | --- |
| 空 | 0 | 0 | 0 |
| a | 0 | 1 | 1 |
| ab | 0 | 1 | 1 |
| abc | 0 | 1 | 2 |

这里 `dp[3][2]=2`，对应 ac。对比最长公共**连续**片段：字符不同时必须断开，所以 718 归零，且状态必须定义成“以当前两位置结尾”。

**追问：只求长度怎么省空间？** 滚动一行，但更新 `dp[j]` 前要保存旧值；左上角旧状态用单独变量保存。需要恢复具体序列时，保留二维表更容易回溯。

**复杂度**

时间 O(mn)；本实现辅助空间 O(mn)。

**Java 主实现**

```java
class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        int m = text1.length(),n = text2.length();
        int[][] dp = new int[m+1][n+1];
        for(int i = 1;i <= m;i++){
            char c1 = text1.charAt(i - 1);
            for(int j = 1;j <= n;j++){
                char c2 = text2.charAt(j - 1);
                if(c1 == c2){
                    dp[i][j] = dp[i -1][j -1] + 1;
                } else{
                    dp[i][j] = Math.max(dp[i][j -1],dp[i -1][j]);
                }
            }
        }
        return dp[m][n];
    }
}
```


<a id="q-718"></a>

### [718. 最长重复子数组](https://leetcode.cn/problems/maximum-length-of-repeated-subarray/)

**优先级 B · 题意**

求两个数组中最长的连续公共片段。

**从直接思路到主解法**

枚举起点逐段比较；DP 保存“恰在 i-1、j-1 结尾”的最长公共后缀，相等延长，不同归零。

**手推例子**

[1,2,3,2,1] 与 [3,2,1,4,7] 的公共连续段 [3,2,1] 长度 3。

**正确性关键与边界**

dp 的定义必须带“以这两个位置结尾”；答案是整张表的最大值，不一定是 dp[m][n]。

**复杂度**

时间 O(mn)；本实现辅助空间 O(mn)。

**Java 主实现**

```java
class Solution {
    public int findLength(int[] nums1, int[] nums2) {
        int m = nums1.length, n = nums2.length;
        int[][] dp = new int[m + 1][n + 1];
        int ans = 0;
        for(int i = 1;i <= m ;i++){
            for(int j = 1; j <= n ;j++){
                if(nums1[i -1] == nums2[j -1]){
                    dp[i][j] = dp[i -1][j -1] + 1;
                }
                ans = Math.max(ans,dp[i][j]);
            }
        }
        return ans;
    }
}
```


<a id="q-72"></a>

### [72. 编辑距离](https://leetcode.cn/problems/edit-distance/)

**优先级 B · 题意**

允许插入、删除、替换，求两个字符串的最小编辑距离。

**从直接思路到主解法**

指数递归反复处理相同前缀。dp[i][j] 表示前 i、j 个字符的距离；末字符相同继承对角，否则对插入、删除、替换取最小加 1。

**手推例子**

ab → ac：最后一个字符替换，距离 1；空串 → abc：距离 3。

**正确性关键与边界**

dp[i][0]=i，dp[0][j]=j；字符下标是 i-1、j-1，不是 i、j。

**复杂度**

时间 O(mn)；本实现辅助空间 O(mn)，可滚动至 O(min(m,n))。

**Java 主实现**

```java
class Solution {
    public int minDistance(String word1, String word2) {
        int n1 = word1.length() + 1,n2 = word2.length() + 1;
        int[][] dp = new int[n1][n2];
        //1. 需要考虑 word1 或 word2 一个字母都没有，即全增加/删除的情况，所以预留 dp[0][j] 和 dp[i][0]
        for(int i = 0;i < n1;i++){
            dp[i][0] = i;
        }
        for(int j = 0;j < n2;j++){
            dp[0][j] = j;
        }
        //2.dp[i][j] = Math.min(dp[i - 1][j] ,dp[i][j - 1] , dp[i - 1][j - 1]) + 1
        for(int i = 1;i < n1;i++){
            for(int j = 1;j < n2;j++){
                int minDp = Math.min(dp[i - 1][j],dp[i][j - 1]);
                dp[i][j] = Math.min(minDp, dp[i - 1][j - 1]) + 1;
                if(word1.charAt(i - 1) == word2.charAt(j - 1)){
                    //3 这两个字母相同 word1[i - 1] = word2[j - 1] ，那么可以直接参考 dp[i - 1][j - 1]
                    dp[i][j] = Math.min(dp[i][j], dp[i - 1][j - 1]);
                }
            }
        }
        return dp[n1 - 1][n2 -1];
    }
}
```


<a id="q-5"></a>

### [5. 最长回文子串](https://leetcode.cn/problems/longest-palindromic-substring/)

**优先级 A · 题意**

找最长连续回文子串。

**从直接思路到主解法**

逐个区间检查是 O(n³)。回文由中心对称扩展，枚举单字符中心和双字符中心，可到 O(n²)、O(1) 辅助空间；DP 是另一条路线。

**手推例子**

cbbd：以两个 b 之间为中心扩展，得到 bb。

**正确性关键与边界**

DP 正确方向为 pal[l][r] = 两端相等且（长度≤2 或 pal[l+1][r-1]）；不能反过来由外层推内层。先掌握中心扩展，无需先背 Manacher。

**复杂度**

时间 O(n²)；辅助空间 O(1)，返回字符串 O(n)。

**Java 主实现**

```java
class Solution {
    public String longestPalindrome(String s) {
        int start = 0, best = 0;
        for (int center = 0; center < s.length(); center++) {
            int len = Math.max(expand(s, center, center), expand(s, center, center + 1));
            if (len > best) {
                best = len;
                start = center - (len - 1) / 2;
            }
        }
        return s.substring(start, start + best);
    }
    private int expand(String s, int left, int right) {
        while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
            left--;
            right++;
        }
        return right - left - 1;
    }
}
```


<a id="q-647"></a>

### [647. 回文子串](https://leetcode.cn/problems/palindromic-substrings/)

**优先级 B · 题意**

统计所有按位置区分的回文子串。

**从直接思路到主解法**

逐区间检查 O(n³)；枚举奇偶中心，每次扩展成功就得到一个新的回文区间。

**手推例子**

aaa：3 个单字符、2 个 aa、1 个 aaa，共 6。

**正确性关键与边界**

不是对内容去重。原笔记 Manacher 实现把边界判断写成 i≤center，无法获得所称线性保证；主线改用可靠的中心扩展。

**复杂度**

时间 O(n²)；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    public int countSubstrings(String s) {
        int ans = 0;
        for (int c = 0; c < s.length(); c++) {
            ans += expand(s, c, c);
            ans += expand(s, c, c + 1);
        }
        return ans;
    }
    private int expand(String s, int left, int right) {
        int count = 0;
        while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
            count++;
            left--;
            right++;
        }
        return count;
    }
}
```


<a id="q-221"></a>

### [221. 最大正方形](https://leetcode.cn/problems/maximal-square/)

**优先级 B · 题意**

在 0/1 矩阵里找全 1 的最大正方形面积。

**从直接思路到主解法**

逐个矩形检查很慢。dp[i][j] 表示以当前格为右下角的最大边长，受上、左、左上三者最短边限制。

**手推例子**

[[1,1],[1,1]] 最右下 dp=2，返回面积 4；若左上变 0，则边长最多 1。

**正确性关键与边界**

转移 min(上,左,左上)+1，仅在当前为 1 时；返回边长平方，不是边长。

**复杂度**

时间 O(mn)；本实现辅助空间 O(mn)。

**Java 主实现**

```java
class Solution {
    public int maximalSquare(char[][] matrix) {
        if (matrix.length == 0 || matrix[0].length == 0) return 0;
        int rows = matrix.length, columns = matrix[0].length;
        int maxWidth = 0;
        int[][] dp = new int[rows][columns];
        for(int i = 0;i < rows;i++){
            for(int j = 0 ;j < columns;j++){
                if(matrix[i][j] == '1'){
                    if(i == 0 || j == 0){
                        dp[i][j] = 1;
                    } else {
                        dp[i][j] = Math.min(Math.min(dp[i-1][j],dp[i][j-1]),dp[i-1][j-1]) + 1;
                    }
                }
                maxWidth = Math.max(maxWidth,dp[i][j]);
            }
        }
        return maxWidth * maxWidth;
    }
}
```


<a id="q-322"></a>

### [322. 零钱兑换](https://leetcode.cn/problems/coin-change/)

**优先级 A · 题意**

无限使用给定正面额硬币，求凑目标金额的最少枚数。

**从直接思路到主解法**

按面额从大到小贪心不总成立。dp[x] 表示金额 x 最少枚数，枚举最后一枚 c，从 dp[x-c]+1 转移。

**手推例子**

coins=[1,3,4]，amount=6：贪心 4+1+1 为 3 枚，最优 3+3 为 2 枚。

**正确性关键与边界**

dp[0]=0，其余初始化不可达；不要用 MAX_VALUE 再直接加 1。无法组成返回 -1。

**复杂度**

时间 O(Ak)；辅助空间 O(A)，A 为金额、k 为面额数。

**Java 主实现**

```java
class Solution {
    public int coinChange(int[] coins, int amount) {
        int max = amount + 1;
        int[] dp = new int[amount + 1];
        Arrays.fill(dp,max);
        dp[0] = 0;
        for(int i = 1; i <= amount; i++){
            for(int j = 0;j < coins.length;j ++){
                if(coins[j] <= i){
                    dp[i] = Math.min(dp[i],dp[i -coins[j]] + 1);
                }
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
}
```


<a id="q-279"></a>

### [279. 完全平方数](https://leetcode.cn/problems/perfect-squares/)

**优先级 B · 题意**

把 n 表示成若干完全平方数之和，求最少个数。

**从直接思路到主解法**

可视为面额 1、4、9… 的无限硬币问题；dp[x] 枚举最后使用的平方数 j²，取 dp[x-j²]+1 的最小值。

**手推例子**

12=4+4+4，答案 3；13=9+4，答案 2。

**正确性关键与边界**

dp[0]=0；平方数从 1 开始枚举，避免把 0 当作可用面额导致自依赖。

**复杂度**

时间 O(n√n)；辅助空间 O(n)。

**Java 主实现**

```java
class Solution {
    public int numSquares(int n) {
        int[] dp = new int[n + 1];
        for(int i = 1; i <= n;i++){
            int minn = Integer.MAX_VALUE;
            for(int j = 1; j * j <= i;j++){
                minn = Math.min(minn,dp[i - j * j]);
            }
            // dp[i - j * j]最小组合数 + j * j，这一个完全平方数的组合
            dp[i] = minn + 1;
        }
        return dp[n];
    }
}
```


<a id="q-416"></a>

### [416. 分割等和子集](https://leetcode.cn/problems/partition-equal-subset-sum/)

**优先级 A · 题意**

正整数数组能否划分成总和相等的两组。

**从直接思路到主解法**

总和为偶数才可能；转化为每个数最多选一次，能否凑 sum/2。dp[j] 表示用已处理元素能否凑 j。

**手推例子**

[1,5,11,5] 可选 11；[1,2,5] 总和 8，但无法选到 4。

**正确性关键与边界**

一维 dp 金额必须倒序，否则同个数会复用。完整遍历所有数，使状态定义清晰；不能把一般 0/1 背包写成跳过首项。


**倒序不是口诀，是为了不复用当前数**

想象 dp 原本有“处理了几个数”这一维。处理 x 时需要读取上一行的 `dp[j-x]`。压成一行后，如果 j 从小到大，`dp[j-x]` 可能已在本轮用过 x，再用一次就把 0/1 背包改成无限背包。

例如 `[1,2,5]` 的目标是 4。处理第一个 1 时若正序，dp[1] 会把 dp[2] 点亮，继而点亮 dp[3]、dp[4]，等于把一个 1 用了四次，得到错误答案。倒序时读到的仍是“处理这个 1 之前”的状态。

**追问：518 为什么反而正序？** 因为一枚面额可以使用无限次，当前轮的新状态正是合法依赖；同时币种外层确保统计组合而非排列。

**复杂度**

时间 O(nT)；辅助空间 O(T)，T=sum/2，为伪多项式算法。

**Java 主实现**

```java
class Solution {
    public boolean canPartition(int[] nums) {
        int sum = 0;
        for (int x : nums) sum += x;
        if (sum % 2 != 0) return false;
        int target = sum / 2;
        boolean[] dp = new boolean[target + 1];
        dp[0] = true;
        for (int x : nums) {
            for (int j = target; j >= x; j--) dp[j] = dp[j] || dp[j - x];
        }
        return dp[target];
    }
}
```


<a id="q-494"></a>

### [494. 目标和](https://leetcode.cn/problems/target-sum/)

**优先级 B · 题意**

每个非负整数前加 + 或 -，求结果为 target 的方案数。

**从直接思路到主解法**

令负号组总和 neg，则 sum-2neg=target，转成 0/1 背包计数。不可行的奇偶性、范围先排除。

**手推例子**

[1,1,1,1,1]、target=3：选一个 1 取负，共 5 种。

**正确性关键与边界**

dp[0]=1，金额倒序；值为 0 时 +0 与 -0 是不同方案，会让计数翻倍，不能跳过。

**复杂度**

时间 O(nT)；辅助空间 O(T)，T=(sum-target)/2。

**Java 主实现**

```java
class Solution {
    public int findTargetSumWays(int[] nums, int target) {
        int sum = 0;
        for(int num : nums){
            sum+=num;
        }
        if (Math.abs((long) target) > sum) return 0;
        int diff = sum -target;
        if(diff < 0 || diff % 2 != 0){
            return 0;
        }
        int n = nums.length,neg = diff / 2;
        int[] dp = new int[neg +1];
        dp[0]= 1;
        for(int i = 1;i <= n;i++){
            int num = nums[i -1];
            for(int j = neg;j >= num;j--){
                dp[j] += dp[j -num];
            }
        }
        return dp[neg];
    }
}
```


<a id="q-518"></a>

### [518. 零钱兑换 II](https://leetcode.cn/problems/coin-change-2/)

**优先级 B · 题意**

无限硬币凑金额，统计不区分顺序的组合数。

**从直接思路到主解法**

dp[x] 保存组合数；外层逐种硬币，内层金额正向，使每个组合只按一种币种顺序被统计。

**手推例子**

coins=[1,2]、amount=3：1+1+1、1+2，共 2，不再另算 2+1。

**正确性关键与边界**

dp[0]=1；币种外层与金额外层含义不同。金额正向允许当前币重复使用。

**复杂度**

时间 O(Ak)；辅助空间 O(A)。

**Java 主实现**

```java
class Solution {
    public int change(int amount, int[] coins) {
        int[] dp = new int[amount + 1];
        dp[0] = 1;
        for(int coin : coins){
            for(int i = coin; i <= amount; i++){
                dp[i] += dp[i - coin];
            }
        }
        return dp[amount];
    }
}
```


<a id="q-139"></a>

### [139. 单词拆分](https://leetcode.cn/problems/word-break/)

**优先级 B · 题意**

判断字符串能否被字典中的词完整切分，词可复用。

**从直接思路到主解法**

按所有切点递归会重复后缀；dp[i] 表示前 i 个字符可切分，枚举最后一段的起点 j。

**手推例子**

leetcode，字典 [leet,code] → true；前缀 leet 合法后最后一段 code 也在字典。

**正确性关键与边界**

转移是对所有 j 做逻辑或，找到 true 可 break。Java substring 复制与哈希也耗时，不能把它当 O(1)。

**复杂度**

本实现最坏 O(n³+D) 时间；常驻辅助 O(n+D)，D 为字典总字符量，临时切片另计。

**Java 主实现**

```java
class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        HashSet<String> wordDictSet = new HashSet<>(wordDict);
        int n = s.length();
        boolean[] dp = new boolean[n + 1];
        dp[0] = true;
        for(int i = 1; i <= n; i++){
            for(int j = 0 ; j < i ; j++){
                if(dp[j] && wordDictSet.contains(s.substring(j,i))){
                    dp[i] = true;
                    break;
                }
            }
        }
        return dp[n];
    }
}
```


<a id="q-96"></a>

### [96. 不同的二叉搜索树](https://leetcode.cn/problems/unique-binary-search-trees/)

**优先级 B · 题意**

用 1..n 构造不同 BST，求结构数量。

**从直接思路到主解法**

枚举根 i，左右分别有 i-1 和 n-i 个节点；左右方案自由组合用乘法，不同根之间相加。

**手推例子**

n=3：根为 1、2、3 时分别 2、1、2 种，共 5。

**正确性关键与边界**

dp[0]=1 表示空树是一种选择；不是 0。先理解乘法原理，再考虑卡塔兰数公式。

**复杂度**

本实现时间 O(n²)；辅助空间 O(n)。

**Java 主实现**

```java
class Solution {
    public int numTrees(int n) {
        int[] dp = new int[n + 1];
        dp[0] = 1;
        for (int size = 1; size <= n; size++) {
            for (int root = 1; root <= size; root++) {
                dp[size] += dp[root - 1] * dp[size - root];
            }
        }
        return dp[n];
    }
}
```


<a id="q-312"></a>

### [312. 戳气球](https://leetcode.cn/problems/burst-balloons/)

**优先级 C · 题意**

选择戳气球顺序，使每次相邻三值乘积的累计最大。

**从直接思路到主解法**

选“第一个戳谁”会改变边界；改选开区间内“最后戳谁”，它两侧最后仍是固定边界，于是左右独立。

**手推例子**

[3,1,5,8] 的最优收益为 167；补边界是值 1，而不是索引 -1 与 n。

**正确性关键与边界**

dp[l][r]=max(dp[l][k]+a[l]*a[k]*a[r]+dp[k][r])；按区间长度递增，空开区间为 0。

**复杂度**

时间 O(n³)；辅助空间 O(n²)。

**Java 主实现**

```java
class Solution {
    public int maxCoins(int[] nums) {
        int n = nums.length;
        int[][] dp = new int[n+2][n+2];
        int[] val = new int[n+2];
        // 给原数组两端加 -1 和 n 防止越界
        val[0] = val[n+1] = 1;
        for(int i = 1; i<= n;i++){
            val[i] = nums[i-1];
        }
        for(int i = n -1;i >= 0;i--){
            for(int j = i + 2;j <= n + 1;j++){
                for(int mid = i + 1; mid < j;mid++){
                    int sum = val[i] * val[mid] * val[j];
                    sum += dp[i][mid] + dp[mid][j];
                    dp[i][j] = Math.max(dp[i][j],sum);
                }
            }
        }
        return dp[0][n + 1];
    }
}
```


<a id="q-10"></a>

### [10. 正则表达式匹配](https://leetcode.cn/problems/regular-expression-matching/)

**优先级 C · 题意**

实现仅含 . 与 * 的整串正则匹配，* 修饰前一个字符。

**从直接思路到主解法**

回溯会反复尝试同一前缀；dp[i][j] 表示两个前缀是否完全匹配。普通字符走对角，x* 分成使用 0 次或再匹配 1 次。

**手推例子**

s=aaa，p=a* 为 true；s=ab，p=.* 为 true。

**正确性关键与边界**

0 次分支 dp[i][j-2] 无条件可尝试；≥1 次需末字符匹配且 dp[i-1][j]。* 不是独立通配符，模式保证合法。

**复杂度**

时间 O(mn)；辅助空间 O(mn)。

**Java 主实现**

```java
class Solution {
    public boolean isMatch(String s, String p) {
        int m = s.length(),n = p.length();
        boolean[][] f = new boolean[m + 1][n + 1];
        f[0][0] = true;
        // 为啥i从0开始，而j从1开始？因为f数组中i j代表的是第几个字符，所以真实字符是从1开始，但是动态规划过程
        // 匹配* 需要依赖到f[i -1][j]，比如i为1时，这样如果i从0开始，f[i -1][j]就得不到f[0][j]这个一维数组的正确答案
        for(int i = 0;i <= m;i++){
            for(int j = 1;j <= n;j++){
                if(p.charAt(j -1) == '*'){
                    // 先看*前面的字符是否匹配
                    f[i][j] = f[i][j -2];
                    // 看*前面的字符是否相同
                    if(matches(s,p,i,j -1)){
                        // 如果*前面的字符相同，可以匹配上一个字符，或者s中第i个字符匹配后，再看s中i-1个字符是否匹配
                        f[i][j] = f[i][j] || f[i -1][j];
                    }
                } else{
                    // 如果p第j个字符不为*，那就看第p中第j个字符为 .,或者和s中第i个字符相同
                    if(matches(s,p,i,j)){
                        f[i][j] = f[i-1][j-1];
                    }
                }
            }
        }
        return f[m][n];
    }
    private boolean matches(String s, String p,int i,int j){
        // s中没有字符
        if(i == 0){
            return false;
        }
        if(p.charAt(j-1) == '.'){
            return true;
        }
        return p.charAt(j-1) == s.charAt(i - 1);
    }
}
```



> [目录](../README.md)
