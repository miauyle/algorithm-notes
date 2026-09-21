---
title: 01 数组与双指针
category: 基础数据结构
description: 数组原地操作、排序、哈希与双指针模式。
---

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


