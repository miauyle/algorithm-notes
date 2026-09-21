---
title: 03 二分
category: 基础数据结构
description: 二分查找模板、边界语义与旋转数组。
---

<a id="chapter-03"></a>

## 03 二分

> [← 上一章](02-sliding-window-prefix.md) · [目录](../README.md) · [下一章 →](04-linked-list.md)

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



> [目录](../README.md)
