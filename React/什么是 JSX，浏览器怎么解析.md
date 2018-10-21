# 什么是 JSX (JavaScriptXML)

JSX 只是一种 Facebook 普及的标记语法，提供了一种在JavaScript中编写声明式的XML的方法，使用JSX可以提高组件的可读性，

React允许做简单的JSX语法转化，受益于 Babel/TSC 这些工具 —— 我们能够以一种更令赏心悦目的方式书写 React.createElement 调用。

## JSX 的好处

- 是原生的JavaScript；
- 程序结构更容易被直观化；
- 提供更加语义化且易懂的标签；
- 抽象了React Element的创建过程；
- 允许使用熟悉的语法来定义HTML元素树；
- 可以随时掌控HTML标签以及生成这些标签的代码；

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

React 如何知道要渲染的是组件还是 HTML 元素
额外加分点：此规则有很多例外。例如：把一个组件赋给 this.component 并且写 <this.component /> 也会起作用

