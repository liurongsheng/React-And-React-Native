# React官方脚手架 create-react-app

[项目地址](https://github.com/facebook/create-react-app)

npm5.2+以上
```
$ npx create-react-app my-app
$ cd my-app
$ npm start
```


## 图片无法直接加载
 
<img src="../assets/img/redAmount.png" alt="redAmount"/> 加载无效

解决方法：
```
import imgRedAmount from '../assets/img/redAmount.png';

<img src={imgRedAmount} alt="redAmount"/>
```
