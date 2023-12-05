# React大版本差异记录

## React 18

## React 17

没有引入新的功能，而是着重于改进稳定性和未来版本的准备工作

### React 17 新增内容

事件委托： 对事件系统进行了升级，采用了事件委托模式，以更好地支持异步渲染和未来的并发模式

React DOM 和 React Native 分离： React 17 将 React DOM 和 React Native 分离，这样未来的版本可以更灵活地演进

### React 17 废弃内容

## React16

Hooks 的主要目的是简化和增强 React 组件的状态管理和副作用处理，使组件的逻辑更易于复用和组合

在引入 Hooks 之前，React 主要依赖类组件来管理状态和生命周期方法。Hooks 的引入为函数组件提供了更多的功能，使得函数组件可以与类组件一样强大而灵活

### React 16 新增内容

- React 16.8 版本于 2019-02-06 发布开始引入 React Hooks, 是 React 的一个重要版本

- Fiber架构： React 16 引入了Fiber，这是一种新的协调引擎，用于实现更好的性能和渲染控制

- Error Boundaries：引入了错误边界，使得应用能够更好地处理 JavaScript 错误，防止整个组件树崩溃

- Portals： 允许将子节点渲染到 DOM 节点层次结构中的任何位置，而不仅仅是在组件的直接父级内

- 支持返回数组和字符串： render 方法支持返回数组和字符串，而不仅仅是 React 元素

### React 16 废弃内容

- 废弃 componentWillMount、componentWillReceiveProps、componentWillUpdate 生命周期方法
