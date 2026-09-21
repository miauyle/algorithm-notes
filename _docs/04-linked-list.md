---
title: 04 链表
category: 基础数据结构
description: 链表指针操作、反转、合并与快慢指针。
---

<a id="chapter-04"></a>

## 04 链表

> [← 上一章](03-binary-search.md) · [目录](../README.md) · [下一章 →](05-stack-monotonic.md)

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



> [目录](../README.md)
