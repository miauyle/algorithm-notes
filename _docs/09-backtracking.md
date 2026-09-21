---
title: 09 回溯
category: 搜索与算法范式
description: 子集、排列、组合、切分与棋盘搜索。
---

<a id="chapter-09"></a>

## 09 回溯

回溯不是“有递归就算”。它在一个搜索状态上做选择，再撤销选择，探索其他可能。先说明四件事：状态、当前候选集合、终止条件、撤销操作。

| 类型 | 下一层如何推进 | 如何防止重复 |
| --- | --- | --- |
| 子集 78 | 下一个位置，选或不选 | 每位置只决策一次 |
| 排列 46 | 固定下一个槽位 | 已选元素不再使用 |
| 无限组合 39 | 选择当前项后可停留当前索引 | 下标不下降 |
| 切分 131/93 | start=end+1 | 每条路径代表一组切点 |
| 棋盘 51 | 下一行 | 列和两条对角线占用 |

输出指数级时，指数时间不一定能“优化成多项式”，因为仅写出答案就需要相应时间。更有意义的优化是提前剪掉必败分支、去掉重复分支，以及避免重复计算校验信息。

**本章题目**

[78](#q-78) · [46](#q-46) · [39](#q-39) · [22](#q-22) · [17](#q-17) · [93](#q-93) · [79](#q-79) · [131](#q-131) · [51](#q-51) · [301](#q-301)


<a id="q-78"></a>

### [78. 子集](https://leetcode.cn/problems/subsets/)

**优先级 A · 题意**

返回无重复数组的所有子集。

**从直接思路到主解法**

对每个位置只有取或不取两种选择，递归至末尾复制当前集合；也可用 n 位掩码枚举。

**手推例子**

[1,2] → []、[1]、[2]、[1,2]，顺序不限。

**正确性关键与边界**

空集也是答案；路径必须在递归返回后撤销，保存时复制。不要与排列混用“每层从所有元素选”。

**复杂度**

时间 O(n·2ⁿ)；辅助空间 O(n)，输出 O(n·2ⁿ)。

**Java 主实现**

```java
class Solution {
    List<List<Integer>> ans = new ArrayList<>();
    List<Integer> t =  new ArrayList<>();
    public List<List<Integer>> subsets(int[] nums) {
        ans = new ArrayList<>();
        t = new ArrayList<>();
        dfs(0,nums);
        return ans;
    }
    private void dfs(int cur,int[] nums){
        // 出口
        if(cur == nums.length){
            ans.add(new ArrayList<>(t));
            return;
        }
        // 如果cur位置元素取
        t.add(nums[cur]);
        dfs(cur + 1,nums);
        // 对t回溯cur位置元素，当cur位置元素不取，那删除t中cur位置元素继续处理
        t.remove(t.size() - 1);
        dfs(cur + 1,nums);
    }
}
```


<a id="q-46"></a>

### [46. 全排列](https://leetcode.cn/problems/permutations/)

**优先级 A · 题意**

返回无重复数组的全部排列。

**从直接思路到主解法**

把第 first 个位置视为待决策位，枚举后缀每个元素交换到这里，递归后再交换回去。

**手推例子**

[1,2,3]：先固定 1，后缀产生 123、132，再尝试固定 2 和 3。

**正确性关键与边界**

同一路径每个元素只能用一次；答案要复制。若含重复值，需额外做同层去重。

**复杂度**

时间 O(n·n!)；辅助空间 O(n)，输出 O(n·n!)。

**Java 主实现**

```java
class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> ans = new ArrayList<>();
        List<Integer> output = new ArrayList<>();
        for(int num : nums){
            output.add(num);
        }
        int n = nums.length;
        backtrack(n,output,ans,0);
        return ans;
    }
    private void backtrack(int n ,List<Integer> output,List<List<Integer>> ans,int first){
        // 所有数填完
        if(first == n ){
            ans.add(new ArrayList<Integer>(output));
        }
        for(int i = first; i < n ;i++){
            Collections.swap(output,first,i);
            // 递归下一个数
            backtrack(n,output,ans,first + 1);
            // 撤销
            Collections.swap(output,first,i);
        }
    }
}
```


<a id="q-39"></a>

### [39. 组合总和](https://leetcode.cn/problems/combination-sum/)

**优先级 A · 题意**

给定无重复正整数候选，每个可用无限次，列出和为目标的组合。

**从直接思路到主解法**

无约束枚举会把 [2,3]、[3,2] 重复计算。只按候选下标不下降地选择；选当前项可继续留在同一下标。

**手推例子**

[2,3,6,7]、target=7 → [2,2,3]、[7]。

**正确性关键与边界**

与 0/1 选择不同，复用当前数不推进下标；正数约束使剩余金额递减，若含 0 就可能无限递归。

**复杂度**

搜索为指数级，依赖候选和目标；递归深度 O(k+T/minCoin)，输出另计。

**Java 主实现**

```java
class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        List<List<Integer>> ans = new ArrayList<>();
        List<Integer> combine = new ArrayList<>();
        dfs(candidates,target,combine,ans,0);
        return ans;
    }
    private void dfs(int[] candidates,int target,List<Integer> combine, List<List<Integer>> ans ,int idx){
        if(idx == candidates.length){
            return;
        }
        if(target == 0){
            ans.add(new ArrayList<>(combine));
            return;
        }
        // 不取 idx
        dfs(candidates,target,combine,ans,idx + 1);
        // 取idx
        if(target - candidates[idx] >= 0){
            combine.add(candidates[idx]);
            // 每个数字可以被无限重取，所以仍为idx
            dfs(candidates,target - candidates[idx],combine,ans,idx);
            // 回溯撤回
            combine.remove(combine.size() - 1);
        }
    }
}
```


<a id="q-22"></a>

### [22. 括号生成](https://leetcode.cn/problems/generate-parentheses/)

**优先级 A · 题意**

生成 n 对括号的所有合法排列。

**从直接思路到主解法**

先枚举所有 2^(2n) 字符串再验证很浪费。构造时保证 usedRight≤usedLeft≤n，只探索合法前缀。

**手推例子**

n=2 → (())、()()；前缀 )( 应在第一步就剪掉。

**正确性关键与边界**

放左括号需仍有额度，放右括号需已有未闭合的左括号；输出长度必须是 2n。

**复杂度**

时间 O(n·Cₙ)，Cₙ 为第 n 个卡塔兰数；辅助空间 O(n)，输出另计。

**Java 主实现**

```java
class Solution {
    public List<String> generateParenthesis(int n) {
        List<String> ans = new ArrayList<>();
        dfs(n, 0, 0, new StringBuilder(), ans);
        return ans;
    }
    private void dfs(int n, int left, int right, StringBuilder path, List<String> ans) {
        if (path.length() == 2 * n) { ans.add(path.toString()); return; }
        if (left < n) {
            path.append('(');
            dfs(n, left + 1, right, path, ans);
            path.deleteCharAt(path.length() - 1);
        }
        if (right < left) {
            path.append(')');
            dfs(n, left, right + 1, path, ans);
            path.deleteCharAt(path.length() - 1);
        }
    }
}
```


<a id="q-17"></a>

### [17. 电话号码的字母组合](https://leetcode.cn/problems/letter-combinations-of-a-phone-number/)

**优先级 B · 题意**

返回数字 2..9 在电话键盘上的全部字母组合。

**从直接思路到主解法**

每层处理一个数字，从其对应的 3 或 4 个字母里选一个，递归组合后续数字。

**手推例子**

23 → ad、ae、af、bd、be、bf、cd、ce、cf。

**正确性关键与边界**

这是每个位置从各自候选集选一个，字母可在不同位置重复；空输入返回空列表。

**复杂度**

最坏时间 O(n·4ⁿ)；辅助空间 O(n)，输出另计。

**Java 主实现**

```java
class Solution {
    public List<String> letterCombinations(String digits) {
        List<String> combinations = new ArrayList<>();
        if(digits == null || digits.length() == 0){
            return combinations;
        }
        Map<Character,String> letterMap = new HashMap<>();
        letterMap.put('2',"abc");
        letterMap.put('3',"def");
        letterMap.put('4',"ghi");
        letterMap.put('5',"jkl");
        letterMap.put('6',"mno");
        letterMap.put('7',"pqrs");
        letterMap.put('8',"tuv");
        letterMap.put('9',"wxyz");
        backtrack(digits,letterMap,combinations,0,new StringBuilder());
        return combinations;
    }
    private void backtrack(String digits,Map<Character,String> letterMap,List<String> combinations,int index,  StringBuilder combination){
        if(index == digits.length()){
            combinations.add(combination.toString());
            return;
        }
        char digit = digits.charAt(index);
        String letters = letterMap.get(digit);
        for(int i = 0; i < letters.length();i++){
            // 如果取当前字母
            combination.append(letters.charAt(i));
            // 再去取index + 1位置的字母
            backtrack(digits,letterMap,combinations,index + 1,combination);
            // 换当前数字对应的其他字母
            combination.deleteCharAt(index);
        }
    }
}
```


<a id="q-93"></a>

### [93. 复原 IP 地址](https://leetcode.cn/problems/restore-ip-addresses/)

**优先级 B · 题意**

将数字串分成四个合法 IPv4 段。

**从直接思路到主解法**

枚举所有切点后过滤能做；回溯逐段只尝试 1～3 位，并立即检查前导零和 0..255。

**手推例子**

"101023" 中第一段可以是 1、10、101，但不能是 1010；"0000" 仅得 0.0.0.0。

**正确性关键与边界**

剩余字符必须能装进剩余段：段数≤字符数≤3×段数。已取四段但还有字符不算答案。

**复杂度**

深度固定 4、每段≤3 种长度，搜索上界 O(3⁴)；输出长度也有固定上限。

**Java 主实现**

```java
class Solution {
    static final int SEG_COUNT = 4;
    List<String> ans = new ArrayList<>();
    int[] segments = new int[SEG_COUNT];
    public List<String> restoreIpAddresses(String s) {
        ans = new ArrayList<>();
        if (s.length() < 4 || s.length() > 12) return ans;
        dfs(s,0,0);
        return ans;
    }
    private void dfs(String s,int segId ,int segStart){
        // 如果找到了4段ip，且遍历完了字符串，则答案确定
        if(segId == SEG_COUNT){
            if(segStart == s.length()){
                StringBuilder str = new StringBuilder();
                for(int i = 0;i < SEG_COUNT;i++){
                    str.append(segments[i]);
                    if(i != SEG_COUNT -1){
                        str.append(".");
                    }
                }
                ans.add(str.toString());
            }
            return;
        }
        // 如果没找到4个ip段，就遍历完字符串，直接回溯
        if(segStart == s.length()){
            return;
        }
        // 如果字符串为0，由于不能有0前导，所以0只能是单独的ip段
        if(s.charAt(segStart) == '0'){
            segments[segId] = 0;
            dfs(s,segId + 1,segStart + 1);
        }
        // 一般情况，枚举每一种可能
        int addr =0;
        for(int segEnd = segStart;segEnd < s.length();segEnd++){
            addr = addr * 10 + (s.charAt(segEnd) - '0');
            if(addr >0 && addr <= 255){
                segments[segId] = addr;
                dfs(s,segId + 1,segEnd + 1);
            } else {
                break;
            }
        }
    }
}
```


<a id="q-79"></a>

### [79. 单词搜索](https://leetcode.cn/problems/word-search/)

**优先级 B · 题意**

网格四方向拼出单词，每条路径每格最多使用一次。

**从直接思路到主解法**

从每个格子尝试 DFS；匹配当前字符后标记占用，尝试下一字符，退出时恢复。

**手推例子**

[[A,B],[C,D]] 能找到 ABD，不能沿同一个 B 格重复形成 ABA。

**正确性关键与边界**

visited 是当前路径的占用状态，不能整次搜索永久标记；与岛屿搜索恰好不同。

**复杂度**

保守时间 O(mn·3ᴸ)，L 为单词长度；visited O(mn)，递归 O(L)。

**Java 主实现**

```java
class Solution {
    public boolean exist(char[][] board, String word) {
        int rows = board.length, columns = board[0].length;
        boolean[][] visited = new boolean[rows][columns];
        for(int i = 0; i < rows; i++){
            for(int j = 0;j < columns;j++){
                boolean flag = check(board,i,j,word,visited,0);
                if(flag){
                    return true;
                }
            }
        }
        return false;
    }
    private boolean check(char[][] board,int i, int j,String word,boolean[][] visited,int k){
        if(board[i][j] != word.charAt(k)){
            return false;
        } else if(k == word.length() -1){
            // 如果word遍历到末尾，且board[i][j] == word.charAt(k) 返回ture
            return true;
        }
        visited[i][j] = true;
        boolean result = false;
        // 每个位置向他的四个方向移动
        if(isOutOfBounds(board,i+1,j) && !visited[i+1][j] && check(board,i + 1,j,word,visited,k + 1)
        || isOutOfBounds(board,i-1,j) && !visited[i-1][j] && check(board,i - 1,j,word,visited,k + 1)
        || isOutOfBounds(board,i,j+1) && !visited[i][j+1] && check(board,i,j + 1,word,visited,k + 1)
        || isOutOfBounds(board,i,j-1) && !visited[i][j-1] && check(board,i,j -1,word,visited,k + 1)){
            result = true;
        }
        // 回撤
        visited[i][j] = false;
        return result;
    }
    private boolean isOutOfBounds(char[][] board,int i,int j){
        int rows = board.length, columns = board[0].length;
        if(i >=0 && i < rows && j >= 0 && j < columns){
            return true;
        }
        return false;
    }
}
```


<a id="q-131"></a>

### [131. 分割回文串](https://leetcode.cn/problems/palindrome-partitioning/) · 新增

**优先级 B · 题意**

列出字符串的所有切分方式，使每一段都为回文。

**从直接思路到主解法**

枚举切点；先用 DP 预处理 pal[l][r]，回溯从 start 开始枚举每段终点，只有回文段才向下递归。

**手推例子**

aab：a→a→b 与 aa→b 两条成功分支；aab 整段不是回文。

**正确性关键与边界**

下一层从 end+1 开始，表示上一段已经完整消费；到末尾复制路径。单字符天然回文。

**复杂度**

时间 O(n²+n·2ⁿ)；辅助空间 O(n²)，输出最坏 O(n·2ⁿ)。

**Java 主实现**

```java
class Solution {
    public List<List<String>> partition(String s) {
        int n = s.length();
        boolean[][] pal = new boolean[n][n];
        for (int left = n - 1; left >= 0; left--) {
            for (int right = left; right < n; right++) {
                pal[left][right] = s.charAt(left) == s.charAt(right)
                && (right - left < 2 || pal[left + 1][right - 1]);
            }
        }
        List<List<String>> ans = new ArrayList<>();
        dfs(s, 0, pal, new ArrayList<>(), ans);
        return ans;
    }
    private void dfs(String s, int start, boolean[][] pal,
    List<String> path, List<List<String>> ans) {
        if (start == s.length()) {
            ans.add(new ArrayList<>(path));
            return;
        }
        for (int end = start; end < s.length(); end++) {
            if (!pal[start][end]) continue;
            path.add(s.substring(start, end + 1));
            dfs(s, end + 1, pal, path, ans);
            path.remove(path.size() - 1);
        }
    }
}
```


<a id="q-51"></a>

### [51. N 皇后](https://leetcode.cn/problems/n-queens/) · 新增

**优先级 B · 题意**

在 n×n 棋盘放 n 个互不攻击皇后，返回所有布局。

**从直接思路到主解法**

逐格枚举太多；每行只放一个皇后，用列占用、两类对角线占用 O(1) 判冲突，然后递归下一行。

**手推例子**

n=4，列位置 [1,3,0,2] 是一种解；n=2、3 无解，n=1 为 Q。

**正确性关键与边界**

主对角线用 row-col+n-1，副对角线用 row+col。递归退出必须撤销三个标记；找到布局后再生成字符串。


**对角线下标怎么推出来？**

向右下走时，行列同时加 1，所以 `row-col` 不变；向左下走时，行加 1、列减 1，所以 `row+col` 不变。前者最小是 `-(n-1)`，加偏移 `n-1` 后落入 `0..2n-2`，可以用布尔数组。

每层只负责一行，因此同行冲突不需要再检查。列与两类对角线未占用才放置；返回时撤销，否则兄弟分支会被上一条路径错误阻塞。

**追问：还要上位运算吗？** 布尔数组版先写稳。位掩码能更快枚举可用列，但面试主线仍是相同的状态和剪枝，不应跳过对角线含义。

**复杂度**

本实现每状态遍历 n 列，保守时间 O(n·n!+S·n²)，S 为解数；辅助 O(n)，输出 O(S·n²)。

**Java 主实现**

```java
class Solution {
    public List<List<String>> solveNQueens(int n) {
        List<List<String>> ans = new ArrayList<>();
        dfs(0, n, new int[n], new boolean[n],
        new boolean[2*n-1], new boolean[2*n-1], ans);
        return ans;
    }
    private void dfs(int row, int n, int[] pos, boolean[] cols,
    boolean[] diag1, boolean[] diag2, List<List<String>> ans) {
        if (row == n) {
            List<String> board = new ArrayList<>();
            for (int r = 0; r < n; r++) {
                char[] line = new char[n];
                Arrays.fill(line, '.');
                line[pos[r]] = 'Q';
                board.add(new String(line));
            }
            ans.add(board);
            return;
        }
        for (int col = 0; col < n; col++) {
            int d1 = row - col + n - 1, d2 = row + col;
            if (cols[col] || diag1[d1] || diag2[d2]) continue;
            pos[row] = col;
            cols[col] = diag1[d1] = diag2[d2] = true;
            dfs(row + 1, n, pos, cols, diag1, diag2, ans);
            cols[col] = diag1[d1] = diag2[d2] = false;
        }
    }
}
```


<a id="q-301"></a>

### [301. 删除无效的括号](https://leetcode.cn/problems/remove-invalid-parentheses/)

**优先级 C · 题意**

删除最少括号，使字符串合法，并返回所有不同结果。

**从直接思路到主解法**

先扫一遍求必须删除的左右括号数，再回溯每个位置的保留/删除；只用恰好这些删除额度。

**手推例子**

()())() → ()()()、(())()；字母必须保留。

**正确性关键与边界**

保留右括号前余额必须>0；剩余长度不足删除额度时剪枝；用 Set 去重；深度与字符串长度有关。

**复杂度**

最坏时间 O(n·2ⁿ)；辅助空间 O(n)，结果去重集合与输出另计。

**Java 主实现**

```java
class Solution {
    public List<String> removeInvalidParentheses(String s) {
        int leftRemove = 0, rightRemove = 0;
        for (char c : s.toCharArray()) {
            if (c == '(') leftRemove++;
            else if (c == ')') {
                if (leftRemove > 0) leftRemove--;
                else rightRemove++;
            }
        }
        Set<String> ans = new HashSet<>();
        dfs(s, 0, 0, leftRemove, rightRemove, new StringBuilder(), ans);
        return new ArrayList<>(ans);
    }
    private void dfs(String s, int i, int balance, int lr, int rr,
    StringBuilder path, Set<String> ans) {
        if (lr + rr > s.length() - i) return;
        if (i == s.length()) {
            if (balance == 0 && lr == 0 && rr == 0) ans.add(path.toString());
            return;
        }
        char c = s.charAt(i);
        if (c == '(' && lr > 0) dfs(s, i + 1, balance, lr - 1, rr, path, ans);
        if (c == ')' && rr > 0) dfs(s, i + 1, balance, lr, rr - 1, path, ans);
        if (c == ')' && balance == 0) return;
        path.append(c);
        int nextBalance = balance + (c == '(' ? 1 : c == ')' ? -1 : 0);
        dfs(s, i + 1, nextBalance, lr, rr, path, ans);
        path.deleteCharAt(path.length() - 1);
    }
}
```


