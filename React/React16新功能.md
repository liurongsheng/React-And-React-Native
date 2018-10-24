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

## this.setState 对象返回 升级为 函数式返回 实现异步操作，提升性能

this.setState({
  list: [...this.state.list, this.state.inputValue],
	inputValue: e.target.value
})

函数返回一个对象

this.setState((prevState) => ({
	list: [...prevState.list, prevState.inputValue],
	inputValue: e.target.value
}))

因为是异步操作，这里的 e.target.value 会有问题，先给 e.target.value 存在外层

const value = e.target.value
this.setState((prevState) => ({
	list: [...prevState.list, prevState.inputValue],
	inputValue: value
}))

prevState 是修改数据之前的数据，等价this.state

## PropTypes 和 DefaultProps
父组件调用子组件，子组件接收外部的值，进行强校验，会在 console 中提示

TodoItem.propTypes = {
	content0 : PropTypes.string.isRequired,
	content1 : PropTypes.string,
	content2 : PropTypes.func,
	content3 : PropTypes.number,
}

TodoItem.DefaultProps = {
	content0 : 'hello' // 提供默认值
}

