# 算法面试笔记：从思路推导到 Java 实现

> 基于你的原始算法笔记重构；保留原有 136 道题，新增 11 道，共 147 道。  
> 本次补充的 1143「最长公共子序列」与原笔记重复，已在原条目增强讲解，没有重复计数。  
> 整理日期：2026-09-20。主语言：Java，使用常见 Java 8 语法；实际编译检查使用 Java 17。

## 阅读入口

这份笔记用于恢复“现场分析、解释、编码”的能力。每道题先给精简题意，再讲从直接思路到主解法的推导，接着给例子、正确性关键、边界与复杂度，最后放代码。**先遮住代码，自己讲明白为什么这样做，再核对实现。**

主解法选择以好解释、好写稳为先，不强行给每道题塞入理论最优技巧。比如最长回文先用中心扩展，第 K 大先用小根堆，除法求值先用图搜索；更快方案的条件和取舍写在旁边。模拟题本来就接近逐字处理的下界，不人为编造一套无用的暴力解。

这是一份按模式检索的完整题库，**不要求一次顺序读完 147 道**。优先级是本书为复习安排给出的建议，并不是招聘题频统计：A 为基础主线，B 为重要变体，C 为可后置的难题或细节题。

第一轮可以先做这 32 道，覆盖主要模式：

`283、88、11、15、128、3、209、560、35、34、33、21、19、141、142、20、739、215、146、295、98、108、236、124、200、994、46、55、45、53、300、1143`。

熟练后再补其余 A、B；4、10、85、301、312、460 等题可放后面，避免为了攻克单道难题拖慢整体恢复。

## 面试时每道题怎样说

1. **澄清条件**：是否有序？有无重复、负数？能否改输入？求一个解、所有解、长度还是计数？
2. **先给正确的直接方案**：例如枚举两端 O(n²)，说出重复工作在哪。
3. **指出可利用的性质**：单调性、重复子问题、局部支配、前缀差、树的递归结构。
4. **定义状态与不变量**：left/right 代表什么？dp 包含当前元素吗？递归到底返回什么？
5. **编码并口头跑例子**：先普通例，再边界例；说明时间、辅助空间和输出空间。

如果知道更快方案但一时写不稳，可以先说明取舍并完成正确版本，再优化。不要把“我记得用滑窗”作为全部解释。

## 代码约定与验证范围

- 每题代码独立使用，不能把 147 个 `Solution` 直接粘进同一个类。普通题在代码前补 `import java.util.*;`。
- `ListNode`、`TreeNode` 由刷题平台提供；138 的 `Node` 含 next/random，Offer 36 的 `Node` 含 left/right；两种 Node 不要混用。470 的 `rand7()` 由平台提供。
- 除明确说明外，采用原题合法输入约束，不额外承诺所有 null、越界参数和不合法表达式的通用 API 行为。
- 递归栈算辅助空间；返回的数组、链表、路径另行说明。哈希访问 O(1) 指平均情形。
- 本书的 147 段主代码均做了补齐平台类型后的本地编译检查；另对新增题和重点修订题做了运行测试。未逐题提交 LeetCode，不能将此表述成 147 题在线评测全通过。详细范围见文末。
- 每题标题链接指向题目页；题意为摘要，完整约束以题目页为准。保留旧 Offer 名称便于对应原笔记。
- 正文使用标准标题、表格和 Java 围栏，不依赖外部图片、插件公式或折叠 HTML；支持目录的 Markdown 阅读器可用侧栏跳转。

## 目录

- [01 数组与双指针](#chapter-01)
- [02 窗口与前缀](#chapter-02)
- [03 二分](#chapter-03)
- [04 链表](#chapter-04)
- [05 栈与单调结构](#chapter-05)
- [06 堆与设计](#chapter-06)
- [07 树](#chapter-07)
- [08 图与搜索](#chapter-08)
- [09 回溯](#chapter-09)
- [10 贪心与区间](#chapter-10)
- [11 动态规划](#chapter-11)
- [12 字符串与模拟](#chapter-12)
- [13 概率与位运算](#chapter-13)

完整题号索引见文末；每章也有直达各题的链接。


<a id="chapter-01"></a>

## 01 数组与双指针

数组题先找“已经处理好的区域”。移动零维护非零前缀；三数之和维护有序区间；原地哈希维护值与下标的对应关系。双指针不是记两个变量，而是证明每一步排除的元素不再需要考虑。

| 场景 | 需要的性质 | 移动理由 |
| --- | --- | --- |
| 11 盛水 | 面积由短板限制 | 保留短板而缩短宽度不会更好 |
| 15 三数之和 | 排序后的和对指针单调 | 和小增左端，和大减右端 |
| 88 合并数组 | 末尾有预留空间 | 反向写不覆盖未处理前缀 |
| 75 颜色分类 | 元素仅有三类 | 扩大确定区域、缩小未知区域 |

本章的 912 还提供排序主实现。面试时先说明是否可以改动输入；需要返回原数组索引的题，不能未经处理就把输入排序。

**本章题目**

[283](#q-283) · [88](#q-88) · [11](#q-11) · [42](#q-42) · [15](#q-15) · [128](#q-128) · [49](#q-49) · [169](#q-169) · [75](#q-75) · [41](#q-41) · [448](#q-448) · [31](#q-31) · [581](#q-581) · [54](#q-54) · [48](#q-48) · [498](#q-498) · [912](#q-912)


<a id="q-283"></a>

### [283. 移动零](https://leetcode.cn/problems/move-zeroes/)

**优先级 A · 题意**

稳定地把所有零移到末尾。

**从直接思路到主解法**

额外数组保存非零再补零可做；用 write 指向下一个非零应去的位置，read 扫描，遇非零就交换。

**手推例子**

[0,1,0,3,12] → [1,3,12,0,0]。

**正确性关键与边界**

保持 [0,write) 都是按原顺序排列的非零；无需遇到 0 就逐项右移，否则退化平方。

**复杂度**

时间 O(n)；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    public void moveZeroes(int[] nums) {
        int n = nums.length, left = 0, right = 0;
        while(right < n){
            if(nums[right] != 0){
                swap(nums,right,left++);
            }
            right++;
        }
    }
    private void swap(int[] nums,int i ,int j){
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }
}
```


<a id="q-88"></a>

### [88. 合并两个有序数组](https://leetcode.cn/problems/merge-sorted-array/)

**优先级 A · 题意**

将 nums2 合并到带有预留空间的 nums1 中。

**从直接思路到主解法**

正向写可能覆盖未处理数据，需要额外数组。反向比较末尾，把较大值写到 nums1 最后空位，避免覆盖。

**手推例子**

[1,3,0,0]，m=2；[2,4]，n=2 → [1,2,3,4]。

**正确性关键与边界**

预留位置的 0 不是有效元素；nums2 耗尽即可结束，nums1 剩余前缀已经在正确位置。

**复杂度**

时间 O(m+n)；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    // 逆向双指针法
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        int p1 = m -1;
        int p2 = n -1;
        int tail = m + n -1;
        while(p1 >= 0 || p2 >= 0){
            if(p1 == -1){
                nums1[tail--] = nums2[p2--];
            } else if(p2 == -1){
                nums1[tail--] = nums1[p1--];
            } else if(nums1[p1] > nums2[p2]  ){
                nums1[tail--] = nums1[p1--];
            } else{
                nums1[tail--] = nums2[p2--];
            }
        }
    }
}
```


<a id="q-11"></a>

### [11. 盛最多水的容器](https://leetcode.cn/problems/container-with-most-water/)

**优先级 A · 题意**

两条竖线与横轴围成的最大面积。

**从直接思路到主解法**

枚举两端 O(n²)。面积由短板限制：保留短板而移动长板，宽度缩小、高度上限不增，因此可以直接丢弃短板端。

**手推例子**

[1,2,4,3]：两端面积 3，移左端后面积 4，再移左端得 3，答案 4。

**正确性关键与边界**

不是每次移动都会变好，而是被排除的方案不可能更好。两端等高时移动任意一端。

**复杂度**

时间 O(n)；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    public int maxArea(int[] height) {
        if(height.length < 2){
            return 0;
        }
        int left = 0;
        int right = height.length -1;
        int ans =0;
        while(left < right){
            ans = Math.max((right - left)*Math.min(height[left],height[right]),ans);
            // 如果左边值如果小，说明可以右移，看有没有更大的值
            if(height[left] <= height[right]){
                left++;
            }else{
                // 反之如是
                right--;
            }
        }
        return ans;
    }
}
```


<a id="q-42"></a>

### [42. 接雨水](https://leetcode.cn/problems/trapping-rain-water/)

**优先级 B · 题意**

求柱子之间可积的总雨水。

**从直接思路到主解法**

每格水量由左右最高墙的较小者决定。先用前后缀最大值做到 O(n)，再用左右指针维护最高墙，将空间降到 O(1)。

**手推例子**

[3,0,2,0,4]：各格水量 0、3、1、3、0，总计 7。

**正确性关键与边界**

当 leftMax<rightMax 时，左侧水位已确定，不需知道右侧更远的精确高度。与 11 求两墙面积不同。

**复杂度**

时间 O(n)；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    public int trap(int[] height) {
        if(height == null || height.length <= 2){
            return 0;
        }
        int n = height.length ,sum = 0;
        int leftMax = height[0],rightMax = height[n - 1];
        int left = 0,right = n -1;
        while(left <= right){
            if(leftMax < rightMax){
                sum+=Math.max(0,leftMax - height[left]);
                leftMax = Math.max(height[left],leftMax);
                left++;
            } else{
                sum+=Math.max(0,rightMax - height[right]);
                rightMax = Math.max(height[right],rightMax);
                right--;
            }
        }
        return sum;
    }
}
```


<a id="q-15"></a>

### [15. 三数之和](https://leetcode.cn/problems/3sum/)

**优先级 A · 题意**

列出和为 0 的不重复三元组。

**从直接思路到主解法**

三重枚举 O(n³)。排序后固定一个数，余下问题成为有序区间的两数之和；和小移左，和大移右。

**手推例子**

[-1,0,1,2,-1,-4] → [-1,-1,2]、[-1,0,1]。

**正确性关键与边界**

按值去重而非按索引去重；固定数和匹配成功后的两端都要跳过重复值。排序会修改输入。

**复杂度**

时间 O(n²)；指针 O(1)，排序栈通常 O(log n)，结果另计。

**Java 主实现**

```java
class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> ans = new ArrayList<>();
        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            if (nums[i] > 0) break;
            int left = i + 1, right = nums.length - 1;
            while (left < right) {
                long sum = (long) nums[i] + nums[left] + nums[right];
                if (sum < 0) left++;
                else if (sum > 0) right--;
                else {
                    ans.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    int a = nums[left], b = nums[right];
                    while (left < right && nums[left] == a) left++;
                    while (left < right && nums[right] == b) right--;
                }
            }
        }
        return ans;
    }
}
```


<a id="q-128"></a>

### [128. 最长连续序列](https://leetcode.cn/problems/longest-consecutive-sequence/)

**优先级 A · 题意**

求整数集合中最长连续数值序列长度，不要求原位置连续。

**从直接思路到主解法**

排序 O(n log n)。哈希去重后，只从不存在前驱 x-1 的数开始向后延长，每条连续链只扫一次。

**手推例子**

[100,4,200,1,3,2,2] → 1,2,3,4，长度 4。

**正确性关键与边界**

外层遍历去重后的 Set，避免重复起点导致重复扫描；整数极值需防止 x±1 溢出。

**复杂度**

平均时间 O(n)；辅助空间 O(n)。

**Java 主实现**

```java
class Solution {
    public int longestConsecutive(int[] nums) {
        Set<Integer> set = new HashSet<>();
        for (int x : nums) set.add(x);
        int ans = 0;
        for (int x : set) {
            if (x != Integer.MIN_VALUE && set.contains(x - 1)) continue;
            int cur = x, len = 1;
            while (cur != Integer.MAX_VALUE && set.contains(cur + 1)) {
                cur++;
                len++;
            }
            ans = Math.max(ans, len);
        }
        return ans;
    }
}
```


<a id="q-49"></a>

### [49. 字母异位词分组](https://leetcode.cn/problems/group-anagrams/)

**优先级 A · 题意**

把互为字母异位词的字符串归组。

**从直接思路到主解法**

排序后的串可作统一键；若限定小写字母，用 26 个字母计数构造签名更直接。

**手推例子**

eat、tea、ate 计数签名相同；bat 另成一组。

**正确性关键与边界**

计数签名需分隔或带字符标记，不能把 [1,11]、[11,1] 拼成同样的 111。不能直接用 int[] 内容作为 HashMap 等价键。

**复杂度**

时间 O(S+26n)，S 为总字符数；空间 O(S+n) 的安全上界，含签名与分组结果。

**Java 主实现**

```java
class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        // map
        HashMap<String,List<String>> map = new HashMap<String,List<String>>();
        // 迭代的时候把单词按字母排序，一样的放在一个键值对中
        for(String str : strs){
            int[] counts = new int[26];
            // 根据小写字母，把字符串中所有出现的字母在长度为26的数组中记录对应出现次数
            for(int i = 0;i < str.length();i++){
                counts[str.charAt(i) - 'a']++;
            }
            // 然后把数组从前往后遍历，把出现次数大于0的字母取出，拼成字符串，这样所有由相同字母拼成的字符串会拼成相同的key
            // 本质上其实还是排序
            StringBuilder strKey = new StringBuilder();
            for(int i = 0;i < 26;i++){
                if(counts[i] != 0){
                    strKey.append((char)('a' + i));// 此处只是append一个字母
                    strKey.append(counts[i]);// 再append出现次数保证同一个字母出现n次只用append2次，且唯一
                }
            }
            String key = strKey.toString();
            List<String> list = map.getOrDefault(key,new ArrayList<String>());
            list.add(str);
            map.put(key,list);
        }
        return new ArrayList<List<String>>(map.values());
    }
}
```


<a id="q-169"></a>

### [169. 多数元素](https://leetcode.cn/problems/majority-element/)

**优先级 B · 题意**

找出现次数严格超过一半的元素，题目保证存在。

**从直接思路到主解法**

哈希计数 O(n) 空间。不同值成对抵消不会消灭多数元素，维护候选与净票数即可。

**手推例子**

[2,2,1,1,1,2,2] 抵消后候选 2。

**正确性关键与边界**

count 不是候选的真实频数；若不保证多数元素存在，最终必须再扫描一次验证。

**复杂度**

时间 O(n)；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    public int majorityElement(int[] nums) {
        Integer candidate = null;
        int count = 0;
        for(int num : nums){
            if(count == 0){
                candidate = num;
            }
            count+= candidate == num ? 1 : -1;
        }
        return candidate;
    }
}
```


<a id="q-75"></a>

### [75. 颜色分类](https://leetcode.cn/problems/sort-colors/)

**优先级 B · 题意**

原地把只含 0、1、2 的数组排序。

**从直接思路到主解法**

计数后重写可做两遍；荷兰国旗用三段已知区和一段未知区，一遍把 0 送左边、2 送右边。

**手推例子**

[2,0,2,1,1,0] → [0,0,1,1,2,2]。

**正确性关键与边界**

换来右端的未知值后不能直接 i++；换 0 时可前进，因为左端换来的是已处理的 1 或自身。

**复杂度**

时间 O(n)；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    public void sortColors(int[] nums) {
        int left = 0, i = 0, right = nums.length - 1;
        while (i <= right) {
            if (nums[i] == 0) swap(nums, left++, i++);
            else if (nums[i] == 2) swap(nums, i, right--);
            else i++;
        }
    }
    private void swap(int[] a, int i, int j) {
        int temp = a[i]; a[i] = a[j]; a[j] = temp;
    }
}
```


<a id="q-41"></a>

### [41. 缺失的第一个正数](https://leetcode.cn/problems/first-missing-positive/)

**优先级 B · 题意**

找未出现的最小正整数，要求线性时间、常数辅助空间。

**从直接思路到主解法**

Set 能做但用 O(n) 空间。答案一定在 1..n+1，将范围内的 x 尽量放到下标 x-1，相当于原地哈希。

**手推例子**

[3,4,-1,1] 归位后首个不满足 nums[i]=i+1 的位置是 1，答案 2。

**正确性关键与边界**

交换用 while，因为换来的数仍可能需归位；目标位置已有同值时停，防止重复值导致死循环。

**复杂度**

时间 O(n)，每次有效交换至少归位一个值；辅助空间 O(1)，修改输入。

**Java 主实现**

```java
class Solution {
    public int firstMissingPositive(int[] nums) {
        int n = nums.length;
        for(int i = 0 ;i < n ;i++){
            while(nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] != nums[i]){
                int temp = nums[nums[i] - 1];
                nums[nums[i] - 1] = nums[i];
                nums[i] = temp;
            }
        }
        for(int i = 0 ;i < n ;i++){
            if(nums[i] != i +1){
                return i+ 1;
            }
        }
        return n + 1;
    }
}
```


<a id="q-448"></a>

### [448. 找到所有数组中消失的数字](https://leetcode.cn/problems/find-all-numbers-disappeared-in-an-array/)

**优先级 B · 题意**

数组长 n、值在 1..n，找没出现的值。

**从直接思路到主解法**

Set 标记使用 O(n) 空间；可把 abs(x)-1 位置改为负数作为“出现过”，最后仍为正的位置对应缺失值。

**手推例子**

[4,3,2,7,8,2,3,1] → [5,6]。

**正确性关键与边界**

读取时取绝对值，不受先前标记影响；重复值只重复标负。比反复加 n 更容易避免整数溢出，修改输入。

**复杂度**

时间 O(n)；辅助空间 O(1)，输出 O(n)。

**Java 主实现**

```java
class Solution {
    public List<Integer> findDisappearedNumbers(int[] nums) {
        for (int i = 0; i < nums.length; i++) {
            int index = Math.abs(nums[i]) - 1;
            nums[index] = -Math.abs(nums[index]);
        }
        List<Integer> ans = new ArrayList<>();
        for (int i = 0; i < nums.length; i++) if (nums[i] > 0) ans.add(i + 1);
        return ans;
    }
}
```


<a id="q-31"></a>

### [31. 下一个排列](https://leetcode.cn/problems/next-permutation/)

**优先级 B · 题意**

原地得到字典序下一个排列，最大排列回到最小。

**从直接思路到主解法**

从右找首个上升对 a[i]<a[i+1]，后缀已降序；换入后缀中刚好比 a[i] 大的数，再把后缀反转成最小排列。

**手推例子**

[1,3,2]：交换 1 与 2 得 [2,3,1]，反转后缀得 [2,1,3]。

**正确性关键与边界**

从右选第一个更大值，可使增长最小；全降序时 i=-1，直接反转全数组。含重复值时比较符号要保持严格。

**复杂度**

时间 O(n)；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    public void nextPermutation(int[] nums) {
        int i = nums.length -2;
        // 找到i满足 a[i] < a[i+1]
        while(i >= 0 && nums[i] >= nums[i+ 1]){
            i--;
        }
        // 如果i存在，在[i+1,n) 中从后向前查找第一个元素j满足 a[i] < a[j]
        if(i >= 0){
            int j = nums.length -1;
            while(j >= 0 && nums[i] >= nums[j]){
                j--;
            }
            swap(nums,i,j);
        }
        // [i+1,n)区间降序，通过交换变为升序，如果没找到满足条件的i，则证明当前序列时最大序列，跳过步骤2，直接执行3，变为最小序列
        reverse(nums,i + 1);
    }
    private void swap(int[] nums,int i ,int j){
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }
    private void reverse(int[] nums,int start ){
        int left = start,right = nums.length -1;
        while(left < right){
            swap(nums,left,right);
            left++;
            right--;
        }
    }
}
```


<a id="q-581"></a>

### [581. 最短无序连续子数组](https://leetcode.cn/problems/shortest-unsorted-continuous-subarray/)

**优先级 B · 题意**

找最短一段，把它排序后能让整个数组升序。

**从直接思路到主解法**

排序副本后找首尾差异是 O(n log n)。左扫维护最大值，遇更小值更新右边界；右扫维护最小值，遇更大值更新左边界。

**手推例子**

[2,6,4,8,10,9,15] → 需排序 [6,4,8,10,9]，长度 5。

**正确性关键与边界**

已经有序时右边界保持 -1，返回 0；比较用严格大小，重复值不必强行纳入。

**复杂度**

时间 O(n)；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    public int findUnsortedSubarray(int[] nums) {
        int n = nums.length;
        int start = -1,end = -1;
        int minNum = Integer.MAX_VALUE;
        int maxNum = Integer.MIN_VALUE;
        for(int i = 0; i < n;i++){
            // 数组最大值从左往右更新，这样才能找到要找的数组区间最右
            if(nums[i] < maxNum){
                end = i;
            } else {
                maxNum = nums[i];
            }
            // 数组的最小值从右往左更新，找到数组区间最左
            if(nums[n - i -1] > minNum){
                start = n -i -1;
            } else {
                minNum = nums[n -i -1];
            }
        }
        return end == -1 ? 0 : end - start + 1;
    }
}
```


<a id="q-54"></a>

### [54. 螺旋矩阵](https://leetcode.cn/problems/spiral-matrix/)

**优先级 B · 题意**

顺时针螺旋遍历矩阵。

**从直接思路到主解法**

维护上、下、左、右四边，每轮处理外圈，再让四边向内收缩；比模拟方向和 visited 更省空间。

**手推例子**

单行 [1,2,3] 只能输出一次；单列同理。

**正确性关键与边界**

底边和左边仅在剩余区域确实有两行、两列时遍历，防止重复角点。

**复杂度**

时间 O(mn)；辅助空间 O(1)，输出 O(mn)。

**Java 主实现**

```java
class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        // 按层遍历
        List<Integer> ans = new ArrayList<>();
        if(matrix == null || matrix.length == 0 || matrix[0].length == 0){
            return ans;
        }
        int rows = matrix.length,columns = matrix[0].length;
        int left = 0,right = columns -1,top = 0,bottom = rows -1;
        while(left <= right && top <= bottom){
            // 遍历上层
            for(int column = left; column <= right;column++){
                ans.add(matrix[top][column]);
            }
            // 遍历右侧列
            for(int row = top + 1; row <= bottom;row++){
                ans.add(matrix[row][right]);
            }
            // 当 left < right && top < bottom 时遍历下层和左侧列
            if(left < right && top < bottom){
                // 遍历下层
                for(int column = right -1; column > left;column--){
                    ans.add(matrix[bottom][column]);
                }
                // 遍历左侧列
                for(int row = bottom; row > top;row--){
                    ans.add(matrix[row][left]);
                }
            }
            left++;
            top++;
            right--;
            bottom--;
        }
        return ans;
    }
}
```


<a id="q-48"></a>

### [48. 旋转图像](https://leetcode.cn/problems/rotate-image/)

**优先级 B · 题意**

把 n×n 矩阵原地顺时针旋转 90 度。

**从直接思路到主解法**

额外矩阵可直接写 (r,c)→(c,n-1-r)。原地可先上下翻转，再沿主对角线交换。

**手推例子**

[[1,2],[3,4]] → [[3,1],[4,2]]。

**正确性关键与边界**

转置只处理对角线一侧，避免交换两次抵消；该方案依赖方阵。

**复杂度**

时间 O(n²)；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    public void rotate(int[][] matrix) {
        int n = matrix.length;
        // 水平轴，列的上下翻转
        for(int i = 0;i < n/2;i++){
            for(int j = 0;j < n;j++){
                int temp = matrix[n-i-1][j];
                matrix[n-i-1][j] = matrix[i][j];
                matrix[i][j] = temp;
            }
        }
        // 主对角线翻转
        for(int i = 0;i < n ;i++){
            for(int j = 0;j < i;j++){
                int temp = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = temp;
            }
        }
    }
}
```


<a id="q-498"></a>

### [498. 对角线遍历](https://leetcode.cn/problems/diagonal-traverse/)

**优先级 C · 题意**

按交替方向遍历矩阵的每条对角线。

**从直接思路到主解法**

同一条对角线坐标和 r+c 固定，依次枚举该和，再按奇偶选择遍历方向。

**手推例子**

[[1,2,3],[4,5,6]] → [1,2,4,5,3,6]。

**正确性关键与边界**

矩阵未必方阵；起点超过一侧边界时，把余量转移到另一坐标。不要混用行列上界。

**复杂度**

时间 O(mn)；辅助空间 O(1)，输出 O(mn)。

**Java 主实现**

```java
class Solution {
    public int[] findDiagonalOrder(int[][] mat) {
        if (mat.length == 0 || mat[0].length == 0) {
            return new int[0];
        }
        int rows = mat.length,columns = mat[0].length;
        int[] ans = new int[rows * columns];
        boolean bxFLag = true;
        int index = 0;
        for (int i = 0; i < rows + columns - 1; i++) {
            // 根据不同的对角线方向，x、y代表的值不同，就是在这里变换的，bxFLag = true x代表x，y代表y；
            // bxFLag = false时，x代表y，y代表x，所以下面相应的坐标也要交换，px、py也相当于交换了
            int px = bxFLag ? rows : columns;
            int py = bxFLag ? columns : rows;
            int x = i < px ? i : px -1;
            int y = i - x;
            while (x >= 0 && y < py) {
                // x、y交换了
                ans[index++] = bxFLag ? mat[x][y] : mat[y][x];
                x--;
                y++;
            }
            // 变换对角线方向
            bxFLag = !bxFLag;
        }
        return ans;
    }
}
```


<a id="q-912"></a>

### [912. 排序数组](https://leetcode.cn/problems/sort-an-array/)

**优先级 A · 题意**

实现整数数组排序。

**从直接思路到主解法**

先讲比较排序的分治：归并将左右有序段线性合并，时间稳定 O(n log n)；快排平均同阶、最坏平方；堆排最坏同阶且常数空间。

**手推例子**

[5,2,3,1] → 分成 [5,2]、[3,1] → [2,5]、[1,3] → [1,2,3,5]。

**正确性关键与边界**

本题补齐原笔记缺失代码，选归并作为主实现；归并相等时先取左边可保持稳定。

**复杂度**

时间 O(n log n)；辅助空间 O(n)，含缓冲区与 O(log n) 栈。

**Java 主实现**

```java
class Solution {
    public int[] sortArray(int[] nums) {
        sort(nums, new int[nums.length], 0, nums.length);
        return nums;
    }
    private void sort(int[] a, int[] temp, int left, int right) {
        if (right - left <= 1) return;
        int mid = left + (right - left) / 2;
        sort(a, temp, left, mid);
        sort(a, temp, mid, right);
        int i = left, j = mid, write = left;
        while (i < mid && j < right) {
            if (a[i] <= a[j]) temp[write++] = a[i++];
            else temp[write++] = a[j++];
        }
        while (i < mid) temp[write++] = a[i++];
        while (j < right) temp[write++] = a[j++];
        System.arraycopy(temp, left, a, left, right - left);
    }
}
```


<a id="chapter-02"></a>

## 02 窗口与前缀

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


<a id="chapter-03"></a>

## 03 二分

先说“我要找哪个边界”，再选模板。不要先写 while，再猜应该用 `<=` 还是 `<`。

对于 lower_bound（第一个不小于目标的位置），本书统一半开区间 `[left,right)`：

- `[0,left)` 已确定小于目标。
- `[right,n)` 已确定不小于目标。
- `nums[mid]<target` 时，mid 也被排除，故 `left=mid+1`。
- 否则 mid 仍可能是答案，故 `right=mid`。
- 两边相遇时，位置就是答案，可能是 n。

闭区间“找一个命中项”的写法也正确，只要循环条件、边界更新和返回语义保持一致。33、153、162 的共同点是每一步都要说明哪一侧保证保留答案。

**本章题目**

[35](#q-35) · [34](#q-34) · [33](#q-33) · [153](#q-153) · [162](#q-162) · [74](#q-74) · [240](#q-240) · [4](#q-4)


<a id="q-35"></a>

### [35. 搜索插入位置](https://leetcode.cn/problems/search-insert-position/) · 新增

**优先级 A · 题意**

在有序数组中找目标位置，不存在则返回保持有序的插入点。

**从直接思路到主解法**

线性找第一个 ≥target；用半开区间 [left,right) 二分同一边界。小于目标丢左半，否则保留 mid 到右边界。

**手推例子**

[1,3,5,6]：target=2 返回 1；target=7 返回 4。

**正确性关键与边界**

答案允许等于 n；循环结束 left=right 即边界，不需要单独处理命中。是 34、300 等题的基础模板。

**复杂度**

时间 O(log(n+1))；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    public int searchInsert(int[] nums, int target) {
        int left = 0, right = nums.length; // [left, right)
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] < target) left = mid + 1;
            else right = mid;
        }
        return left;
    }
}
```


<a id="q-34"></a>

### [34. 在排序数组中查找元素的第一个和最后一个位置](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/)

**优先级 A · 题意**

在升序数组中找目标第一次和最后一次出现位置。

**从直接思路到主解法**

找到任意命中后线性扩展最坏 O(n)。分别二分第一个 ≥target 和第一个 >target，两者夹住全部目标。

**手推例子**

[1,2,2,2,4] 找 2：两个边界为 1、4，答案 [1,3]。

**正确性关键与边界**

右边界用严格大于，而不是 target+1，避免最大整数溢出；左边界可能等于数组长度。

**复杂度**

时间 O(log n)；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    public int[] searchRange(int[] nums, int target) {
        int leftIndex = binarySearch(nums,target,true);
        int rightIndex = binarySearch(nums,target,false) - 1;
        if(leftIndex <= rightIndex && rightIndex < nums.length && nums[leftIndex] == target && nums[rightIndex] == target){
            return new int[]{leftIndex,rightIndex};
        }
        return new int[] {-1,-1};
    }
    private int binarySearch(int[] nums, int target,boolean lower){
        int left = 0,right = nums.length - 1,ans = nums.length;
        while(left <= right){
            int mid = (left + right) / 2;
            if(nums[mid] > target || (lower && nums[mid] >= target)){
                right = mid -1;
                ans = mid;
            } else {
                left = mid + 1;
            }
        }
        return ans;
    }
}
```


<a id="q-33"></a>

### [33. 搜索旋转排序数组](https://leetcode.cn/problems/search-in-rotated-sorted-array/)

**优先级 A · 题意**

在无重复元素的旋转升序数组中找目标下标。

**从直接思路到主解法**

线性扫 O(n)。每轮二分后至少一半有序；先确认哪半有序，再看目标是否落在这一半的值域内。

**手推例子**

[4,5,6,7,0,1,2] 找 0：左半有序但不含目标，转向右半。

**正确性关键与边界**

本实现闭区间 [left,right]，候选 mid 已检查后必须排除。重复值会让有序侧难判断，不能照搬复杂度保证。

**复杂度**

时间 O(log n)；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    public int search(int[] nums, int target) {
        if (nums.length < 2) {
            return nums.length == 1 ? nums[0] == target ? 0 : -1 : -1;
        }
        int left = 0;
        int right = nums.length -1;
        int first = nums[0];
        while (left <= right) {
            int mid = left + ((right -left) >> 1);
            if (target == nums[mid]) {
                return mid;
            }
            // 通过比交Mid 和 第一个节点比大小确定是在前半有序数组上，还是后一半有序数组上
            if ( first <= nums[mid]) {
                if (first <= target && target < nums[mid]) {
                    right = mid - 1;
                } else {
                    left = mid + 1;
                }
            } else {
                if (nums[mid] < target && target <= nums[nums.length -1]) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
        }
        return -1;
    }
}
```


<a id="q-153"></a>

### [153. 寻找旋转排序数组中的最小值](https://leetcode.cn/problems/find-minimum-in-rotated-sorted-array/)

**优先级 A · 题意**

在无重复值的旋转升序数组中找最小值。

**从直接思路到主解法**

比较 mid 与 right：mid 更大说明最小值在右半且不含 mid；否则最小值可能就是 mid，保留它。

**手推例子**

[3,4,5,1,2] 中 mid=5>2，丢弃左半；最终收敛到 1。

**正确性关键与边界**

右收缩写 right=mid，不是 mid-1；正常未旋转数组也要正确。重复值属于另一变体。

**复杂度**

时间 O(log n)；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    public int findMin(int[] nums) {
        int left = 0,right = nums.length -1;
        while(left < right){// 不能等于，等于的时候说明已经可以结束循环了
            int mid = left + ((right - left) >> 1);
            if(nums[mid] > nums[right]){
                left = mid + 1;
            } else {
                // 此处不能是mid - 1，不然会漏掉一个元素
                right = mid;
            }
        }
        // 因为left取的是mid + 1,
        return nums[left];
    }
}
```


<a id="q-162"></a>

### [162. 寻找峰值](https://leetcode.cn/problems/find-peak-element/)

**优先级 B · 题意**

在相邻元素不相等的数组中返回任意严格峰值下标。

**从直接思路到主解法**

线性找峰可做；比较 nums[mid] 与 nums[mid+1]，朝上坡方向保留区间，那一侧必定有峰。

**手推例子**

[1,2,3,1]：中间上坡，向右缩到下标 2。

**正确性关键与边界**

两端外侧视为负无穷；用 left<right 确保 mid+1 有效。原笔记 compare 版本方向有误，已替换。

**复杂度**

时间 O(log n)；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    public int findPeakElement(int[] nums) {
        int left = 0, right = nums.length - 1;
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] < nums[mid + 1]) left = mid + 1;
            else right = mid;
        }
        return left;
    }
}
```


<a id="q-74"></a>

### [74. 搜索二维矩阵](https://leetcode.cn/problems/search-a-2d-matrix/) · 新增

**优先级 A · 题意**

每行有序且下一行首元素大于上一行末元素，判断目标是否存在。

**从直接思路到主解法**

该条件让按行展开的一维序列整体有序。直接二分虚拟下标，行=mid/列数，列=mid%列数，无需真的复制数组。

**手推例子**

[[1,3,5],[7,9,11]]，虚拟下标 4 对应 [1][1]=9。

**正确性关键与边界**

只有行列各自有序不够，240 就不能这样展开二分。空矩阵先返回 false。

**复杂度**

时间 O(log(mn))；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        if (matrix.length == 0 || matrix[0].length == 0) return false;
        int m = matrix.length, n = matrix[0].length;
        int left = 0, right = m * n - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            int value = matrix[mid / n][mid % n];
            if (value == target) return true;
            if (value < target) left = mid + 1;
            else right = mid - 1;
        }
        return false;
    }
}
```


<a id="q-240"></a>

### [240. 搜索二维矩阵 II](https://leetcode.cn/problems/search-a-2d-matrix-ii/)

**优先级 A · 题意**

矩阵各行各列升序，但不保证跨行整体有序，查找目标。

**从直接思路到主解法**

逐行二分能做；右上角每次比较可排除整行或整列，比它小就左移，比它大就下移。

**手推例子**

[[1,4],[2,5]] 展平为 [1,4,2,5] 并不有序，不能套第 74 题整体二分。

**正确性关键与边界**

右上角同时是本行最大、本列最小，才能做整行整列排除。

**复杂度**

时间 O(m+n)；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int m = matrix.length,n = matrix[0].length;
        int x = 0,y = n -1;
        while(x < m && y >= 0){
            if(matrix[x][y] == target){
                return true;
            } else if(matrix[x][y] > target){
                y--;
            } else {
                x++;
            }
        }
        return false;
    }
}
```


<a id="q-4"></a>

### [4. 寻找两个正序数组的中位数](https://leetcode.cn/problems/median-of-two-sorted-arrays/)

**优先级 C · 题意**

求两个有序数组合并后的中位数，要求对数时间。

**从直接思路到主解法**

归并只走到中点可做 O(m+n)。进一步二分较短数组的切分点 i，令 j=(m+n+1)/2-i，保持左半总数固定。

**手推例子**

A=[1,3]、B=[2]；合法划分的左半为 1、2，右半为 3，中位数 2。

**正确性关键与边界**

合法条件 A左≤B右 且 B左≤A右。奇数取左侧最大，偶数取两侧边界平均；求平均先转 long。

**复杂度**

时间 O(log(min(m,n)+1))；辅助空间 O(1)；两个数组不能同时为空。

**Java 主实现**

```java
class Solution {
    public double findMedianSortedArrays(int[] a, int[] b) {
        if (a.length > b.length) return findMedianSortedArrays(b, a);
        int m = a.length, n = b.length, left = 0, right = m;
        while (left <= right) {
            int i = left + (right - left) / 2, j = (m + n + 1) / 2 - i;
            int al = i == 0 ? Integer.MIN_VALUE : a[i - 1];
            int ar = i == m ? Integer.MAX_VALUE : a[i];
            int bl = j == 0 ? Integer.MIN_VALUE : b[j - 1];
            int br = j == n ? Integer.MAX_VALUE : b[j];
            if (al <= br && bl <= ar) {
                int lower = Math.max(al, bl);
                if ((m + n) % 2 == 1) return lower;
                return ((long) lower + Math.min(ar, br)) / 2.0;
            }
            if (al > br) right = i - 1;
            else left = i + 1;
        }
        throw new IllegalArgumentException("invalid arrays");
    }
}
```


<a id="chapter-04"></a>

## 04 链表

链表题最容易错在“改完 next 后找不到后续节点”。先命名节点的角色，再写连接顺序。每次处理一段，至少明确：段前节点、段头、段尾、段后节点。

| 常见组件 | 作用 | 先练的题 |
| --- | --- | --- |
| dummy | 统一删头、换头、插入头部 | 21、19、24 |
| 快慢间距 | 相隔 k 步定位倒数节点 | Offer 22、19 |
| 快慢速度 | 找中点或检测环 | 141、142、143 |
| 反转 | 保存 next，再改向，再推进 | 92、25、234 |
| 合并 | 比较两个候选头 | 21、23、148 |

循环不变量可以这样讲：“pre 指向已经反转好的部分，cur 指向还没有处理的部分；我先保存 cur.next，因此改向不会丢失未处理链表。”不要把“会用指针”当成正确性说明。

**本章题目**

[21](#q-21) · [2](#q-2) · [24](#q-24) · [Offer 22](#q-offer22) · [19](#q-19) · [92](#q-92) · [25](#q-25) · [141](#q-141) · [142](#q-142) · [160](#q-160) · [143](#q-143) · [234](#q-234) · [82](#q-82) · [138](#q-138) · [23](#q-23) · [148](#q-148) · [287](#q-287)


<a id="q-21"></a>

### [21. 合并两个有序链表](https://leetcode.cn/problems/merge-two-sorted-lists/)

**优先级 A · 题意**

合并两个升序链表，复用节点。

**从直接思路到主解法**

反复从两个头中取较小者接到结果尾部；一侧为空后直接挂上另一侧。

**手推例子**

1→3 与 2→4 → 1→2→3→4。

**正确性关键与边界**

已合并前缀始终有序，两个头是剩余部分最小值。dummy 是固定入口，tail 是移动的尾指针。

**复杂度**

时间 O(m+n)；迭代辅助空间 O(1)，递归版栈最坏 O(m+n)。

**Java 主实现**

```java
class Solution {
    public ListNode mergeTwoLists(ListNode a, ListNode b) {
        ListNode dummy = new ListNode(0), tail = dummy;
        while (a != null && b != null) {
            if (a.val <= b.val) { tail.next = a; a = a.next; }
            else { tail.next = b; b = b.next; }
            tail = tail.next;
        }
        tail.next = a == null ? b : a;
        return dummy.next;
    }
}
```


<a id="q-2"></a>

### [2. 两数相加](https://leetcode.cn/problems/add-two-numbers/)

**优先级 A · 题意**

两个逆序数字链表相加，返回逆序结果。

**从直接思路到主解法**

先想到转整数再相加，但位数可能超过整数范围。直接模拟竖式；每轮只依赖两个当前数字和进位，短链表按 0 补齐。

**手推例子**

[9,9] + [1]：个位 10 写 0；十位 10 写 0；最后补 1，得 [0,0,1]。

**正确性关键与边界**

循环要覆盖“链表均结束但仍有进位”；用 dummy 统一第一次插入。每次写出的低位已经确定。

**复杂度**

时间 O(max(m,n))；辅助空间 O(1)，结果节点 O(max(m,n))。

**Java 主实现**

```java
class Solution {
    public ListNode addTwoNumbers(ListNode a, ListNode b) {
        ListNode dummy = new ListNode(0), tail = dummy;
        int carry = 0;
        while (a != null || b != null || carry != 0) {
            int sum = carry;
            if (a != null) { sum += a.val; a = a.next; }
            if (b != null) { sum += b.val; b = b.next; }
            tail.next = new ListNode(sum % 10);
            tail = tail.next;
            carry = sum / 10;
        }
        return dummy.next;
    }
}
```


<a id="q-24"></a>

### [24. 两两交换链表中的节点](https://leetcode.cn/problems/swap-nodes-in-pairs/)

**优先级 A · 题意**

两两交换相邻节点，不能只交换节点值。

**从直接思路到主解法**

dummy 后循环取 a、b，把三条连接改成 pre→b→a→后续，pre 移到 a。

**手推例子**

1→2→3 → 2→1→3。

**正确性关键与边界**

先保留 b.next；剩单节点不交换；dummy 解决头部替换。

**复杂度**

时间 O(n)；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    public ListNode swapPairs(ListNode head) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode temp = dummy;
        while (temp.next != null && temp.next.next != null) {
            ListNode node1 = temp.next;
            ListNode node2 = temp.next.next;
            temp.next = node2;
            node1.next = node2.next;
            node2.next = node1;
            temp = node1;
        }
        return dummy.next;
    }
}
```


<a id="q-offer22"></a>

### [剑指 Offer 22. 链表中倒数第k个节点](https://leetcode.cn/problems/lian-biao-zhong-dao-shu-di-kge-jie-dian-lcof/)

**优先级 A · 题意**

返回链表中倒数第 k 个节点。

**从直接思路到主解法**

两遍数长度能做；快指针先走 k 步，再两指针同步，快指针到 null 时慢指针即答案。

**手推例子**

1→2→3→4，k=2 返回值为 3 的节点。

**正确性关键与边界**

与删除题的区别是 slow 从 head 而非 dummy 开始，因为需要目标本身而非其前驱。默认 k 合法。

**复杂度**

时间 O(n)；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    public ListNode getKthFromEnd(ListNode head, int k) {
        ListNode slow = head;
        ListNode fast = head;
        for(int i = 0; i < k && fast != null;i++){
            fast = fast.next;
        }
        while(fast != null && slow != null){
            slow = slow.next;
            fast = fast.next;
        }
        return slow;
    }
}
```


<a id="q-19"></a>

### [19. 删除链表的倒数第 N 个结点](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/)

**优先级 A · 题意**

删除倒数第 n 个节点。

**从直接思路到主解法**

先数长度再定位是两遍。让 fast 先走 n 步，slow 从 dummy 起步，两者同速直到 fast=null，slow 停在待删前驱。

**手推例子**

1→2→3，n=3：删除头 1，dummy 让边界无需特判。

**正确性关键与边界**

返回 dummy.next；题目保证 n 合法。若改成通用 API，需先定义 n≤0 或超过链表长度的行为。

**复杂度**

时间 O(L)；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0, head);
        ListNode first = head;
        ListNode second = dummy;
        for (int i = 0; i < n; i++) {
            first = first.next;
        }
        while (first != null) {
            first = first.next;
            second = second.next;
        }
        second.next = second.next.next;
        return dummy.next;
    }
}
```


<a id="q-92"></a>

### [92. 反转链表 II](https://leetcode.cn/problems/reverse-linked-list-ii/)

**优先级 A · 题意**

仅反转第 left 到 right 个节点。

**从直接思路到主解法**

先找到反转区间之前的节点，再把区间内后续节点逐个头插到该节点之后，省去单独处理 left=1。

**手推例子**

1→2→3→4→5，left=2、right=4 → 1→4→3→2→5。

**正确性关键与边界**

cur 始终是已反转部分的尾，pre 始终在区间之前；每次先保存待搬节点。位置采用 1 起始。

**复杂度**

时间 O(n)，实际遍历到 right；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    public ListNode reverseBetween(ListNode head, int left, int right) {
        ListNode dummy = new ListNode(0, head), pre = dummy;
        for (int i = 1; i < left; i++) pre = pre.next;
        ListNode cur = pre.next;
        for (int i = 0; i < right - left; i++) {
            ListNode move = cur.next;
            cur.next = move.next;
            move.next = pre.next;
            pre.next = move;
        }
        return dummy.next;
    }
}
```


<a id="q-25"></a>

### [25. K 个一组翻转链表](https://leetcode.cn/problems/reverse-nodes-in-k-group/)

**优先级 B · 题意**

每 k 个节点反转，不足 k 个的末尾保持原样。

**从直接思路到主解法**

先把“整段反转”当子问题，再处理分组边界。每组先探测第 k 个节点，保存组后节点，反转后接回。

**手推例子**

1→2→3→4→5，k=2 → 2→1→4→3→5。

**正确性关键与边界**

不足 k 个必须在改指针前发现。固定四个角色：组前、原组头、原组尾、组后；原组头反转后变尾。

**复杂度**

时间 O(n)；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    public ListNode reverseKGroup(ListNode head, int k) {
        ListNode before = new ListNode(0);
        before.next = head;
        ListNode pre = before;
        while (head != null) {
            ListNode tail = pre;
            // 指针移动k步
            for (int i = 0; i < k; i++) {
                tail = tail.next;
                if (tail == null) {
                    return before.next;
                }
            }
            // 记录下次 分组的头节点
            ListNode nex = tail.next;
            // 分组反转链表
            ListNode[]  reverse = reverseLinked(head,tail);
            head = reverse[0];
            tail = reverse[1];
            // 重连链表
            tail.next = nex;
            pre.next = head;
            // 下次循环进入赋值
            pre = tail;
            head = tail.next;
        }
        return before.next;
    }
    private ListNode[] reverseLinked(ListNode head,ListNode tail){
        ListNode prev = tail.next;
        ListNode cur = head;
        while(prev != tail){
            // 下一个进入循环的，将是当前节点的prev节点
            ListNode nex = cur.next;
            // 当前节点连接下一个节点
            cur.next = prev;
            // 为下一次循环赋值
            prev = cur;
            cur = nex;
        }
        return new ListNode[] {tail,head};
    }
}
```


<a id="q-141"></a>

### [141. 环形链表](https://leetcode.cn/problems/linked-list-cycle/)

**优先级 A · 题意**

判断链表是否有环。

**从直接思路到主解法**

HashSet 记录访问节点是 O(n) 空间。快指针每轮两步、慢指针一步；有环时相对位置每轮前进一格，必定追上。

**手推例子**

单节点 next 指向自身返回 true；单节点 next=null 返回 false。

**正确性关键与边界**

比较节点引用；访问 fast.next.next 前先检查 fast 和 fast.next。不要在起点相同时直接判环。

**复杂度**

时间 O(n)；辅助空间 O(1)。

**Java 主实现**

```java
public class Solution {
    // 快慢指针解法
    public boolean hasCycle(ListNode head) {
        if(head == null || head.next == null){
            return false;
        }
        ListNode slow = head;
        ListNode fast = head.next;
        while (fast != slow){
            if(fast == null || fast.next == null){
                return false;
            }
            slow = slow.next;
            fast = fast.next.next;
        }
        return true;
    }
}
```


<a id="q-142"></a>

### [142. 环形链表 II](https://leetcode.cn/problems/linked-list-cycle-ii/)

**优先级 A · 题意**

找环的入口，无环返回 null。

**从直接思路到主解法**

先快慢指针判环；相遇后让一指针回头，两者等速前进，相遇处为入口。

**手推例子**

a 为头到入口距离，b 为入口到首次相遇距离，环长 L；由 2(a+b)=a+b+tL，得 a+b=tL。

**正确性关键与边界**

从相遇点再走 a 步正好回到入口。必须先检测到相遇，不能无环时直接进入第二阶段。

**复杂度**

时间 O(n)；辅助空间 O(1)。

**Java 主实现**

```java
public class Solution {
    public ListNode detectCycle(ListNode head) {
        if(head == null || head.next == null){
            return null;
        }
        ListNode slow = head;
        ListNode fast = head;
        while(fast != null){
            slow = slow.next;
            if(fast.next != null){
                fast = fast.next.next;
            } else {
                return null;
            }
            if(slow == fast){
                // 相遇后，快指针重新指向头节点
                fast = head;
                while(fast != slow){
                    fast = fast.next;
                    slow = slow.next;
                }
                return fast;
            }
        }
        return null;
    }
}
```


<a id="q-160"></a>

### [160. 相交链表](https://leetcode.cn/problems/intersection-of-two-linked-lists/)

**优先级 A · 题意**

找两个无环链表共享的第一个节点。

**从直接思路到主解法**

Set 保存 A 的节点再扫 B；进一步让两指针分别走 A+B、B+A，消掉独有前缀的长度差。

**手推例子**

A 为 a→c→d，B 为 b→x→c→d，换头后在同一个 c 节点相遇。

**正确性关键与边界**

相交看引用是否相同，不看 val；不相交时最终同时到 null。依赖两个链表无环。

**复杂度**

时间 O(m+n)；辅助空间 O(1)。

**Java 主实现**

```java
public class Solution {
    // 双指针法
    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        if(headA == null || headB == null){
            return null;
        }
        ListNode pA = headA;
        ListNode pB = headB;
        while(pA != pB){
            pA = pA == null ? headB : pA.next;
            pB = pB == null ? headA : pB.next;
        }
        return pA;
    }
}
```


<a id="q-143"></a>

### [143. 重排链表](https://leetcode.cn/problems/reorder-list/)

**优先级 B · 题意**

按首、尾、次首、次尾交替重排链表。

**从直接思路到主解法**

数组保存节点可用 O(n) 空间；原地方案拆成找中点、反转后半段、交替合并三步。

**手推例子**

1→2→3→4→5 → 1→5→2→4→3。

**正确性关键与边界**

先断开两半，避免合并后成环；合并前保存两侧 next。奇数时前半多一个节点。

**复杂度**

时间 O(n)；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    public void reorderList(ListNode head) {
        if(head == null){
            return;
        }
        // 先找到中点
        ListNode mid = findMid(head);
        ListNode l1 = head;
        ListNode l2 = mid.next;
        mid.next = null;
        // 反转右半部分链表
        l2 = reverseList(l2);
        // 合并链表
        mergeList(l1,l2);
    }
    private ListNode findMid(ListNode head){
        ListNode slow = head;
        ListNode fast = head;
        while(fast.next != null && fast.next.next != null){
            slow = slow.next;
            fast = fast.next.next;
        }
        return slow;
    }
    private ListNode reverseList(ListNode head){
        ListNode prev = null;
        ListNode curr = head;
        while(curr != null){
            ListNode nextTemp = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nextTemp;
        }
        return prev;
    }
    private void mergeList(ListNode l1,ListNode l2){
        ListNode l1Temp = null;
        ListNode l2Temp = null;
        while(l1 != null && l2 != null){
            l1Temp = l1.next;
            l2Temp = l2.next;
            l1.next = l2;
            l1 = l1Temp;
            l2.next = l1;
            l2 = l2Temp;
        }
    }
}
```


<a id="q-234"></a>

### [234. 回文链表](https://leetcode.cn/problems/palindrome-linked-list/)

**优先级 B · 题意**

判断链表值序列是否是回文。

**从直接思路到主解法**

复制到数组再双指针需要 O(n) 空间。快慢指针找中点，反转后半段后逐项比较，再恢复链表。

**手推例子**

1→2→2→1 为 true；1→2 为 false；单节点为 true。

**正确性关键与边界**

为了恢复结构，不要在发现不匹配时立即返回；记下结果后先反转回去。奇数长度中点不参与比较。

**复杂度**

时间 O(n)；辅助空间 O(1)，调用结束恢复原链表。

**Java 主实现**

```java
class Solution {
    public boolean isPalindrome(ListNode head) {
        if (head == null || head.next == null) return true;
        ListNode slow = head, fast = head;
        while (fast.next != null && fast.next.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        ListNode second = reverse(slow.next), a = head, b = second;
        boolean same = true;
        while (b != null) {
            if (a.val != b.val) same = false;
            a = a.next;
            b = b.next;
        }
        slow.next = reverse(second);
        return same;
    }
    private ListNode reverse(ListNode node) {
        ListNode pre = null;
        while (node != null) {
            ListNode next = node.next;
            node.next = pre;
            pre = node;
            node = next;
        }
        return pre;
    }
}
```


<a id="q-82"></a>

### [82. 删除排序链表中的重复元素 II](https://leetcode.cn/problems/remove-duplicates-from-sorted-list-ii/)

**优先级 B · 题意**

在有序链表中删除所有出现过重复的值，只保留独有值。

**从直接思路到主解法**

有序保证重复值连续。前驱停在最后一个确认保留节点，遇到重复就跳过整个同值段。

**手推例子**

1→2→2→3→3→4 → 1→4。

**正确性关键与边界**

不是每组保留一个的第 83 题。跳过重复组时前驱不能前进；头部重复由 dummy 处理。

**复杂度**

时间 O(n)；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    public ListNode deleteDuplicates(ListNode head) {
        if(head == null){
            return head;
        }
        ListNode dummy = new ListNode(0,head);
        ListNode curr = dummy;
        while(curr.next != null && curr.next.next != null){
            if(curr.next.val == curr.next.next.val){
                int x = curr.next.val;
                while(curr.next != null && curr.next.val == x){
                    curr.next = curr.next.next;
                }
            } else{
                curr = curr.next;
            }
        }
        return dummy.next;
    }
}
```


<a id="q-138"></a>

### [138. 复制带随机指针的链表](https://leetcode.cn/problems/copy-list-with-random-pointer/)

**优先级 B · 题意**

深拷贝带 next 和 random 的链表。

**从直接思路到主解法**

先用 Map 建旧节点到新节点映射，分两遍连边最易讲清；进一步把副本插到原节点后，用相邻关系代替 Map。

**手推例子**

A.random=B，则交织后 A′.random=A.random.next=B′。

**正确性关键与边界**

必须创建新节点，不能指向原链表；交织完成后拆分并恢复原链表。并发可见原链表时不宜这样临时修改。

**复杂度**

交织法时间 O(n)，辅助空间 O(1)，新节点输出 O(n)。

**Java 主实现**

```java
class Solution {
    public Node copyRandomList(Node head) {
        if(head == null){
            return null;
        }
        // 拷贝next节点
        for(Node node = head;node != null;node = node.next.next){
            Node newNode = new Node(node.val);
            newNode.next = node.next;
            node.next = newNode;
        }
        // 拷贝random节点
        for(Node node = head;node != null;node = node.next.next){
            Node newNode = node.next;
            newNode.random = node.random != null ? node.random.next : null;
        }
        // 把拷贝的节点从原链表上拆下来
        Node newhead = head.next;
        for(Node node = head;node != null;node = node.next){
            Node newNode = node.next;
            node.next = node.next.next;
            newNode.next = newNode.next != null ? newNode.next.next : null;
        }
        return newhead;
    }
}
```


<a id="q-23"></a>

### [23. 合并K个升序链表](https://leetcode.cn/problems/merge-k-sorted-lists/)

**优先级 A · 题意**

合并 k 条升序链表。

**从直接思路到主解法**

每轮扫描 k 个头是 O(Nk)。用小根堆管理当前可选的 k 个头，每次取最小者，再放入它的后继。

**手推例子**

[1→4,1→3,2→6]：先弹 1，再把该链表的 4 放入候选。

**正确性关键与边界**

只存每条链表的当前头，不必把所有节点都压堆；比较器用 Integer.compare，避免减法溢出。

**复杂度**

时间 O(N log(k+1))；辅助空间 O(k)，N 为总节点数。

**Java 主实现**

```java
class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        PriorityQueue<ListNode> stack = new PriorityQueue<>(Comparator.comparingInt(a -> a.val));
        for (ListNode list : lists) {
            if (list != null) {
                stack.offer(list);
            }
        }
        ListNode head = new ListNode(0);
        ListNode tail = head;
        while (!stack.isEmpty()){
            ListNode node = stack.poll();
            tail.next = node;
            tail = tail.next;
            if (node != null && node.next != null) {
                stack.offer(node.next);
            }
        }
        return head.next;
    }
}
```


<a id="q-148"></a>

### [148. 排序链表](https://leetcode.cn/problems/sort-list/)

**优先级 B · 题意**

对单链表按 O(n log n) 时间排序。

**从直接思路到主解法**

插入排序最坏 O(n²)。链表合并很自然；自顶向下归并好写但有递归栈，自底向上按 1、2、4 的段长归并可省栈。

**手推例子**

4→2→1→3：长度 1 的段两两并成 2→4、1→3，再合成完整链表。

**正确性关键与边界**

每一段先切断；保存下一组的入口；最后一组可能不足两段。不要使用依赖随机访问的数组快排思路。

**复杂度**

时间 O(n log n)；本实现辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    public  ListNode sortList(ListNode head) {
        if(head == null){
            return head;
        }
        int length = 0;
        ListNode node = head;
        while(node != null){
            length++;
            node = node.next;
        }
        ListNode dummyHead = new ListNode(0,head);
        for(int subLength = 1; subLength < length;subLength <<= 1){
            ListNode prev = dummyHead,curr = dummyHead.next;
            while(curr != null){
                ListNode head1 = curr;
                for(int i = 1;i < subLength && curr.next != null;i++){
                    curr = curr.next;
                }
                ListNode head2 = curr.next;
                curr.next = null;
                curr = head2;
                // 考虑到右边分组时，上面的curr可能已经为空
                for(int j = 1;j < subLength && curr != null && curr.next != null;j++){
                    curr = curr.next;
                }
                ListNode next = null;
                if(curr != null){
                    next = curr.next;
                    curr.next = null;
                }
                // 归并排序
                ListNode merged = merge(head1,head2);
                prev.next = merged;
                while(prev.next != null){
                    prev = prev.next;
                }
                curr = next;
            }
        }
        return dummyHead.next;
    }
    private ListNode merge(ListNode head1,ListNode head2){
        ListNode dummyHead = new ListNode(0);
        ListNode temp = dummyHead,temp1 = head1,temp2 = head2;
        while(temp1 != null && temp2 != null){
            if(temp1.val < temp2.val){
                temp.next = temp1;
                temp1 = temp1.next;
            } else{
                temp.next = temp2;
                temp2 = temp2.next;
            }
            temp = temp.next;
        }
        if(temp1 != null){
            temp.next = temp1;
        } else if(temp2 != null){
            temp.next = temp2;
        }
        return dummyHead.next;
    }
}
```


<a id="q-287"></a>

### [287. 寻找重复数](https://leetcode.cn/problems/find-the-duplicate-number/)

**优先级 B · 题意**

n+1 个数均在 1..n，恰有一个值重复；不改数组、常数空间找重复。

**从直接思路到主解法**

Set 或排序违反空间/修改约束。把下标 i 连到 nums[i]，从 0 出发形成有环的函数图；环入口就是重复值。

**手推例子**

[1,3,4,2,2]：路径 0→1→3→2→4→2，入口 2。

**正确性关键与边界**

依赖值域确保每一步是合法下标；0 不在值域，保证起点在环外。随后直接应用 142 的两阶段追赶。

**复杂度**

时间 O(n)；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    public int findDuplicate(int[] nums) {
        int slow = 0;
        int fast = 0;
        do {
            // 为啥用do while，因为，要保证0是入环外的索引
            slow = nums[slow];
            fast = nums[nums[fast]];
        }while(slow != fast);
        // 相遇后，慢指针放到头从0开始，快指针一步走一位，会在入环点相遇
        slow = 0;
        while(slow != fast){
            slow = nums[slow];
            fast = nums[fast];
        }
        return slow;
    }
}
```


<a id="chapter-05"></a>

## 05 栈与单调结构

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


<a id="chapter-06"></a>

## 06 堆与设计

堆适合“只关心最强或最弱候选”，不必维护完整排序。

| 目标 | 结构 | 堆顶/链尾意义 |
| --- | --- | --- |
| 最大的 k 个 | 大小 k 的小根堆 | 候选中最小，可被淘汰 |
| k 路升序归并 | 小根堆 | 下一项最小值 |
| 数据流中位数 | 左大根堆 + 右小根堆 | 两半边界 |
| LRU | 哈希 + 一个双向链表 | 链尾最久未使用 |
| LFU | 哈希 + 频率桶 + 桶内 LRU | 最低频桶内最久未使用 |

你有存储背景，可以用缓存经验理解 146/460，但算法代码只实现题定淘汰语义。真实缓存的并发、容量按字节计量、过期、持久化属于后续设计讨论，不能在算法题里假装已解决。

**本章题目**

[215](#q-215) · [347](#q-347) · [295](#q-295) · [146](#q-146) · [460](#q-460) · [208](#q-208)


<a id="q-215"></a>

### [215. 数组中的第K个最大元素](https://leetcode.cn/problems/kth-largest-element-in-an-array/)

**优先级 A · 题意**

找排序后倒数第 k 个元素，重复值参与排名。

**从直接思路到主解法**

排序 O(n log n) 能做；只保留最大 k 个数，用大小 k 的小根堆即可。追求平均线性时再讲随机快速选择，仅递归目标一侧。

**手推例子**

[3,2,1,5,6,4]，k=2：小根堆最终保存 5、6，堆顶 5。

**正确性关键与边界**

小根堆顶是候选中最弱的，超容量时弹它。快速选择平均 O(n)、最坏 O(n²)，并非平均 O(n log n)。

**复杂度**

本实现 O(n log(k+1)) 时间、O(k) 空间；原地大根堆建堆后取 k 次为 O(n+k log n)。

**Java 主实现**

```java
class Solution {
    public int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> heap = new PriorityQueue<>();
        for (int x : nums) {
            heap.offer(x);
            if (heap.size() > k) heap.poll();
        }
        return heap.peek();
    }
}
```


<a id="q-347"></a>

### [347. 前 K 个高频元素](https://leetcode.cn/problems/top-k-frequent-elements/)

**优先级 A · 题意**

返回出现频率最高的 k 个不同值。

**从直接思路到主解法**

先哈希计频，再对 u 个不同值使用大小 k 的小根堆；堆顶保留当前候选中最低频率。

**手推例子**

[1,1,1,2,2,3]，k=2 → [1,2]，返回顺序不限。

**正确性关键与边界**

按频次而不是数值建堆；统计阶段 O(n) 不能漏计。若要求严格线性，可按频次建桶。

**复杂度**

时间 O(n+u log(k+1))；辅助空间 O(u+k)。

**Java 主实现**

```java
class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer,Integer> map = new HashMap<Integer,Integer>();
        for(int num : nums){
            map.put(num,map.getOrDefault(num,0) + 1);
        }
        // 小根堆
        PriorityQueue<int[]> heap = new PriorityQueue<int[]>(new Comparator<int[]>() {
            public int compare(int[] m,int[] n){
                return Integer.compare(m[1], n[1]);
            }
        });
        Set<Map.Entry<Integer,Integer>> entries = map.entrySet();
        for(Map.Entry<Integer,Integer>  entry : entries ){
            int num = entry.getKey(),count = entry.getValue();
            if(heap.size() == k){
                // 堆顶数字出现次数小于当前数字出现次数，丢弃堆顶数字
                if(heap.peek()[1] < count){
                    heap.poll();
                    heap.offer(new int[]{num,count});
                }
            } else {
                // 如果还没有满足k
                heap.offer(new int[]{num,count});
            }
        }
        int[] ans = new int[k];
        for(int i = 0;i < k;i++){
            ans[i] = heap.poll()[0];
        }
        return ans;
    }
}
```


<a id="q-295"></a>

### [295. 数据流的中位数](https://leetcode.cn/problems/find-median-from-data-stream/) · 新增

**优先级 A · 题意**

数字持续到来，随时查询当前中位数。

**从直接思路到主解法**

每次排序成本高；有序数组插入也 O(n)。用大根堆保存较小一半、小根堆保存较大一半，只需维护两侧边界。

**手推例子**

依次加入 1、2 时两堆顶 1、2，中位数 1.5；再加 3，较小堆多一个，堆顶 2。

**正确性关键与边界**

保持 low.size=high.size 或多 1，且 low 所有元素≤high。求平均先转 long；不能用 a-b 构造溢出比较器。


**双堆的正确性由两条不变量组成**

1. 顺序：low 的每个值都不大于 high 的每个值。
2. 大小：low 与 high 一样大，或 low 恰好多一个。

新数先根据 low 的堆顶选择一侧。大小不平衡时，只搬运边界元素：low 最大值搬到 high，或 high 最小值搬到 low，因此顺序不会被破坏。奇数时多出的那个边界值就是中位数；偶数时取两个边界的平均。

**追问：为什么不能每次都随意把一个元素移过去？** 只能移动边界；移动较小的 low 内部元素到 high，可能让 high 里出现比 low 最大值更小的数，破坏顺序。

**追问：换成滑动窗口中位数？** 还要删除过期元素。Java PriorityQueue 按值 remove 并非 O(log n)，不能直接宣称总操作仍是对数；可考虑延迟删除和有效堆大小，或带计数的平衡树。

**复杂度**

addNum 时间 O(log n)；findMedian 时间 O(1)；空间 O(n)。

**Java 主实现**

```java
class MedianFinder {
    private final PriorityQueue<Integer> low = new PriorityQueue<>(Comparator.reverseOrder());
    private final PriorityQueue<Integer> high = new PriorityQueue<>();
    public MedianFinder() {}
    public void addNum(int num) {
        if (low.isEmpty() || num <= low.peek()) low.offer(num);
        else high.offer(num);
        if (low.size() > high.size() + 1) high.offer(low.poll());
        else if (high.size() > low.size()) low.offer(high.poll());
    }
    public double findMedian() {
        if (low.isEmpty()) throw new IllegalStateException("empty stream");
        if (low.size() > high.size()) return low.peek();
        return ((long) low.peek() + high.peek()) / 2.0;
    }
}
```


<a id="q-146"></a>

### [146. LRU 缓存](https://leetcode.cn/problems/lru-cache/)

**优先级 A · 题意**

固定容量缓存，读写均更新最近使用顺序，满时淘汰最久未使用项。

**从直接思路到主解法**

数组找 key 或移动元素是 O(n)。HashMap 找节点，双向链表 O(1) 摘除与头插；尾部就是淘汰对象。

**手推例子**

容量 2：put(1)、put(2)、get(1)、put(3)，淘汰 2。

**正确性关键与边界**

Map 与链表必须指向同一批节点；get 移动的是命中节点，不一定是尾节点。更新旧 key 不增加容量；哨兵统一边界。


**面试按三个动作讲即可**

`remove(node)` 只处理四周连接，`addToHead(node)` 只做头插，`moveToHead(node)` 复用前两者。get 命中后移动；put 旧 key 时改值并移动；put 新 key 时插入并在超容量时删尾。

为什么是双向链表？哈希找到一个节点后，单链表不知道它的前驱，摘除仍要扫描；双向链表直接访问 prev，才能保持常数时间。

**追问：线程安全怎么办？** get 也会修改链表，所以只锁 put 不够。最直接的讨论是把一次复合操作放在同一锁内，保证 Map、链表与容量一致；更细粒度方案需要额外设计，不能靠 ConcurrentHashMap 自动解决。

**复杂度**

get/put 平均 O(1)；空间 O(capacity)。

**Java 主实现**

```java
public class LRUCache {
    class DLinkedNode{
        int key;
        int value;
        DLinkedNode prev;
        DLinkedNode next;
        public DLinkedNode(){};
        public DLinkedNode(int key,int value){
            this.key = key;
            this.value = value;
        };
    }
    private Map<Integer,DLinkedNode> cache = new HashMap<Integer,DLinkedNode>();
    private int capacity;
    private int size;
    private DLinkedNode head,tail;
    public LRUCache(int capacity) {
        this.capacity = capacity;
        this.size = 0;
        // 使用伪头部和伪尾部节点
        this.head = new DLinkedNode();
        this.tail = new DLinkedNode();
        head.next = tail;
        tail.prev = head;
    }
    public int get(int key) {
        DLinkedNode node = cache.get(key);
        if(node == null){
            return -1;
        }
        // 如果存在，则移动到头节点
        moveToHead(node);
        return node.value;
    }
    public void put(int key, int value) {
        DLinkedNode node = cache.get(key);
        if(node == null){
            // 如果节点不存在，创建一个新的节点
            DLinkedNode newNode = new DLinkedNode(key,value);
            cache.put(key,newNode);
            // 放到链表头节点位置
            addToHead(newNode);
            size++;
            if(size > capacity){
                // 移除链表尾节点值
                DLinkedNode tailNode = removeTail();
                cache.remove(tailNode.key);
                size--;
            }
        }else{
            // 如果节点存在，更新值
            node.value = value;
            // 移动到头节点位置
            moveToHead(node);
        }
    }
    private void addToHead(DLinkedNode node){
        node.next = head.next;
        head.next.prev = node;
        head.next = node;
        node.prev = head;
    }
    private void moveToHead(DLinkedNode node){
        removeNode(node);
        addToHead(node);
    }
    private DLinkedNode removeTail(){
        DLinkedNode removeTail = tail.prev;
        removeNode(removeTail);
        return removeTail;
    }
    private void removeNode(DLinkedNode node){
        node.next.prev = node.prev;
        node.prev.next = node.next;
    }
}
```


<a id="q-460"></a>

### [460. LFU 缓存](https://leetcode.cn/problems/lfu-cache/)

**优先级 C · 题意**

优先淘汰访问频率最低项，同频率淘汰最久未用项。

**从直接思路到主解法**

只有 LRU 链表不够。Map 定位节点；另一个 Map 把频率映射到双向链表，每条链表维护同频率内的 LRU，再维护 minFreq。

**手推例子**

容量 2，put(1)、put(2)、get(1)、put(3)：淘汰频率 1 的 key 2。

**正确性关键与边界**

访问后迁移到 freq+1；旧最小频率桶变空时 minFreq++；插入全新项后 minFreq=1；容量 0 不插入。

**复杂度**

get/put 平均 O(1)；空间 O(capacity)，要删除空桶避免积累。

**Java 主实现**

```java
public class LFUCache {
    // 最小频率
    int minFreq;
    int capacity;
    Map<Integer,Node> keyMap;
    // key 为 频率 freq
    Map<Integer,DoubleLinkedList> freqMap;
    public LFUCache(int capacity) {
        this.capacity = capacity;
        this.minFreq = 0;
        this.keyMap = new HashMap<>();
        this.freqMap = new HashMap<>();
    }
    public int get(int key) {
        if (capacity == 0) {
            return -1;
        }
        if (!keyMap.containsKey(key)) {
            return -1;
        }
        Node node = keyMap.get(key);
        int val = node.value,freq = node.freq;
        // 删除freqMap中原来的键值对，
        freqMap.get(freq).remove(node);
        // 如果上面移除掉当前节点后，前链表为空,更新minFreq
        if (freqMap.get(freq).size == 0) {
            freqMap.remove(freq);
            if (minFreq == freq) {
                minFreq++;
            }
        }
        // 移动的新位置freq +1，插入到链表头（链表头是链表中最新使用的）
        DoubleLinkedList list = freqMap.getOrDefault(freq + 1, new DoubleLinkedList());
        list.addFirst(new Node(key,val,freq + 1));
        freqMap.put(freq + 1, list);
        // get一次 freq +1，
        keyMap.put(key, freqMap.get(freq + 1).getHead());
        return val;
    }
    public void put(int key, int value) {
        if (capacity == 0) {
            return;
        }
        // 不包含该键
        if (!keyMap.containsKey(key)) {
            // 缓存已满
            if (keyMap.size() == capacity) {
                // 移除使用频率最低的链表末尾元素
                Node node = freqMap.get(minFreq).getTail();
                keyMap.remove(node.key);
                freqMap.get(minFreq).remove(node);
                // 移除后，如果使用频率最低的链表为空，移除链表对应的键值对
                if (freqMap.get(minFreq).size == 0) {
                    freqMap.remove(minFreq);
                }
            }
            DoubleLinkedList list = freqMap.getOrDefault(1, new DoubleLinkedList());
            list.addFirst(new Node(key,value,1));
            freqMap.put(1, list);
            keyMap.put(key, freqMap.get(1).getHead());
            minFreq = 1;
        } else {
            // 包含该键
            Node node = keyMap.get(key);
            int freq = node.freq;
            // 删除freqMap中原来的键值对，
            freqMap.get(freq).remove(node);
            // 如果上面移除掉当前节点后，前链表为空,更新minFreq
            if (freqMap.get(freq).size == 0) {
                freqMap.remove(freq);
                if (minFreq == freq) {
                    minFreq++;
                }
            }
            // 移动的新位置freq +1，插入到链表头（链表头是链表中最新使用的）
            DoubleLinkedList list = freqMap.getOrDefault(freq + 1, new DoubleLinkedList());
            list.addFirst(new Node(key,value,freq + 1));
            freqMap.put(freq + 1, list);
            keyMap.put(key, freqMap.get(freq + 1).getHead());
        }
    }
    class Node{
        int key,value;
        // 使用频率
        int freq;
        Node prev,next;
        public Node() {
            this(-1, -1, 0);
        }
        public Node(int key, int value, int freq) {
            this.key = key;
            this.value = value;
            this.freq = freq;
        }
    }
    // 双向链表
    class DoubleLinkedList{
        Node dummyHead,dummyTail;
        int size;
        public DoubleLinkedList() {
            dummyHead = new Node();
            dummyTail = new Node();
            dummyHead.next = dummyTail;
            dummyTail.prev = dummyHead;
            size = 0;
        }
        public void addFirst(Node node) {
            Node prevHead = dummyHead.next;
            node.prev = dummyHead;
            dummyHead.next = node;
            node.next = prevHead;
            prevHead.prev = node;
            size++;
        }
        public void remove(Node node) {
            Node prev = node.prev;
            Node next = node.next;
            prev.next = next;
            next.prev = prev;
            size--;
        }
        public Node getHead() {
            return dummyHead.next;
        }
        public Node getTail() {
            return dummyTail.prev;
        }
    }
}
```


<a id="q-208"></a>

### [208. 实现 Trie (前缀树)](https://leetcode.cn/problems/implement-trie-prefix-tree/)

**优先级 B · 题意**

实现字符串插入、完整词查询、前缀查询。

**从直接思路到主解法**

哈希集合擅长完整匹配，但前缀查询需额外处理。Trie 沿字符逐层走，相同前缀共享节点，终止标记区分词和前缀。

**手推例子**

插入 apple 后 search(app)=false、startsWith(app)=true；再插入 app 后 search(app)=true。

**正确性关键与边界**

节点存在不代表完整单词；代码假设小写 a..z。字符集更广时可用 Map 表示孩子。

**复杂度**

每次操作 O(L)；空间 O(总插入字符数)，固定 26 分支有额外常数。

**Java 主实现**

```java
class Trie {
    Trie[] nexts;
    boolean isEnd;
    public Trie() {
        nexts = new Trie[26];
        isEnd = false;
    }
    public void insert(String word) {
        if(word == null){
            return;
        }
        // 根节点
        Trie node = this;
        // 遍历单词字符
        for(int i = 0; i < word.length();i++){
            int index = word.charAt(i) - 'a';
            // 如果没有该单词分支，新建
            if(node.nexts[index] == null){
                node.nexts[index] = new Trie();
            }
            // 有单词
            node = node.nexts[index];
        }
        // 有单词以这个字符结尾
        node.isEnd = true;
    }
    public boolean search(String word) {
        Trie node = searchPrefix(word);
        return node != null && node.isEnd;
    }
    public boolean startsWith(String prefix) {
        return searchPrefix(prefix) != null;
    }
    private Trie searchPrefix(String prefix) {
        if(prefix == null){
            return null;
        }
        Trie node = this;
        // 查询是否有该单词对应分支
        for(int i = 0; i < prefix.length();i++){
            int index = prefix.charAt(i) - 'a';
            // 如果没有该单词分支
            if(node.nexts[index] == null){
                return null;
            }
            node = node.nexts[index];
        }
        return node;
    }
}
```


<a id="chapter-07"></a>

## 07 树

每写一个递归函数，先用一句话说清“它返回什么”。不要把所有树题都写成一个全局变量加 DFS。

| 返回语义 | 代表题 | 需要向上传递的内容 |
| --- | --- | --- |
| 子树是否满足条件 | 98、101 | 布尔值，或区间约束 |
| 子树向父节点提供什么 | 124、543 | 单支贡献或高度 |
| 在子树找到了什么 | 236 | 目标节点/祖先/null |
| 构造好的子树 | 105、108 | 子树根引用 |
| 某选择下的最优值 | 337 | 选、不选两种收益 |

`O(h)` 递归空间只有在平衡树上才是 `O(log n)`；退化成链时是 `O(n)`。层序队列是 `O(w)`，w 是实际节点数意义的最大层宽，不是 662 把空洞算进去的位置跨度。

**本章题目**

[101](#q-101) · [103](#q-103) · [199](#q-199) · [112](#q-112) · [113](#q-113) · [129](#q-129) · [543](#q-543) · [124](#q-124) · [236](#q-236) · [98](#q-98) · [108](#q-108) · [230](#q-230) · [Offer 54](#q-offer54) · [105](#q-105) · [662](#q-662) · [958](#q-958) · [297](#q-297) · [114](#q-114) · [Offer 36](#q-offer36) · [538](#q-538)


<a id="q-101"></a>

### [101. 对称二叉树](https://leetcode.cn/problems/symmetric-tree/)

**优先级 A · 题意**

判断左右子树是否互为镜像。

**从直接思路到主解法**

递归比较一对节点：值相同，且左的左对右的右、左的右对右的左。

**手推例子**

[1,2,2,null,3,null,3] 非对称，值相同不代表结构相同。

**正确性关键与边界**

两者皆 null 为真，只有一者 null 为假；不能分别判断两棵子树各自是否对称。

**复杂度**

时间 O(n)；辅助空间 O(h)。

**Java 主实现**

```java
class Solution {
    public boolean isSymmetric(TreeNode root) {
        if(root == null){
            return true;
        }
        return check(root.left,root.right);
    }
    private boolean check(TreeNode q,TreeNode p){
        if(q == null && p == null){
            return true;
        }
        if(q == null || p == null){
            return false;
        }
        return q.val == p.val && check(q.left,p.right) && check(q.right,p.left);
    }
}
```


<a id="q-103"></a>

### [103. 二叉树的锯齿形层序遍历](https://leetcode.cn/problems/binary-tree-zigzag-level-order-traversal/)

**优先级 A · 题意**

逐层输出二叉树，相邻层方向相反。

**从直接思路到主解法**

先掌握 BFS 的固定层大小，再改变这一层结果的放入方向；节点入队仍按左、右顺序。

**手推例子**

[1,2,3,4,5] → [[1],[3,2],[4,5]]。

**正确性关键与边界**

不要同时反转节点入队顺序和结果顺序。每轮开始保存 size，避免把下一层当本层。

**复杂度**

时间 O(n)；辅助空间 O(w)，结果 O(n)，w 为最大实际层节点数。

**Java 主实现**

```java
class Solution {
    public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
        List<List<Integer>> ans = new LinkedList<List<Integer>>();
        if (root == null) {
            return ans;
        }
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        boolean isLeft = true;
        while (!queue.isEmpty()){
            LinkedList<Integer> levelAns = new LinkedList<>();
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                TreeNode cur = queue.poll();
                if (isLeft) {
                    levelAns.addLast(cur.val);
                } else {
                    levelAns.addFirst(cur.val);
                }
                if (cur.left != null) {
                    queue.add(cur.left);
                }
                if (cur.right != null) {
                    queue.add(cur.right);
                }
            }
            ans.add(levelAns);
            isLeft = !isLeft;
        }
        return ans;
    }
}
```


<a id="q-199"></a>

### [199. 二叉树的右视图](https://leetcode.cn/problems/binary-tree-right-side-view/)

**优先级 A · 题意**

输出从右侧能看到的每层第一个节点。

**从直接思路到主解法**

BFS 取每层最右节点；也可 DFS 按根、右、左访问，只记录某深度第一次出现的节点。

**手推例子**

[1,2,3,null,5] → [1,3,5]，不能只顺着 right 指针走。

**正确性关键与边界**

右子树缺失时左子树仍可能出现在右视图。本实现按右、左入队，所以取每层第一个节点。

**复杂度**

时间 O(n)；BFS 辅助空间 O(w)。

**Java 主实现**

```java
class Solution {
    public List<Integer> rightSideView(TreeNode root) {
        List<Integer> ans = new ArrayList<Integer>();
        if(root == null){
            return ans;
        }
        LinkedList<TreeNode> queue = new LinkedList<TreeNode>();
        queue.add(root);
        while(!queue.isEmpty()){
            int size = queue.size();
            for(int i = 0;i < size;i++){
                TreeNode cur = queue.poll();
                // 因为是右子树先放到队列中的，所以刚好是每一层遍历到的第一个节点，即为最右侧的节点
                if(i == 0){
                    ans.add(cur.val);
                }
                if(cur.right != null){
                    queue.add(cur.right);
                }
                if(cur.left != null){
                    queue.add(cur.left);
                }
            }
        }
        return ans;
    }
}
```


<a id="q-112"></a>

### [112. 路径总和](https://leetcode.cn/problems/path-sum/)

**优先级 A · 题意**

是否存在根到叶路径，节点和为目标。

**从直接思路到主解法**

往下传剩余目标，经过节点就减去当前值；只在叶子判断是否正好用完。

**手推例子**

根 1、左叶子 2，target=1 返回 false；target=3 返回 true。

**正确性关键与边界**

空树为 false；走到 null 不代表找到一条合法路径；允许负数时不能随意按剩余和剪枝。

**复杂度**

时间 O(n)；辅助空间 O(h)。

**Java 主实现**

```java
class Solution {
    public boolean hasPathSum(TreeNode root, int targetSum) {
        if(root == null){
            return false;
        } else if(root.left == null && root.right == null){
            return targetSum == root.val;
        }
        // left right 递归
        return hasPathSum(root.left,targetSum - root.val) || hasPathSum(root.right,targetSum - root.val);
    }
}
```


<a id="q-113"></a>

### [113. 路径总和 II](https://leetcode.cn/problems/path-sum-ii/)

**优先级 B · 题意**

返回所有根到叶且和等于目标的路径。

**从直接思路到主解法**

DFS 传递剩余和并维护当前路径；走到叶子才判断，返回父节点前撤销最后一个节点。

**手推例子**

树 1→2，目标 1：没有答案，因为根 1 不是叶子。

**正确性关键与边界**

保存答案必须复制 path；节点允许负数，因此不能仅凭当前和超过目标剪枝。

**复杂度**

时间 O(n+输出总长度)；辅助空间 O(h)，输出最坏 O(n²)。

**Java 主实现**

```java
class Solution {
    List<List<Integer>>  ans = new ArrayList<>();
    List<Integer> list = new ArrayList<>();
    public List<List<Integer>> pathSum(TreeNode root, int targetSum) {
        ans = new ArrayList<>();
        list = new ArrayList<>();
        dfs(root,0,targetSum);
        return ans;
    }
    private void dfs(TreeNode root, int sum ,int targetSum){
        if(root == null){
            return;
        }
        sum += root.val;
        list.add(root.val);
        if(sum == targetSum && root.left == null && root.right == null){
            ans.add(new ArrayList<>(list));
        }
        dfs(root.left,sum,targetSum);
        dfs(root.right,sum,targetSum);
        list.remove(list.size() - 1);
    }
}
```


<a id="q-129"></a>

### [129. 求根节点到叶节点数字之和](https://leetcode.cn/problems/sum-root-to-leaf-numbers/)

**优先级 B · 题意**

把每条根到叶路径视作十进制数，求总和。

**从直接思路到主解法**

不必真的拼接字符串，往下传 prefix；到节点时 current=prefix*10+val，在叶子处计入答案。

**手推例子**

根 1、左右叶子 2 和 3：12+13=25。

**正确性关键与边界**

仅叶子结算；普通中间节点不是一个完整数字。推广到更大数据范围时改用 long。

**复杂度**

时间 O(n)；辅助空间 O(h)。

**Java 主实现**

```java
class Solution {
    public int sumNumbers(TreeNode root) {
        if(root == null){
            return 0;
        }
        // 广度优先搜索
        // 两个队列，分别用来保存结点、节点的数字值
        LinkedList<TreeNode> nodeQueue = new LinkedList<>();
        LinkedList<Integer> valueQueue = new LinkedList<>();
        nodeQueue.add(root);
        valueQueue.add(root.val);
        int sum = 0;
        while(!nodeQueue.isEmpty()){
            TreeNode node = nodeQueue.poll();
            int num = valueQueue.poll();
            TreeNode left = node.left,right = node.right;
            if(left == null && right == null){
                sum += num;
            } else {
                if(left != null){
                    nodeQueue.add(left);
                    valueQueue.add(num * 10 + left.val);
                }
                if(right != null){
                    nodeQueue.add(right);
                    valueQueue.add(num * 10 + right.val);
                }
            }
        }
        return sum;
    }
}
```


<a id="q-543"></a>

### [543. 二叉树的直径](https://leetcode.cn/problems/diameter-of-binary-tree/)

**优先级 A · 题意**

求二叉树最长路径的边数。

**从直接思路到主解法**

对每个点反复算高度是 O(n²)。一次后序遍历返回高度，同时以 leftHeight+rightHeight 更新直径。

**手推例子**

单节点直径 0；根与两个叶子构成的树直径 2。

**正确性关键与边界**

高度以节点数计算，穿过当前节点的边数恰为两侧高度之和；路径不一定经过根。

**复杂度**

时间 O(n)；辅助空间 O(h)。

**Java 主实现**

```java
class Solution {
    private int ans;
    public int diameterOfBinaryTree(TreeNode root) {
        ans = 0;
        height(root);
        return ans;
    }
    private int height(TreeNode node) {
        if (node == null) return 0;
        int left = height(node.left), right = height(node.right);
        ans = Math.max(ans, left + right);
        return Math.max(left, right) + 1;
    }
}
```


<a id="q-124"></a>

### [124. 二叉树中的最大路径和](https://leetcode.cn/problems/binary-tree-maximum-path-sum/)

**优先级 A · 题意**

求任意非空简单路径的最大节点值总和。

**从直接思路到主解法**

不能对每个节点反复扫描路径。后序遍历让孩子返回“可向父节点延伸的单支贡献”，在当前节点组合左右两支更新全局答案。

**手推例子**

[-10,9,20,null,null,15,7]：答案是 15+20+7=42，向上只能返回 20+15。

**正确性关键与边界**

返回值只能选一侧，否则到父节点会分叉；更新答案可取两侧；负贡献截为 0，答案初始为最小整数。


**把两个不同的量分开**

`gain(node)` 回答：“如果父节点要接到这个子树，我最多能提供多少和？”它只能从当前节点继续到一边。

全局候选回答：“如果完整路径在这个节点转弯，最大和是多少？”它可以使用左边和右边，两边负贡献都不选。

以节点 20、两个孩子 15 和 7 为例：局部完整路径是 `15+20+7=42`；可交给父节点 -10 的贡献只有 `20+15=35`。如果把 42 直接交给父节点，会形成三叉结构，已经不是一条路径。

**追问：全负树怎么办？** 空贡献 0 只用于“不选某一侧”，不代表整条路径允许为空。全局答案初始化最小整数，并始终包含当前节点值。

**复杂度**

时间 O(n)；辅助空间 O(h)。

**Java 主实现**

```java
class Solution {
    private int ans;
    public int maxPathSum(TreeNode root) {
        ans = Integer.MIN_VALUE;
        gain(root);
        return ans;
    }
    private int gain(TreeNode node) {
        if (node == null) return 0;
        int left = Math.max(0, gain(node.left));
        int right = Math.max(0, gain(node.right));
        ans = Math.max(ans, node.val + left + right); // 在这里转弯的完整路径
        return node.val + Math.max(left, right); // 只能向父节点提供单支
    }
}
```


<a id="q-236"></a>

### [236. 二叉树的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/)

**优先级 A · 题意**

返回两个给定节点的最近公共祖先。

**从直接思路到主解法**

可保存父指针找交点；递归更直接：左右子树分别报告是否找到目标或已经找到的祖先。

**手推例子**

根 3 的左右孩子为 5、1，查 5 和 1 返回 3；查 5 和其后代返回 5。

**正确性关键与边界**

左右都有结果，当前根是汇合点；只有一边有结果就向上传它。标准版本依赖 p、q 均存在，且比较引用。

**复杂度**

时间 O(n)；辅助空间 O(h)。

**Java 主实现**

```java
class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        // 如果root == null 或者 root == q 或者 root == p时，直接返回
        if(root == null || root == p || root == q){
            return root;
        }
        // 分别查找左右子树上是否有该节点，有的话直接返回对应节点。
        TreeNode left = lowestCommonAncestor(root.left,p,q);
        TreeNode right = lowestCommonAncestor(root.right,p,q);
        // 返回对应子树上含有的p、q
        if(left == null){
            return right;
        }
        if(right == null){
            return left;
        }
        // 如果左右子树上都找到了，说明这一层的root是它们最近的公共祖先，返回
        return root;
    }
}
```


<a id="q-98"></a>

### [98. 验证二叉搜索树](https://leetcode.cn/problems/validate-binary-search-tree/)

**优先级 A · 题意**

判断整棵树是否满足严格 BST 条件。

**从直接思路到主解法**

只比较父子不够；把祖先约束作为开区间 (lower,upper) 传递给子树，或检查中序是否严格递增。

**手推例子**

[5,1,6,null,null,3,7]：3 虽小于父 6，却在 5 的右子树，因此非法。

**正确性关键与边界**

边界用 long 容纳 int 极值；相等也不合法。递归栈不能当作 O(1)。

**复杂度**

时间 O(n)；辅助空间 O(h)。

**Java 主实现**

```java
class Solution {
    public boolean isValidBST(TreeNode root) {
        return valid(root, Long.MIN_VALUE, Long.MAX_VALUE);
    }
    private boolean valid(TreeNode node, long lower, long upper) {
        if (node == null) return true;
        if (node.val <= lower || node.val >= upper) return false;
        return valid(node.left, lower, node.val) && valid(node.right, node.val, upper);
    }
}
```


<a id="q-108"></a>

### [108. 将有序数组转换为二叉搜索树](https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/) · 新增

**优先级 A · 题意**

把严格升序数组转成高度平衡 BST。

**从直接思路到主解法**

逐项插入会退化成链表。每次选区间中点作根，左半递归成左树、右半成右树，自然同时满足有序与平衡。

**手推例子**

[-3,-1,2,4,6] 选 2 为根，两边各 2 个数；偶数长度时选左中点或右中点均可。

**正确性关键与边界**

每个递归区间长度大致减半；空区间返回 null。答案不唯一，验证时比较中序和高度平衡，而非固定树形。

**复杂度**

时间 O(n)；辅助栈 O(log n)，输出节点 O(n)。

**Java 主实现**

```java
class Solution {
    public TreeNode sortedArrayToBST(int[] nums) {
        return build(nums, 0, nums.length - 1);
    }
    private TreeNode build(int[] nums, int left, int right) {
        if (left > right) return null;
        int mid = left + (right - left) / 2;
        TreeNode root = new TreeNode(nums[mid]);
        root.left = build(nums, left, mid - 1);
        root.right = build(nums, mid + 1, right);
        return root;
    }
}
```


<a id="q-230"></a>

### [230. 二叉搜索树中第 K 小的元素](https://leetcode.cn/problems/kth-smallest-element-in-a-bst/) · 新增

**优先级 A · 题意**

返回 BST 中第 k 小元素，k 从 1 起。

**从直接思路到主解法**

完整中序数组可做但占 O(n) 空间；迭代中序用栈，只访问到第 k 个即可停止。

**手推例子**

根 3，左子树 1 的右孩子为 2，右子树为 4；k=2 返回 2。

**正确性关键与边界**

压栈并不算“访问完成”，从栈弹出时才 --k。大量动态排名查询可在平衡 BST 中维护子树大小。

**复杂度**

时间 O(h+k)，最坏 O(n)；辅助空间 O(h)。

**Java 主实现**

```java
class Solution {
    public int kthSmallest(TreeNode root, int k) {
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode cur = root;
        while (cur != null || !stack.isEmpty()) {
            while (cur != null) {
                stack.push(cur);
                cur = cur.left;
            }
            cur = stack.pop();
            if (--k == 0) return cur.val;
            cur = cur.right;
        }
        throw new IllegalArgumentException("k exceeds node count");
    }
}
```


<a id="q-offer54"></a>

### [剑指 Offer 54. 二叉搜索树的第k大节点](https://leetcode.cn/problems/er-cha-sou-suo-shu-de-di-kda-jie-dian-lcof/)

**优先级 A · 题意**

求 BST 中第 k 大节点值。

**从直接思路到主解法**

中序从小到大，反向中序从大到小；访问第 k 个时停止，不需要先生成整个排序数组。

**手推例子**

BST 根 2，左右 1、3，k=2 返回 2。

**正确性关键与边界**

顺序是右、根、左；递归回到父节点也要检查是否已经找到，避免继续遍历。与第 230 题只差方向。

**复杂度**

时间 O(h+k)，最坏 O(n)；辅助空间 O(h)。

**Java 主实现**

```java
class Solution {
    int k,res;
    public int kthLargest(TreeNode root, int k) {
        this.k = k;
        dfs(root);
        return res;
    }
    private void dfs(TreeNode root){
        if(root == null){
            return;
        }
        dfs(root.right);
        // k ==0 说明遍历结束了
        if(k == 0){
            return;
        }
        // 此时是第k大节点值
        if(--k == 0){
            res =  root.val;
        }
        dfs(root.left);
    }
}
```


<a id="q-105"></a>

### [105. 从前序与中序遍历序列构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)

**优先级 A · 题意**

由无重复值的前序、中序遍历重建二叉树。

**从直接思路到主解法**

前序首项是根，中序根的位置分开左右子树；预建值到中序下标的映射，避免每层线性查根。

**手推例子**

前序 [3,9,20,15,7]、中序 [9,3,15,20,7]：根 3，左子树大小 1。

**正确性关键与边界**

先算 leftSize，再划前序的左右区间；不切片复制数组。重复值时这套映射不再足够。

**复杂度**

时间 O(n)（哈希平均）；辅助空间 O(n)，含映射与递归栈。

**Java 主实现**

```java
class Solution {
    private Map<Integer, Integer> indexMap;
    public TreeNode buildTree(int[] preorder, int[] inorder) {
        indexMap = new HashMap<>();
        int n = inorder.length;
        // 将中序遍历结果作为key，位置作为值放到hashMap中
        for (int i = 0; i < n; i++) {
            indexMap.put(inorder[i], i);
        }
        return myBuildTree(preorder, inorder, 0, n - 1, 0, n - 1);
    }
    private TreeNode myBuildTree(int[] preorder, int[] inorder, int preorderLeft, int preorderRight, int inorderLeft, int inorderRight) {
        if (preorderLeft > preorderRight) {
            return null;
        }
        // 先序遍历的第一个节点就是根节点,获取hashmap中根节点的位置（即中序遍历根节点的位置）
        int inRootIndex = indexMap.get(preorder[preorderLeft]);
        // 计算左子树有多少节点
        int leftSize = inRootIndex - inorderLeft;
        // 建立根节点
        TreeNode root = new TreeNode(preorder[preorderLeft]);
        // 左子树 前序遍历中左子树 从preorderLeft + 1 到 preorderLeft + leftSize,中序遍历左子树 从inorderLeft 到 inRootIndex - 1
        root.left = myBuildTree(preorder, inorder, preorderLeft + 1, preorderLeft + leftSize, inorderLeft, inRootIndex - 1);
        // 右子树 前序遍历 从preorderLeft + leftSize +1 到 preorderRight 中序遍历从 inRootIndex + 1 到 inorderRight
        root.right = myBuildTree(preorder, inorder,preorderLeft + leftSize +1,preorderRight,inRootIndex + 1 ,inorderRight);
        return root;
    }
}
```


<a id="q-662"></a>

### [662. 二叉树最大宽度](https://leetcode.cn/problems/maximum-width-of-binary-tree/)

**优先级 B · 题意**

求包含中间空位的最大层宽。

**从直接思路到主解法**

普通 BFS 的 size 不包含空洞。给节点分配完全二叉树位置，层宽为末位置减首位置加 1。

**手推例子**

根的左右分支各只保留最外侧孙子，第三层有 2 个节点但宽度为 4。

**正确性关键与边界**

位置另存，不能覆盖 node.val；每层减去首位置后再生成子位置，配合 long，避免深链位置膨胀。

**复杂度**

时间 O(n)；辅助空间 O(w)。采用题目答案可用 int 表示的约束。

**Java 主实现**

```java
class Solution {
    private static class Entry {
        TreeNode node;
        long pos;
        Entry(TreeNode node, long pos) { this.node = node; this.pos = pos; }
    }
    public int widthOfBinaryTree(TreeNode root) {
        if (root == null) return 0;
        Deque<Entry> queue = new ArrayDeque<>();
        queue.offer(new Entry(root, 0));
        long ans = 0;
        while (!queue.isEmpty()) {
            int size = queue.size();
            long base = queue.peek().pos, last = 0;
            for (int i = 0; i < size; i++) {
                Entry e = queue.poll();
                long p = e.pos - base;
                last = p;
                if (e.node.left != null) queue.offer(new Entry(e.node.left, 2 * p));
                if (e.node.right != null) queue.offer(new Entry(e.node.right, 2 * p + 1));
            }
            ans = Math.max(ans, last + 1);
        }
        return (int) ans;
    }
}
```


<a id="q-958"></a>

### [958. 二叉树的完全性检验](https://leetcode.cn/problems/check-completeness-of-a-binary-tree/)

**优先级 B · 题意**

判断是否为完全二叉树。

**从直接思路到主解法**

按 BFS 顺序检查空位：首次出现缺失孩子后，后续再出现任何孩子就不合法，避免指数增长的位置编号。

**手推例子**

根仅有左孩子合法；根仅有右孩子非法。

**正确性关键与边界**

ArrayDeque 不允许加入 null；实现用 seenGap 标记缺口，只把真实节点入队。

**复杂度**

时间 O(n)；辅助空间 O(w)。

**Java 主实现**

```java
class Solution {
    public boolean isCompleteTree(TreeNode root) {
        if (root == null) return true;
        Deque<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);
        boolean seenGap = false;
        while (!queue.isEmpty()) {
            TreeNode node = queue.poll();
            if (node.left == null) seenGap = true;
            else {
                if (seenGap) return false;
                queue.offer(node.left);
            }
            if (node.right == null) seenGap = true;
            else {
                if (seenGap) return false;
                queue.offer(node.right);
            }
        }
        return true;
    }
}
```


<a id="q-297"></a>

### [297. 二叉树的序列化与反序列化](https://leetcode.cn/problems/serialize-and-deserialize-binary-tree/)

**优先级 B · 题意**

把任意二叉树编码成字符串，并能恢复同样结构。

**从直接思路到主解法**

只记录先序值会丢结构。先序输出节点值并给每个空孩子写占位符，反序列化按同一规则消费 token。

**手推例子**

根 1、左空、右 2：1,null,2,null,null,。

**正确性关键与边界**

负数、多位数需要分隔符；空节点必须占位。反序列化假设输入是本编码器生成的合法字符串。

**复杂度**

时间 O(n)（节点值位数有界）；空间 O(n)，含 token 和输出，递归栈 O(h)。

**Java 主实现**

```java
public class Codec {
    // 先序遍历递归实现
    // Encodes a tree to a single string.
    public String serialize(TreeNode root) {
        StringBuilder builder = new StringBuilder();
        preSerialize(builder,root);
        return builder.toString();
    }
    private void preSerialize(StringBuilder builder,TreeNode root){
        if (root == null) {
            builder.append("null").append(",");
        } else {
            builder.append(String.valueOf(root.val)).append(",");
            preSerialize(builder,root.left);
            preSerialize(builder,root.right);
        }
    }
    // Decodes your encoded data to tree.
    public TreeNode deserialize(String data) {
        if (data == null) {
            return null;
        }
        String[] nodes = data.split(",");
        if (nodes.length == 0) {
            return null;
        }
        LinkedList<String> queue = new LinkedList<>();
        for (String note : nodes) {
            queue.add(note);
        }
        return preDeserialize(queue);
    }
    private TreeNode preDeserialize(LinkedList<String> queue) {
        String value = queue.poll();
        if ("null".equals(value)){
            return null;
        }
        TreeNode head = new TreeNode(Integer.parseInt(value));
        head.left = preDeserialize(queue);
        head.right = preDeserialize(queue);
        return head;
    }
}
```


<a id="q-114"></a>

### [114. 二叉树展开为链表](https://leetcode.cn/problems/flatten-binary-tree-to-linked-list/)

**优先级 B · 题意**

原地把二叉树按前序顺序展开为仅使用 right 的链表。

**从直接思路到主解法**

用栈记录前序再串接可做；原地把当前右子树接到左子树的最右链末尾，再把左子树搬到右边，左指针清空。

**手推例子**

根 1，左 2、右 5；把原右子树接到左子树展开后的尾部路径后，前序不变。

**正确性关键与边界**

寻找的是左子树沿 right 能到达的末端，用于挂接；不是简单找原树前序的最后叶子。算法破坏原树。

**复杂度**

总时间 O(n)（右链扫描可摊还）；辅助空间 O(1)。

**Java 主实现**

```java
class Solution {
    public void flatten(TreeNode root) {
        TreeNode curr = root;
        while(curr != null){
            // 找到当前节点右子节点的前驱节点
            if(curr.left != null){
                TreeNode next = curr.left;
                TreeNode pre = next;
                // 找到当前节点左子树的最右节点，即为当前节点右子树的前驱节点
                while(pre.right != null){
                    pre = pre.right;
                }
                pre.right = curr.right;
                curr.right = next;
                curr.left = null;
            }
            curr = curr.right;
        }
    }
}
```


<a id="q-offer36"></a>

### [剑指 Offer 36. 二叉搜索树与双向链表](https://leetcode.cn/problems/er-cha-sou-suo-shu-yu-shuang-xiang-lian-biao-lcof/)

**优先级 B · 题意**

原地把 BST 改为有序循环双向链表。

**从直接思路到主解法**

中序遍历提供递增访问顺序；保存前驱 pre，把 pre.right 和 cur.left 连起来，结束后首尾闭环。

**手推例子**

BST 2 的左右为 1、3，结果 1⇄2⇄3，3 的后继和 1 的前驱互连。

**正确性关键与边界**

这是破坏原树结构的转换；原文 head.tail 应为 head.left。每次调用重置 pre、head。

**复杂度**

时间 O(n)；辅助空间 O(h)，复用原节点。

**Java 主实现**

```java
class Solution {
    Node pre,head;
    public Node treeToDoublyList(Node root) {
        pre = null;
        head = null;
        if(root == null){
            return null;
        }
        dfs(root);
        head.left = pre;
        pre.right = head;
        return head;
    }
    private void dfs(Node cur){
        if(cur == null){
            return;
        }
        dfs(cur.left);
        if(pre == null) {
            head = cur;
        } else{
            pre.right = cur;
        }
        cur.left = pre;
        pre = cur;
        dfs(cur.right);
    }
}
```


<a id="q-538"></a>

### [538. 把二叉搜索树转换为累加树](https://leetcode.cn/problems/convert-bst-to-greater-tree/)

**优先级 B · 题意**

将 BST 每个节点改成原树中大于等于它的值之和。

**从直接思路到主解法**

对每个节点扫描更大值会重复。反向中序从大到小访问，用累计和更新当前值。

**手推例子**

BST 2，左右 1、3：新值分别为根 5、左 6、右 3。

**正确性关键与边界**

先访问右子树，再累计原当前值，再改写，最后访问左；每次独立调用重置 sum。

**复杂度**

时间 O(n)；辅助空间 O(h)，修改输入树。

**Java 主实现**

```java
class Solution {
    private int sum;
    public TreeNode convertBST(TreeNode root) {
        sum = 0;
        dfs(root);
        return root;
    }
    private void dfs(TreeNode node) {
        if (node == null) return;
        dfs(node.right);
        sum += node.val;
        node.val = sum;
        dfs(node.left);
    }
}
```


<a id="chapter-08"></a>

## 08 图与搜索

先定义图的顶点和边：网格每个格子是顶点、四邻接是边；课程是顶点、先修关系是有向边；变量是顶点、比值是带权边。

| 需求 | 搜索策略 | 标记何时生效 |
| --- | --- | --- |
| 整块连通性 | DFS 或 BFS | 进入/入队时永久标记 |
| 无权最短步数、同步扩散 | BFS | 首次入队即确定最短层数 |
| 有向依赖能否完成 | 拓扑排序 | 入度归零才入队 |
| 路径内不可重复的枚举 | 回溯 | 进入标记，退出恢复 |

994 的“所有初始源一起入队”是多源 BFS 的核心。不是分别搜索每个源再把时间相加，因为所有源在同一时刻开始扩散。

**本章题目**

[200](#q-200) · [695](#q-695) · [994](#q-994) · [207](#q-207) · [399](#q-399)


<a id="q-200"></a>

### [200. 岛屿数量](https://leetcode.cn/problems/number-of-islands/)

**优先级 A · 题意**

求四方向相连的陆地连通块数量。

**从直接思路到主解法**

遇到未访问陆地才计一个岛，再一次 DFS/BFS 标记整块；不能把每次递归进入都算新岛。

**手推例子**

[[1,0],[0,1]] 有 2 个岛，因为对角线不连通。

**正确性关键与边界**

标记必须在递归前或入队时做；修改为水会改变输入，需要保留原图则使用 visited。

**复杂度**

时间 O(mn)；DFS 最坏辅助空间 O(mn)，不能忽略递归栈。

**Java 主实现**

```java
class Solution {
    // 深度搜索实现
    public int numIslands(char[][] grid) {
        if(grid == null || grid.length == 0){
            return 0;
        }
        int vn = grid.length;
        int ln = grid[0].length;
        int num_Islands = 0;
        for(int v = 0 ; v < vn ;v++){
            for(int l = 0; l < ln ; l++){
                if(grid[v][l] == '1'){
                    num_Islands++;
                    dfs(grid,v,l);
                }
            }
        }
        return num_Islands;
    }
    private void dfs(char[][] grid,int v,int l){
        int vn = grid.length;
        int ln = grid[0].length;
        if(l < 0 || v < 0 || l >= ln || v >= vn || grid[v][l] == '0'){
            return;
        }
        grid[v][l] = '0';
        dfs(grid,v - 1,l);
        dfs(grid,v + 1,l);
        dfs(grid,v,l - 1);
        dfs(grid,v,l + 1);
    }
}
```


<a id="q-695"></a>

### [695. 岛屿的最大面积](https://leetcode.cn/problems/max-area-of-island/)

**优先级 A · 题意**

求四方向连通陆地的最大格子数。

**从直接思路到主解法**

沿用岛屿搜索，但每次 DFS 返回当前连通块的面积，所有起点取最大。

**手推例子**

[[1,1,0],[0,1,1]] 连成同一块，面积 4。

**正确性关键与边界**

先标记再递归，否则相邻格互相调用；与 200 的区别只是连通块聚合目标，不是搜索方式。

**复杂度**

时间 O(mn)；最坏辅助空间 O(mn)，修改输入。

**Java 主实现**

```java
class Solution {
    public int maxAreaOfIsland(int[][] grid) {
        int m = grid.length,n = grid[0].length;
        int maxArea = 0;
        for(int i = 0;i < m ; i++){
            for(int j = 0; j < n;j++){
                if(grid[i][j] == 1){
                    maxArea = Math.max(maxArea,getArea(grid,i,j));
                }
            }
        }
        return maxArea;
    }
    private int getArea(int[][] grid,int i,int j){
        if(i < 0 || i > grid.length -1 || j < 0 || j > grid[0].length -1 || grid[i][j] != 1){
            return 0;
        }
        // 修改为0，避免重复访问
        grid[i][j] = 0;
        // 当前为1，则加1，然后继续访问相邻四个方向
        return 1+ getArea(grid,i,j + 1) + getArea(grid,i,j -1) + getArea(grid,i + 1,j) + getArea(grid,i - 1,j);
    }
}
```


<a id="q-994"></a>

### [994. 腐烂的橘子](https://leetcode.cn/problems/rotting-oranges/) · 新增

**优先级 A · 题意**

多个腐烂橘子同时四方向传播，求全腐烂所需分钟数。

**从直接思路到主解法**

每分钟重扫全图会反复处理旧状态。把所有初始腐烂点一起入队，BFS 每层就是一分钟，另记新鲜数量。

**手推例子**

[[2,1,1]]：第 0 分钟源在左端，第 1 分钟中间腐烂，第 2 分钟最右腐烂，答案 2。

**正确性关键与边界**

入队就改成 2 并 fresh--，避免重复感染；每轮固定 size，不能让本分钟刚感染的节点在同分钟继续传播。


**用时间层解释多源 BFS**

对于 `[[2,1,1],[1,1,0],[0,1,1]]`，各位置首次腐烂时间是：

| 行 / 列 | 0 | 1 | 2 |
| --- | --- | --- | --- |
| 0 | 0 | 1 | 2 |
| 1 | 1 | 2 | 空地 |
| 2 | 空地 | 3 | 4 |

队列最初是所有时间 0 的点；第一轮只处理这些点，加入时间 1 的点；下一轮再处理时间 1。固定层大小就是把“同步一分钟”翻译成代码。

**追问：为什么 DFS 不直接合适？** DFS 先走深路，首次访问不保证最早到达时间；BFS 按距离递增，首次感染即最早时间。若改用 DFS 反复松弛，状态和复杂度都会不同。

**复杂度**

时间 O(mn)；辅助空间 O(mn)，修改输入；初始无新鲜橘子返回 0。

**Java 主实现**

```java
class Solution {
    public int orangesRotting(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        Deque<int[]> queue = new ArrayDeque<>();
        int fresh = 0;
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                if (grid[r][c] == 2) queue.offer(new int[]{r, c});
                else if (grid[r][c] == 1) fresh++;
            }
        }
        int minutes = 0;
        int[][] dirs = {
                         {1,0},{-1,0},{0,1},{0,-1}
                         };
        while (fresh > 0 && !queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                int[] cell = queue.poll();
                for (int[] d : dirs) {
                    int r = cell[0] + d[0], c = cell[1] + d[1];
                    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] != 1) continue;
                    grid[r][c] = 2; // 入队即标记，避免重复感染
                    fresh--;
                    queue.offer(new int[]{r, c});
                }
            }
            minutes++;
        }
        return fresh == 0 ? minutes : -1;
    }
}
```


<a id="q-207"></a>

### [207. 课程表](https://leetcode.cn/problems/course-schedule/)

**优先级 A · 题意**

课程先修依赖能否全部完成。

**从直接思路到主解法**

把依赖建有向图，入度为 0 的课可先学；每学一门删出边，新的入度 0 节点入队。

**手推例子**

依赖 0→1→2 可以完成；0→1→0 无入度 0 起点，存在环。

**正确性关键与边界**

输入 [a,b] 意味 b→a。已处理节点数等于总课程数才成功，别忽略独立节点。

**复杂度**

时间 O(V+E)；辅助空间 O(V+E)。

**Java 主实现**

```java
class Solution {
    List<List<Integer>> edges;
    int[] indeg;
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        edges = new ArrayList<List<Integer>>();
        // 创建存放numCourses门课程的集合
        for(int i = 0;i < numCourses;i++){
            edges.add(new ArrayList<Integer>());
        }
        indeg = new int[numCourses];
        // 把要学的课程入边对应的出边放入上述集合中
        for(int[] info : prerequisites){
            edges.get(info[1]).add(info[0]);
            // 课程info[0] 的入边 +1
            indeg[info[0]]++;
        }
        LinkedList<Integer> queue = new LinkedList<>();
        // 把入边为 0 的课程放入队列中
        for(int i = 0;i < numCourses;i++){
            if(indeg[i] == 0){
                queue.offer(i);
            }
        }
        // 代表学过的课程
        int visited = 0;
        while(!queue.isEmpty()){
            visited++;
            // 每当学好一门课程，即移除入边u的所有出边
            int u = queue.poll();
            for(int v : edges.get(u)){
                indeg[v]--;
                // 当课程的入边为0时，说明没有必须先修的课程了，可以添加入队列
                if(indeg[v] == 0){
                    queue.offer(v);
                }
            }
        }
        return visited == numCourses;
    }
}
```


<a id="q-399"></a>

### [399. 除法求值](https://leetcode.cn/problems/evaluate-division/)

**优先级 B · 题意**

已知若干变量比值，回答两个变量的商，无法推导返回 -1。

**从直接思路到主解法**

先用带权图最易理解：a/b=v 就连 a→b 权重 v、b→a 权重 1/v，沿路径累乘。多查询再考虑带权并查集。

**手推例子**

a/b=2、b/c=3，则 a/c=6、c/a=1/6；未知 x/x 仍为 -1。

**正确性关键与边界**

并查集定义 weight[x]=x/parent[x]；路径压缩时同步乘权。把 rootX 挂 rootY 后，权重应为 value*weight[y]/weight[x]。


**从图走到带权并查集，先定义权重再记公式**

若 `weight[x]=x/parent[x]`，压缩路径 `x→p→root` 后要更新成 `x/root=(x/p)×(p/root)`，因此旧父节点必须先保存。压缩完成后 weight[x]、weight[y] 都是各自相对根的比值。

已知 `x/y=value`，若把 rootX 挂到 rootY，就需要：

`rootX/rootY = value × (y/rootY) / (x/rootX)`。

这就是 `weight[rootX]=value*weight[y]/weight[x]` 的来源。本书主代码用图 BFS 以便先讲清路径乘法；只有查询规模需要时再升级。要宣称并查集标准近常数摊还复杂度，应同时考虑按秩/大小合并和路径压缩，不能不看实现就写 O(α(n))。

**复杂度**

本实现采用图 BFS：建图 O(V+E)，Q 次查询最坏 O(Q(V+E))；空间 O(V+E)。

**Java 主实现**

```java
class Solution {
    public double[] calcEquation(List<List<String>> equations, double[] values,
    List<List<String>> queries) {
        Map<String, Map<String, Double>> graph = new HashMap<>();
        for (int i = 0; i < equations.size(); i++) {
            String a = equations.get(i).get(0), b = equations.get(i).get(1);
            graph.computeIfAbsent(a, x -> new HashMap<>()).put(b, values[i]);
            graph.computeIfAbsent(b, x -> new HashMap<>()).put(a, 1.0 / values[i]);
        }
        double[] ans = new double[queries.size()];
        for (int i = 0; i < ans.length; i++) {
            ans[i] = query(graph, queries.get(i).get(0), queries.get(i).get(1));
        }
        return ans;
    }
    private double query(Map<String, Map<String, Double>> graph, String from, String to) {
        if (!graph.containsKey(from) || !graph.containsKey(to)) return -1.0;
        Map<String, Double> product = new HashMap<>();
        Deque<String> queue = new ArrayDeque<>();
        product.put(from, 1.0);
        queue.offer(from);
        while (!queue.isEmpty()) {
            String cur = queue.poll();
            if (cur.equals(to)) return product.get(cur);
            for (Map.Entry<String, Double> edge : graph.get(cur).entrySet()) {
                String next = edge.getKey();
                if (product.containsKey(next)) continue;
                product.put(next, product.get(cur) * edge.getValue());
                queue.offer(next);
            }
        }
        return -1.0;
    }
}
```


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


<a id="chapter-10"></a>

## 10 贪心与区间

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


<a id="chapter-11"></a>

## 11 动态规划

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


<a id="chapter-12"></a>

## 12 字符串与模拟

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


<a id="chapter-13"></a>

## 13 概率与位运算

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


## 附录一：容易混淆的相邻题

| 对照 | 条件变化 | 解法随之变化 |
| --- | --- | --- |
| 74 / 240 搜索矩阵 | 全局按行有序 / 仅行列分别有序 | 虚拟一维二分 / 右上角逐行列排除 |
| 55 / 45 跳跃游戏 | 能否到达 / 最少跳数 | 最远可达范围 / 按跳数分层扩展范围 |
| 230 / Offer 54 | BST 第 k 小 / 第 k 大 | 左根右 / 右根左 |
| 3 / 76 滑动窗口 | 最大合法区间 / 最小达标区间 | 不合法时缩 / 合法时缩并记录 |
| 209 / 560 子数组和 | 正数且 ≥target 最短 / 可含负数且 =k 计数 | 滑窗 / 前缀和频数 |
| 53 / 152 | 最大和 / 最大乘积 | 一个结尾最优状态 / 最大和最小两个乘积状态 |
| 1143 / 718 | 不连续子序列 / 连续子数组 | 不匹配取左右 max / 不匹配归零 |
| 5 / 647 / 131 | 最长回文 / 回文数量 / 全部回文切分 | 中心扩展取最大 / 扩展计数 / 回文预处理+回溯 |
| 322 / 518 | 最少硬币数 / 组合数 | min+1 / 加法计数且币种外层 |
| 416 / 494 | 能否凑金额 / 凑金额方案数 | 布尔或 / 计数加法 |
| 200 / 994 / 79 | 连通块 / 同步最短扩散 / 受路径约束的匹配 | DFS 或 BFS / 多源 BFS / 标记后须撤销的回溯 |
| 543 / 124 | 最长边数 / 最大节点和 | 高度贡献 / 带负数截断的单支收益 |
| 146 / 460 | 最久未使用 / 最少使用且同频按最久未使用 | 一条 LRU 链 / 频率分桶+桶内 LRU |
| 19 / Offer 22 | 删除倒数节点 / 返回倒数节点 | 定位前驱 / 定位目标 |

## 附录二：本次重要纠正与取舍

| 原笔记中的问题或不足 | 本版处理 |
| --- | --- |
| 最长回文的状态转移文字方向颠倒 | 给出正确的由内向外依赖；主代码改中心扩展 |
| 快速选择平均复杂度写成 O(n log n) | 改为平均 O(n)、最坏 O(n²)，与排序和堆区分 |
| 相交链表的哈希思路写成存节点值 | 明确比较节点身份、保存节点引用 |
| LRU get 描述成移动尾节点 | 更正为移动命中的任意节点 |
| 最大路径和混淆向上传递与全局候选，代码夹入裸文字 | 区分单支返回与双支组合，提供可编译实现 |
| 二叉树最大宽度把位置写进 val | 独立位置对象、每层归一化与 long，不破坏原值 |
| 寻找峰值的旧 compare 版本方向错误 | 改为 mid 与 mid+1 的标准上坡二分 |
| 最大数用整数乘法比较拼接，可能溢出或循环异常 | 改为字符串拼接比较 |
| 最长重复子数组状态未强调“以当前位置结尾” | 明确后缀状态与全局取 max |
| Manacher 代码用中心而非右边界作覆盖判断 | 说明不具备所称线性保证，主线采用中心扩展 |
| 树形打家劫舍选中状态的文字漏 root.val | 补全选择当前节点的收益 |
| 正则匹配把 * 的零次分支错误绑定“不匹配” | 明确零次分支始终可尝试 |
| 戳气球把哨兵值和边界下标混淆 | 明确实际补的是值 1，选“最后戳”的气球 |
| 若干段代码缺类头、闭括号、重复调用遗留字段 | 补齐结构，重置相应入口状态，统一缩进 |
| 排序数组只有名称，没有实现 | 新增完整归并排序代码 |
| 全排列、Trie、任务调度等讲解过短或只有外链 | 补题意、推导、例子、正确性要点与复杂度 |
| 输出空间、递归空间、Java 子串成本混在一起 | 分开说明，避免误写 O(1) 或忽略字符串复制 |

其中一些旧实现是合法题目约束下可用的，只是表达、通用边界或复杂度解释不够清晰；并非所有替换都意味着原实现答案错误。比如 416 旧一维版跳过首项：对等分问题可借助互补子集解释其可行性，但与一般 0/1 背包的“处理所有元素”状态定义不一致，本版统一处理所有元素以便迁移。

## 附录三：怎样用这份笔记恢复手感

一次练习按这个顺序完成：只读题意 → 口述朴素解和优化性质 → 独立写主代码 → 用两三个边界测试 → 再读讲解对照。真正记进错题表的应是“哪条判断为什么错”，不是整段答案。

| 自测等级 | 判定标准 | 下一步 |
| --- | --- | --- |
| 0：没思路 | 不知道从哪里开始 | 看本章引导与题目推导，不先看代码 |
| 1：看懂 | 阅读后能跟上，但独立写不出 | 合上文档重新定义状态，再写一次 |
| 2：能写 | 正确实现但讲不清为何成立 | 补一段不变量/递推/排除理由 |
| 3：能面试表达 | 能解释、编码、测边界、分析复杂度 | 隔几天重做，再练相邻变体 |

每类只记少量“决策问题”：窗口为何能缩？二分丢哪半？递归返回什么？DP 状态是否必须以 i 结尾？回溯哪些状态必须撤销？单调结构删除的候选为什么永远不再有用？这些问题比背 147 段代码更能迁移到新题。

## 附录四：覆盖清单与来源

原笔记：[miauyle/myNote · 算法与数据结构/算法.md](https://github.com/miauyle/myNote/blob/master/算法与数据结构/算法.md)。以本次下载内容为重构基础，原题标题和题目链接保留；正文讲解重新组织，主代码根据清晰度和检查结果保留、修订或重写。

新增：108、230、994、131、51、35、74、295、45、763、118。1143 已存在，按你的补充要求加深讲解。本文保留原有 136 道并补齐这 11 道，**不把它另行宣称为完整 Hot 100 清单**。

| 题号 | 题目 | 章节 | 优先级 | 来源 |
| --- | --- | --- | --- | --- |
| 2 | [2. 两数相加](#q-2) | 链表 | A | 原题 |
| 3 | [3. 无重复字符的最长子串](#q-3) | 窗口与前缀 | A | 原题 |
| 4 | [4. 寻找两个正序数组的中位数](#q-4) | 二分 | C | 原题 |
| 5 | [5. 最长回文子串](#q-5) | 动态规划 | A | 原题 |
| 6 | [6. Z 字形变换](#q-6) | 字符串与模拟 | C | 原题 |
| 7 | [7. 整数反转](#q-7) | 字符串与模拟 | B | 原题 |
| 8 | [8. 字符串转换整数 (atoi)](#q-8) | 字符串与模拟 | B | 原题 |
| 10 | [10. 正则表达式匹配](#q-10) | 动态规划 | C | 原题 |
| 11 | [11. 盛最多水的容器](#q-11) | 数组与双指针 | A | 原题 |
| 14 | [14. 最长公共前缀](#q-14) | 字符串与模拟 | B | 原题 |
| 15 | [15. 三数之和](#q-15) | 数组与双指针 | A | 原题 |
| 17 | [17. 电话号码的字母组合](#q-17) | 回溯 | B | 原题 |
| 19 | [19. 删除链表的倒数第 N 个结点](#q-19) | 链表 | A | 原题 |
| 20 | [20. 有效的括号](#q-20) | 栈与单调结构 | A | 原题 |
| 21 | [21. 合并两个有序链表](#q-21) | 链表 | A | 原题 |
| 22 | [22. 括号生成](#q-22) | 回溯 | A | 原题 |
| 23 | [23. 合并K个升序链表](#q-23) | 链表 | A | 原题 |
| 24 | [24. 两两交换链表中的节点](#q-24) | 链表 | A | 原题 |
| 25 | [25. K 个一组翻转链表](#q-25) | 链表 | B | 原题 |
| 31 | [31. 下一个排列](#q-31) | 数组与双指针 | B | 原题 |
| 32 | [32. 最长有效括号](#q-32) | 栈与单调结构 | B | 原题 |
| 33 | [33. 搜索旋转排序数组](#q-33) | 二分 | A | 原题 |
| 34 | [34. 在排序数组中查找元素的第一个和最后一个位置](#q-34) | 二分 | A | 原题 |
| 35 | [35. 搜索插入位置](#q-35) | 二分 | A | 新增 |
| 39 | [39. 组合总和](#q-39) | 回溯 | A | 原题 |
| 41 | [41. 缺失的第一个正数](#q-41) | 数组与双指针 | B | 原题 |
| 42 | [42. 接雨水](#q-42) | 数组与双指针 | B | 原题 |
| 43 | [43. 字符串相乘](#q-43) | 字符串与模拟 | B | 原题 |
| 45 | [45. 跳跃游戏 II](#q-45) | 贪心与区间 | A | 新增 |
| 46 | [46. 全排列](#q-46) | 回溯 | A | 原题 |
| 48 | [48. 旋转图像](#q-48) | 数组与双指针 | B | 原题 |
| 49 | [49. 字母异位词分组](#q-49) | 数组与双指针 | A | 原题 |
| 51 | [51. N 皇后](#q-51) | 回溯 | B | 新增 |
| 53 | [53. 最大子数组和](#q-53) | 动态规划 | A | 原题 |
| 54 | [54. 螺旋矩阵](#q-54) | 数组与双指针 | B | 原题 |
| 55 | [55. 跳跃游戏](#q-55) | 贪心与区间 | A | 原题 |
| 56 | [56. 合并区间](#q-56) | 贪心与区间 | A | 原题 |
| 62 | [62. 不同路径](#q-62) | 动态规划 | A | 原题 |
| 64 | [64. 最小路径和](#q-64) | 动态规划 | A | 原题 |
| 70 | [70. 爬楼梯](#q-70) | 动态规划 | A | 原题 |
| 72 | [72. 编辑距离](#q-72) | 动态规划 | B | 原题 |
| 74 | [74. 搜索二维矩阵](#q-74) | 二分 | A | 新增 |
| 75 | [75. 颜色分类](#q-75) | 数组与双指针 | B | 原题 |
| 76 | [76. 最小覆盖子串](#q-76) | 窗口与前缀 | A | 原题 |
| 78 | [78. 子集](#q-78) | 回溯 | A | 原题 |
| 79 | [79. 单词搜索](#q-79) | 回溯 | B | 原题 |
| 82 | [82. 删除排序链表中的重复元素 II](#q-82) | 链表 | B | 原题 |
| 84 | [84. 柱状图中最大的矩形](#q-84) | 栈与单调结构 | B | 原题 |
| 85 | [85. 最大矩形](#q-85) | 栈与单调结构 | C | 原题 |
| 88 | [88. 合并两个有序数组](#q-88) | 数组与双指针 | A | 原题 |
| 92 | [92. 反转链表 II](#q-92) | 链表 | A | 原题 |
| 93 | [复原 IP 地址](#q-93) | 回溯 | B | 原题 |
| 96 | [96. 不同的二叉搜索树](#q-96) | 动态规划 | B | 原题 |
| 98 | [98. 验证二叉搜索树](#q-98) | 树 | A | 原题 |
| 101 | [101. 对称二叉树](#q-101) | 树 | A | 原题 |
| 103 | [103. 二叉树的锯齿形层序遍历](#q-103) | 树 | A | 原题 |
| 105 | [105. 从前序与中序遍历序列构造二叉树](#q-105) | 树 | A | 原题 |
| 108 | [108. 将有序数组转换为二叉搜索树](#q-108) | 树 | A | 新增 |
| 112 | [112. 路径总和](#q-112) | 树 | A | 原题 |
| 113 | [113. 路径总和 II](#q-113) | 树 | B | 原题 |
| 114 | [114. 二叉树展开为链表](#q-114) | 树 | B | 原题 |
| 118 | [118. 杨辉三角](#q-118) | 动态规划 | A | 新增 |
| 121 | [121. 买卖股票的最佳时机](#q-121) | 贪心与区间 | A | 原题 |
| 122 | [122. 买卖股票的最佳时机 II](#q-122) | 贪心与区间 | A | 原题 |
| 124 | [124. 二叉树中的最大路径和](#q-124) | 树 | A | 原题 |
| 128 | [128. 最长连续序列](#q-128) | 数组与双指针 | A | 原题 |
| 129 | [129. 求根节点到叶节点数字之和](#q-129) | 树 | B | 原题 |
| 131 | [131. 分割回文串](#q-131) | 回溯 | B | 新增 |
| 136 | [136. 只出现一次的数字](#q-136) | 概率与位运算 | A | 原题 |
| 138 | [138. 复制带随机指针的链表](#q-138) | 链表 | B | 原题 |
| 139 | [139. 单词拆分](#q-139) | 动态规划 | B | 原题 |
| 141 | [141. 环形链表](#q-141) | 链表 | A | 原题 |
| 142 | [142. 环形链表 II](#q-142) | 链表 | A | 原题 |
| 143 | [143. 重排链表](#q-143) | 链表 | B | 原题 |
| 146 | [146. LRU 缓存](#q-146) | 堆与设计 | A | 原题 |
| 148 | [148. 排序链表](#q-148) | 链表 | B | 原题 |
| 151 | [151. 颠倒字符串中的单词](#q-151) | 字符串与模拟 | B | 原题 |
| 152 | [152. 乘积最大子数组](#q-152) | 动态规划 | B | 原题 |
| 153 | [153. 寻找旋转排序数组中的最小值](#q-153) | 二分 | A | 原题 |
| 160 | [160. 相交链表](#q-160) | 链表 | A | 原题 |
| 162 | [162. 寻找峰值](#q-162) | 二分 | B | 原题 |
| 165 | [165. 比较版本号](#q-165) | 字符串与模拟 | B | 原题 |
| 169 | [169. 多数元素](#q-169) | 数组与双指针 | B | 原题 |
| 179 | [179. 最大数](#q-179) | 贪心与区间 | B | 原题 |
| 198 | [198. 打家劫舍](#q-198) | 动态规划 | A | 原题 |
| 199 | [199. 二叉树的右视图](#q-199) | 树 | A | 原题 |
| 200 | [200. 岛屿数量](#q-200) | 图与搜索 | A | 原题 |
| 207 | [207. 课程表](#q-207) | 图与搜索 | A | 原题 |
| 208 | [208. 实现 Trie (前缀树)](#q-208) | 堆与设计 | B | 原题 |
| 209 | [209. 长度最小的子数组](#q-209) | 窗口与前缀 | A | 原题 |
| 215 | [215. 数组中的第K个最大元素](#q-215) | 堆与设计 | A | 原题 |
| 221 | [221. 最大正方形](#q-221) | 动态规划 | B | 原题 |
| 224 | [224. 基本计算器](#q-224) | 栈与单调结构 | B | 原题 |
| 227 | [227. 基本计算器 II](#q-227) | 栈与单调结构 | B | 原题 |
| 230 | [230. 二叉搜索树中第 K 小的元素](#q-230) | 树 | A | 新增 |
| 232 | [232. 用栈实现队列](#q-232) | 栈与单调结构 | A | 原题 |
| 234 | [234. 回文链表](#q-234) | 链表 | B | 原题 |
| 236 | [236. 二叉树的最近公共祖先](#q-236) | 树 | A | 原题 |
| 238 | [238. 除自身以外数组的乘积](#q-238) | 窗口与前缀 | A | 原题 |
| 239 | [239. 滑动窗口最大值](#q-239) | 栈与单调结构 | A | 原题 |
| 240 | [240. 搜索二维矩阵 II](#q-240) | 二分 | A | 原题 |
| 279 | [279. 完全平方数](#q-279) | 动态规划 | B | 原题 |
| 283 | [283. 移动零](#q-283) | 数组与双指针 | A | 原题 |
| 287 | [287. 寻找重复数](#q-287) | 链表 | B | 原题 |
| 295 | [295. 数据流的中位数](#q-295) | 堆与设计 | A | 新增 |
| 297 | [297. 二叉树的序列化与反序列化](#q-297) | 树 | B | 原题 |
| 300 | [300. 最长递增子序列](#q-300) | 动态规划 | A | 原题 |
| 301 | [301. 删除无效的括号](#q-301) | 回溯 | C | 原题 |
| 309 | [309. 最佳买卖股票时机含冷冻期](#q-309) | 动态规划 | B | 原题 |
| 312 | [312. 戳气球](#q-312) | 动态规划 | C | 原题 |
| 322 | [322. 零钱兑换](#q-322) | 动态规划 | A | 原题 |
| 337 | [337. 打家劫舍 III](#q-337) | 动态规划 | B | 原题 |
| 338 | [338. 比特位计数](#q-338) | 概率与位运算 | B | 原题 |
| 347 | [347. 前 K 个高频元素](#q-347) | 堆与设计 | A | 原题 |
| 394 | [394. 字符串解码](#q-394) | 栈与单调结构 | B | 原题 |
| 399 | [399. 除法求值](#q-399) | 图与搜索 | B | 原题 |
| 402 | [402. 移掉 K 位数字](#q-402) | 栈与单调结构 | B | 原题 |
| 406 | [406. 根据身高重建队列](#q-406) | 贪心与区间 | B | 原题 |
| 416 | [416. 分割等和子集](#q-416) | 动态规划 | A | 原题 |
| 437 | [437. 路径总和 III](#q-437) | 窗口与前缀 | B | 原题 |
| 438 | [438. 找到字符串中所有字母异位词](#q-438) | 窗口与前缀 | A | 原题 |
| 448 | [448. 找到所有数组中消失的数字](#q-448) | 数组与双指针 | B | 原题 |
| 460 | [460. LFU 缓存](#q-460) | 堆与设计 | C | 原题 |
| 461 | [461. 汉明距离](#q-461) | 概率与位运算 | B | 原题 |
| 468 | [468. 验证IP地址](#q-468) | 字符串与模拟 | C | 原题 |
| 470 | [470. 用 Rand7() 实现 Rand10()](#q-470) | 概率与位运算 | C | 原题 |
| 494 | [494. 目标和](#q-494) | 动态规划 | B | 原题 |
| 498 | [498. 对角线遍历](#q-498) | 数组与双指针 | C | 原题 |
| 518 | [518. 零钱兑换 II](#q-518) | 动态规划 | B | 原题 |
| 538 | [538. 把二叉搜索树转换为累加树](#q-538) | 树 | B | 原题 |
| 543 | [543. 二叉树的直径](#q-543) | 树 | A | 原题 |
| 560 | [560. 和为 K 的子数组](#q-560) | 窗口与前缀 | A | 原题 |
| 581 | [581. 最短无序连续子数组](#q-581) | 数组与双指针 | B | 原题 |
| 621 | [621. 任务调度器](#q-621) | 贪心与区间 | B | 原题 |
| 647 | [647. 回文子串](#q-647) | 动态规划 | B | 原题 |
| 662 | [662. 二叉树最大宽度](#q-662) | 树 | B | 原题 |
| 695 | [695. 岛屿的最大面积](#q-695) | 图与搜索 | A | 原题 |
| 718 | [718. 最长重复子数组](#q-718) | 动态规划 | B | 原题 |
| 739 | [739. 每日温度](#q-739) | 栈与单调结构 | A | 原题 |
| 763 | [763. 划分字母区间](#q-763) | 贪心与区间 | A | 新增 |
| 912 | [912. 排序数组](#q-912) | 数组与双指针 | A | 原题 |
| 958 | [958. 二叉树的完全性检验](#q-958) | 树 | B | 原题 |
| 994 | [994. 腐烂的橘子](#q-994) | 图与搜索 | A | 新增 |
| 1143 | [1143. 最长公共子序列](#q-1143) | 动态规划 | A | 原题 |
| Offer 22 | [剑指 Offer 22. 链表中倒数第k个节点](#q-offer22) | 链表 | A | 原题 |
| Offer 36 | [剑指 Offer 36. 二叉搜索树与双向链表](#q-offer36) | 树 | B | 原题 |
| Offer 54 | [剑指 Offer 54. 二叉搜索树的第k大节点](#q-offer54) | 树 | A | 原题 |

## 附录五：验证记录

- **覆盖**：原笔记 136 道全部保留；新增 11 道；1143 合并增强；最终 147 个唯一题目条目与主实现。
- **编译**：147 段主代码按题隔离，补上平台提供的节点类型、导包与 rand7 桩后，使用 Java 17 编译通过。
- **运行测试**：覆盖 47 道题，含全部 11 道新增题；共通过 9,009 次断言检查。部分题使用固定随机种子的小规模输入，与暴力枚举、基础 DP 或排序结果对照；不是 9,009 道不同题。
- **重点边界**：双堆整数极值平均、峰值两端、重复值二分、负数前缀和、回文链表恢复、树宽深链编号、N 皇后布局约束、多源 BFS 不可达、空串、回溯撤销与重复调用。
- **文档结构**：检查全部内部锚点及引用、147 个 Java 代码围栏、题目唯一性和覆盖一致性；没有依赖原仓库相对图片路径。
- **范围限制**：未逐题在线提交 LeetCode；其余题目完成编译和静态整理，不等同于通过了完整运行测试。

运行测试覆盖题号：

108、230、994、131、51、35、74、295、45、763、118、3、5、7、4、215、124、662、162、179、76、300、560、416、234、92、25、958、301、399、165、912、647、437、494、146、460、438、84、85、1143、10、Offer 36、538、128、75、15。

