---
title: 07 树
category: 基础数据结构
description: 二叉树遍历、递归语义与搜索树。
---

<a id="chapter-07"></a>

## 07 树

> [← 上一章](06-heap-design.md) · [目录](../README.md) · [下一章 →](08-graph-search.md)

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



> [目录](../README.md)
