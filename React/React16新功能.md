# React16 新功能

## Fragment 标签
在JSX语法中需要在最外层包裹一层元素，如果不想显示最外层的这个标签
在React 16 中使用 Fragment 占位符即可实现

import React, { Fragment } from 'react';

class App extends React.Component {
	render() {
		return (
			<Fragment>
				liu
			</Fragment>
		)
	}
}

## React 响应式设计思想
React 响应式框架，不要直接操作DOM，通过操作数据，React会自动感知数据变化，自动的生成DOM。只需要操作数据层。

构造函数是最优先执行的函数，构造函数的固定写法
```
constructor(props){
	super(props);
}
```

constructor(props){
	super(props);
	this.state = {
		inputValue : '',
		list : []
	}
}

原生事件钩子
onchange = this.handleChange

React中使用事件钩子
onChange = { this.handleChange }

## immutable 概念
state 不允许我们做任何的改变，如果一定要则修改拷贝的副本

handleItemDelete(index){
	const list = [...this.state.list]
	list.splice(index, 1);
	this.setState({list:list})
}

## dangerouslySetInnerHTML 不转义输入的内容
dangerouslySetInnerHTML = {{__html: item}}

## htmlFor 实现聚焦 
<label htmlFor="insertArea">输入内容</label>
<input id="insertArea" onChange={this.handleInputChange.bind(this)}/>

