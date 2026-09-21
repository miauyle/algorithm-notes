---
title: 06 堆与设计
category: 基础数据结构
description: 堆、数据流、缓存与 Trie 设计题。
---

<a id="chapter-06"></a>

## 06 堆与设计

> [← 上一章](05-stack-monotonic.md) · [目录](../README.md) · [下一章 →](07-tree.md)

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



> [目录](../README.md)
