# Redux 实现原理

要了解 Redux，就要从 Flux 说起。可以认为 Redux 是 Flux 思想的一种实现，Flux 思想更严格的控制了 MVC 的数据流走向

## Flux

一个 Flux 应用包含四个部分：

- Dispatcher，处理动作分发，维持 Store 之间的依赖关系
- Store，负责存储数据和处理数据相关逻辑
- Action，触发 Dispatcher
- View，视图，负责显示用户界面


## Redux 诞生

Redux 是 Flux 的一种实现，意思就是除了“单向数据流”之外，Redux 还强调三个基本原则：

- 唯一的 Store（Single Source of Truth）
- 保持状态只读（State is read-only）
- 数据改变只能通过纯函数完成（Changes are made with pure functions）

### 唯一的 Store

在 Flux 中，应用可以拥有多个 Store，但是分成多个 Store 容易造成数据冗余，数据一致性不太好处理，
而且 Store 之间可能还会有依赖，增加了应用的复杂度

所以 Redux 对这个问题的解决方法就是：整个应用只有一个 Store

### 保持状态只读

就是不能直接修改状态

如果想要修改状态，只能通过派发一个 Action 对象来完成

### 数据改变只能通过纯函数完成

这里说的纯函数就是 Reducer

按照 redux 作者 Dan 的说法：Redux = Reducer + Flux

一个 Redux 应用需要下面几部分：

- Reducers
- Store
- Actions

Store 决定了 View，然后用户的交互产生了 Action，
Reducer 根据接收到的 Action 执行任务，
从而改变 Store 中的 state，最后展示到 View 上
