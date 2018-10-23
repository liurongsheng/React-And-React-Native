## 脚手架

registerServiceWorker.js
PWA progressive web application 的概念
让用户只要访问一次我们的网页，就在本地会有一个缓存，即使没有网络，依然可以使网页，相当于一个App来使用

manifest.json 
如果可以当成App来使用，那么可以设置桌面快捷方式，manifest.json 文件就是设置快捷方式的配置文件，在 index.html 中有引用，不使用可以删除

如果不需要都可以删除，记得把调用也给删除即可。

脚手架中 3 个文件最重要
- public\index.html // 网页调用
- src\App.js // 负责显示内容
- src\index.js // 整个程序运行的入口

import { Component } from 'react';
等价于
import React from 'react';
const Component = React.Component;

class App exents Component {
	...
}
===
import React from 'react';
class App exents React.Component {
	...
}
===
import React { Component } from 'react';
class App exents Component {
	...
}

ReactDOM.render 把组件挂载在指定的标签中

## 什么是 JSX (JavaScriptXML)

JSX 只是一种 Facebook 普及的标记语法，提供了一种在JavaScript中编写声明式的XML的方法，使用JSX可以提高组件的可读性，

React允许做简单的JSX语法转化，受益于 Babel/TSC 这些工具 —— 我们能够以一种更令赏心悦目的方式书写 React.createElement 调用。

## JSX 的好处

- 是原生的JavaScript；
- 程序结构更容易被直观化；
- 提供更加语义化且易懂的标签；
- 抽象了React Element的创建过程；
- 允许使用熟悉的语法来定义HTML元素树；
- 可以随时掌控HTML标签以及生成这些标签的代码；


## 页面看起来没用使用 React 为什么需要 import React from 'react';
组件使用 JSX (<App />) 语法，必须引入 React

## 定义第一个组件

简单的理解组件就是对数据和方法的简单封装，目的就是模块化功能

实现
```html
<div>
	<h1>Hello World!</h1>
</div>
```

```
<!DOCTYPE html>
<html> 
	<head> 
		<title>Hello React</title> 
		<!--React核心库-->
		<script src="build/react.js"></script> 
		<!--react-dom.js提供与DOM相关功能-->
		<script src="build/react-dom.js"></script> 
		<!--browser.js将 JSX 语法转为 JavaScript 语法-->
		<script src="build/browser.min.js">/script>
	</head> 
	<body> 
		<HelloWorld>Hello World!</HelloWorld>
		<!--为了把 JSX 转成标准的 JavaScript，我们用 `<script type="text/babel">` 标签，然后通过Babel转换成在浏览器中真正执行的内容-->
		<script type="text/babel"> 
			 // 定义组件HelloWorld
			 var HelloWorld = React.createClass({
					render : function(){
						return (
							<div>
								<h1>this.props.children</h1>
							</div>
						);
					}
				})
		</script> 
	</body>
</html>
```

- React中组件名必须以大写字母开头；
- React中的组件只能包含一个顶层标签，否则会报错；
- JSX将两个花括号之间的内容{...}渲染为动态值，花括号指明了一个JavaScript上下文环境，
	它会将其中内容进行求值，然后渲染为标签中的若干节点；
- this.props.children是组件的特殊属性，保存了开始标签与结束标签之间的所有子节点，
	上例中this.props.children = ["Hello World!"]；

不使用JSX语法，写法如下：	
```
...
// 定义组件HelloWorld
var HelloWorld = React.createClass({displayName:"HelloWorld ",
	render : function(){
		return (
			 React.createElement("div",null);
			 React.createElement("h2",null,this.props.children);
			 );
	}
})
...
```

## 为什么 JSX 中的组件名要以大写字母开头

React 如何知道要渲染的是组件还是 HTML 元素，组件必须是大写开头。一般在JSX语法中，大写的标签是组件，小写的标签是 h5 标签
额外加分点：此规则有很多例外。例如：把一个组件赋给 this.component 并且写 <this.component /> 也会起作用

## 为什么用 componentDidMount 而不是 constructor 执行向 API 的数据请求

- 在渲染发生之前数据不会存在 —— 虽然不是主要原因，但它向您显示该人员了解组件的处理方式; 
- 在 React Fiber 中使用新的异步渲染

## Fiber架构

React16 以前，组件的渲染顺序

挂载阶段：
- constructor()
- componentWillMount()
- render()
- componentDidMount()

更新阶段为：
- componentWillReceiveProps()
- shouldComponentUpdate()
- componentWillUpdate()
- render()
- componentDidUpdate

<img src="./img/React16前渲染顺序.jpg" title="React16前渲染顺序" />

以render()函数为分界线。从顶层组件开始，一直往下，直至最底层子组件。然后再往上。组件update阶段同理。

存在的问题：
如果这是一个很大，层级很深的组件，react渲染它需要几十甚至几百毫秒，在这期间，react会一直占用浏览器主线程，
任何其他的操作（包括用户的点击，鼠标移动等操作）都无法执行。

一个形象的比喻：
好似一个潜水员，当它一头扎进水里，就要往最底层一直游，直到找到最底层的组件，然后他再上岸。
在这期间，岸上发生的任何事，都不能对他进行干扰，如果有更重要的事情需要他去做（如用户操作），也必须得等他上岸。

Fiber架构就是为了解决这个问题

<img src="./img/React16Fiber组件渲染顺序.jpg" title="React16Fiber组件渲染顺序" />

潜水员会每隔一段时间就上岸，看是否有更重要的事情要做。

加入fiber的react将组件更新分为两个时期
以render为分界，render前的生命周期为phase1,render后的生命周期为phase2

phase1的生命周期是可以被打断的，每隔一段时间它会跳出当前渲染进程，去确定是否有其他更重要的任务。
此过程，React 在 workingProgressTree （并不是真实的virtualDomTree）上复用 current 上的
 Fiber 数据结构来一步地（通过requestIdleCallback）来构建新的 tree，标记处需要更新的节点，放入队列中。

phase2的生命周期是不可被打断的，React 将其所有的变更一次性更新到DOM上。

这里最重要的是phase1这是时期所做的事。因此我们需要具体了解phase1的机制。

如果不被打断，那么phase1执行完会直接进入render函数，构建真实的virtualDomTree
如果组件再phase1过程中被打断，即当前组件只渲染到一半（也许是在willMount,也许是willUpdate~反正是在render之前的生命周期），

那么react会怎么干呢？ react会放弃当前组件所有干到一半的事情，去做更高优先级更重要的任务、
（当然，也可能是用户鼠标移动，或者其他react监听之外的任务），当所有高优先级任务执行完之后，
react通过callback回到之前渲染到一半的组件，从头开始渲染。（看起来放弃已经渲染完的生命周期，
会有点不合理，反而会增加渲染时长，但是react确实是这么干的）

>也就是 所有phase1的生命周期函数都可能被执行多次，因为可能会被打断重来

这样的话，就和react16版本之前有很大区别了，因为可能会被执行多次，
那么我们最好就得保证phase1的生命周期每一次执行的结果都是一样的，
否则就会有问题，因此，最好都是纯函数。

（所以react16目前都没有把fiber enable，其实react16还是以同步的方式在做组件的渲染，因为这样的话，
很多我们用老版本react写的组件就有可能都会有问题,包括用的很多开源组件，但是后面应该会enable,
让开发者可以开启fiber异步渲染模式~）

一个问题，饥饿问题，即如果高优先级的任务一直存在，那么低优先级的任务则永远无法进行，组件永远无法继续渲染。
这个问题facebook目前好像还没解决，但以后会解决~

所以，facebook在react16增加fiber结构，其实并不是为了减少组件的渲染时间，事实上也并不会减少，
最重要的是现在可以使得一些更高优先级的任务，如用户的操作能够优先执行，提高用户的体验，至少用户不会感觉到卡顿~


## 单元测试工具
karma、mocha、jasmin、jest、cypres、selenium、enzyme、react-test-library

## 优化代码
1.
```
/**
* 这个例子有什么问题，要如何修改或改进这个组件？
*/

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name || 'Anonymous'
    }
  }

  render() {
    return (
      <p>Hello {this.state.name}</p>
    );
  }
}
===
移除 state 并使用 props，实现 getDerivedStateFromProps 或者更好的方式是把该组件变为函数组件
```
2. 
```
/**
 * 这几个向组件传递函数的方式，你能解释它们的不同吗？
 *
 * 当你点击每个按钮会发生什么？
 */

class App extends React.Component {

  constructor() {
    super();
    this.name = 'MyComponent';

    this.handleClick2 = this.handleClick1.bind(this);
  }

  handleClick1() {
    alert(this.name);
  }

  handleClick3 = () => alert(this.name);

render() {
    return (
      <div>
        <button onClick={this.handleClick1()}>click 1</button>
        <button onClick={this.handleClick1}>click 2</button>
        <button onClick={this.handleClick2}>click 3</button>
        <button onClick={this.handleClick3}>click 4</button>
      </div>
    );
  }
}
===
JS 事件循环机制
```
3.
```
/**
 * 这个组件有什么问题。为什么？要如何解决呢？
 */

class App extends React.Component {

state = { search: '' }

handleChange = event => {

/**
     * 这是“防抖”函数的简单实现，它会以队列的方式在 250 ms 内调用
     * 表达式并取消所有挂起的队列表达式。以这种方式我们可以在用户停止输
     * 入时延迟 250 ms 来调用表达式。
     */
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.setState({
        search: event.target.value
      })
    }, 250);
  }

render() {
    return (
      <div>
        <input type="text" onChange={this.handleChange} />
        {this.state.search ? <p>Search for: {this.state.search}</p> : null}
      </div>
    )
  }
}
===
在防抖函数中并没有错误。那么应用会按期望方式运行吗？
它会在用户停止输入的 250 ms 之后更新并且渲染字符串“Search for: …”吗？

这里的问题是在 React 中 event 是一个 SyntheticEvent，如果和它的交互被延迟了
（例如：通过 setTimeout），事件会被清除并且 .target.value 引用不会再有效。

```