# UmiJS

## 介绍
umi，中文可发音为乌米，是一个可插拔的企业级 react 应用框架。
umi 以路由为基础的，支持类 next.js 的约定式路由，以及各种进阶的路由功能，并以此进行功能扩展，比如支持路由级的按需加载。
然后配以完善的插件体系，覆盖从源码到构建产物的每个生命周期，支持各种功能扩展和业务需求，目前内外部加起来已有 50+ 的插件。

umi 是蚂蚁金服的底层前端框架，已直接或间接地服务了 600+ 应用，
包括 java、node、H5 无线、离线（Hybrid）应用、纯前端 assets 应用、CMS 应用等。
他已经很好地服务了我们的内部用户，同时希望他也能服务好外部用户。

## 特性
1. 📦 开箱即用，内置 react、react-router 等
1. 🏈 类 next.js 且功能完备的路由约定，同时支持配置的路由方式
1. 🎉 完善的插件体系，覆盖从源码到构建产物的每个生命周期
1. 🚀 高性能，通过插件支持 PWA、以路由为单元的 code splitting 等
1. 💈  支持静态页面导出，适配各种环境，比如中台业务、无线业务、egg、支付宝钱包、云凤蝶等
1. 🚄 开发启动快，支持一键开启 dll 和 hard-source-webpack-plugin 等
1. 🐠 一键兼容到 IE9，基于 umi-plugin-polyfills
1. 🍁 完善的 TypeScript 支持，包括 d.ts 定义和 umi test
1. 🌴 与 dva 数据流的深入融合，支持 duck directory、model 的自动加载、code splitting 等等

## 环境准备
node 版本是 8.10 或以上
umi  版本在 2.0.0 或以上
```
node -v
v10.15.0

npm install -g umi
umi -v
2.4.4
```

## 脚手架
新建文件夹
```
umi g page index
umi g page users
```
umi g 是 umi generate 的别名，可用于快速生成 component、page、layout 等，并且可在插件里被扩展。

```
$ tree
.
└── pages
    ├── index.css
    ├── index.js
    ├── users.css
    └── users.js
```
pages 目录是页面所在的目录，umi 里约定默认情况下 pages 下所有的 js 文件即路由，
如果有 next.js 或 nuxt.js 的使用经验，应该会有点眼熟

`umi dev` 启动本地服务器

## 约定式路由
启动 umi dev 后，大家会发现 pages 下多了个 .umi 的目录。这是 umi 的临时目录，
umi 重启或者 pages 下的文件修改都会重新生成这个文件夹下的文件。

pages/index.js
```
import Link from 'umi/link';
import styles from './index.css';

export default function() {
  return (
    <div className={styles.normal}>
      <h1>Page index</h1>
      <Link to="/users">go to /users</Link>
    </div>
  );
}
```
pages/users.js
```
import router from 'umi/router';
import styles from './users.css';

export default function() {
  return (
    <div className={styles.normal}>
      <h1>Page users</h1>
      <button onClick={() => { router.goBack(); }}>go back</button>
    </div>
  );
}
```

## 部署发布
构建 `umi build` ，构建产物默认生成到 ./dist

使用 now 来做演示
```
yarn global add now
now ./dist
```

# 通过脚手架创建项目

umi 通过 create-umi 提供脚手架能力，包含：

- project，通用项目脚手架，支持选择是否启用 TypeScript，以及 umi-plugin-react 包含的功能
- ant-design-pro，仅包含 ant-design-pro 布局的脚手架，具体页面可通过 umi block 添加
- block，区块脚手架
- plugin，插件脚手架
- library，依赖（组件）库脚手架，基于 umi-plugin-library

`yarn create umi`
```
? Select the boilerplate type app
? Do you want to use typescript? Yes
```
// 选择相应模板

`yarn` 
// 安装依赖

`yarn start`
// 启动 本地开发 







































