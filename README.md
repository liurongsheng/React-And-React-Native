# React生态圈

roadhog 是基于 webpack 的封装工具，目的是简化 webpack 的配置。是比较纯粹的 webpack 封装工具。
作为一个工具，他能做的就比较有限（限于 webpack 层）。

umi 可以简单地理解为 roadhog + 路由，思路类似 next.js/nuxt.js，辅以一套插件机制，目的是通过框架的方式简化 React 开发

dva 目前是纯粹的数据流，和 umi 以及 roadhog 之间并没有相互的依赖关系，可以分开使用也可以一起使用，个人觉得 umi + dva 是比较搭的

next.js 功能相对比较简单，比如他的路由配置并不支持一些高级的用法，比如布局、嵌套路由、权限路由等等，而这些在企业级的应用中是很常见的。
相比 next.js，umi 在约定式路由的功能层面会更像 nuxt.js 一些。

now https://zeit.co/now 快速部署预览
