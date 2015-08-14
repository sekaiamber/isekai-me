# 关于时间衰减算法。

## 场景说明

在制作Sekai's Secret GardeN时发现一个问题，第一个版本的搜索是十分简单的，逻辑大致如下：

1. 前端判断搜索词长度等规范，合理则编码传入。
2. 后端对番号、标题、标签、演员等字段进行模糊匹配。
3. 返回前N个。

这个逻辑存在很大问题，首先mongodb返回时默认按照_id排序，所以经常返回一个作品有大量演员并且发行时间与排序无关。

所以改进了一下搜索策略，对上面的2阶段进行重新设计，采用聚合管道如下：

1. 对番号、标题、标签、演员等字段进行模糊匹配。
2. 过滤一些字段，并加入ActressCount表示每个候选项的演员个数。
3. 按照ActressCount正序和发行时间逆序排序。

这时候返回的结果中，演员数为1的都在最上面，且按照发行时间逆序分布，然而这时候有个问题，发行时间靠前的演员数为2的影片一定会在演员数为1的所有影片之后，不管这个影片多早发行，这是不符合期望的，所以有必要引入时间衰减。

## 时间衰减

对于视频、书籍等文化产品，时间是一个很重要的重要性指标，然而这些产品和水果蔬菜不一样，并不总是越新鲜越好，也不是慢慢变得劣质，理论上这些产品拥有一个“绽放期”，也就是说从产品出产的一段时间内，都为这个产品的“黄金时段”，过了这个时间，产品的品质就会迅速下降，再过一段时间，产品的品质趋于稳定，这个稳定值应该算是产品本身的价值。

在搜索中，产品品质和最终得分息息相关。在Sekai's Secret GardeN中，产品品质受演员人数影响最大，也就是说我们可以近似看演员人数为产品本身的价值，即演员越多，品质越低劣，同时要考虑到以发行时间为衰减的函数，获得其中关系就能得到产品当前的品质，这个品质近似看做当前搜索的得分。

## 衰减函数原型

在选取时间函数时，我考虑了这么几点：

1. 首先不在乎函数定义域和值域，这些可以在后面用初等变换抵消。
2. 函数在区域无穷时需要收敛。
3. 函数值（或者其导数值）有且只有一个迅速衰减/增加的过程。
4. 计算需要足够简单（使用javascript）。

以下是我选取的几个函数用来测试。

### arccot函数

![arccot函数](http://e.hiphotos.baidu.com/baike/c0%3Dbaike92%2C5%2C5%2C92%2C30/sign=638c65147a310a55d029d6a6d62c28cc/e850352ac65c1038c7f93125b1119313b17e8956.jpg)
```
f(x) = arccot(x)
```

### 高斯函数

![高斯函数](http://d.hiphotos.baidu.com/baike/g%3D0%3Bw%3D268/sign=f83723c760d9f2d3301121e4ded1b825/810a19d8bc3eb135b039ab9da41ea8d3fd1f441d.jpg)
```
f(x) = a * e ^ ( -(x - b) ^ 2 / c ^ 2 )
```
### 半衰期

![半衰期函数](http://e.hiphotos.baidu.com/baike/g%3D0%3Bw%3D268/sign=2a149f740e3387448cc52a772632ebcf/d53f8794a4c27d1e0e2bfae019d5ad6eddc43881.jpg)
```
f(t) = M * (1/2) ^ (t/T)
```

### 对衰减函数进行处理

若要复合我们的需求，假设整个得分函数为S，品质为Q，衰减函数为f，当前时间为t，则需要满足：
```
f(t) ∈ (0, 1)
S(Q, t) = m(f(t), Q)
S(Q, t) ∈ (Q, 1)
f(0) = S(Q, 0) ≈ 1
```
这里，m为某种初等变换，例如加权或者相乘。
考虑到期望举个例子应该是这样的：

> 近期刚发行不久（例如1年之内）的3个演员的影片，也许比早发行1年的1个演员的影片要吸引人一点，然而若是很久之前（例如2年前）发行的3个演员的影片，也许还不如更久之前（例如3年前）1个演员的影片吸引人。

所以可以得到如下关系：
```
S(3, t) > S(1, t+360), t ∈ [0, 360)
S(3, t) < S(1, t+360), t > 720
```