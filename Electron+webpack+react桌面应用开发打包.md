# Electron+webpack+react桌面应用开发打包

## 前提条件
- 安装 node.js
- 安装 npm
- 安装 asar
- 下载 electron-v1.2.2win32-ia32.zip（针对windows平台）、electron-v1.2.3-darwin-x64.zip（针对IOS平台）

提供实时构建桌面应用的纯 JavaScript 环境

Electron 可以获取到定义在 package.json 中 main 文件内容（通常我们定义为 main.js），然后执行它。
通过这个文件，可以创建一个应用窗口，这个应用窗口包含一个渲染好的web界面，还可以和系统原生的GUI交互。

```
{
    "name": "elearning-market-gateway",
    "version": "1.1.3",
    "description": "electron示范",
    "main": "main.js",
    "scripts": {
        "start": "node server.js --env=dev --port=8080",
        "dev": "node server.js --env=dev",
    },
}
```
` "main": "main.js" ` 就是main.process的入口

## Electron 进程之主进程 
` main process ` 启动了一个 Electron 应用，就有一个主进程被创建了。
这条进程将负责创建出应用的GUI（也就是应用的窗口），并处理用户与这个GUI之间的交互。

## Electron 进程之渲染器进程
- renderer process
- Browser Window 模块被调用的时候，每个浏览器窗口将执行它们各自的渲染器进程（renderer process）。
渲染器进程将会处理一个真正的 Web 页面（HTML+CSS+JavaScript），将页面渲染到窗口中
- Electron 使用基于 Chrominum 的浏览器内核

## Main.js 文件
```
const { app, BrowserWindow } = require('electron')

// 保持对window对象的全局引用，如果不这么做的话，当JavaScript对象被
// 垃圾回收的时候，window对象将会自动的关闭
let win

function createWindow () {
  // 创建浏览器窗口。
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // 加载index.html文件
  win.loadFile('index.html')

  // 打开开发者工具
  win.webContents.openDevTools()

  // 当 window 被关闭，这个事件会被触发。
  win.on('closed', () => {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 与此同时，你应该删除相应的元素。
    win = null
  })
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow)

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (win === null) {
    createWindow()
  }
})

// 在这个文件中，你可以续写应用剩下主进程代码。
// 也可以拆分成几个文件，然后用 require 导入。
```
