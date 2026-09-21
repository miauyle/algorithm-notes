---
title: 08 图与搜索
category: 搜索与算法范式
description: DFS、BFS、拓扑排序与图建模。
---

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


