# React Navigation

[查看HomePage](https://github.com/react-navigation/react-navigation)

[查看官方文档](https://reactnavigation.org/docs/zh-Hans/getting-started.html)

## react-native 主要构成

按照使用形式主要分为三部分

1. StackNavigator: 类似于普通的Navigator，屏幕上方导航栏
1. TabNavigator: 相当于iOS里面的TabBarController，屏幕下方的标签栏
1. DrawerNavigator: 抽屉效果，侧边滑出

### StackNavigator 导航栏

API: StackNavigator(RouteConfigs, StackNavigatorConfig)

```javascript
// 注册导航
const Navs = StackNavigator({
    Home: { screen: Tabs },
    HomeTwo: {
        screen: HomeTwo,  // 必须, 其他都是非必须
        path:'app/homeTwo', 使用url导航时用到, 如 web app 和 Deep Linking
        navigationOptions: {}  // 此处设置了, 会覆盖组件内的`static navigationOptions`设置. 具体参数详见下文
    },
    HomeThree: { screen: HomeThree },
    HomeFour: { screen: HomeFour }
}, {
    initialRouteName: 'Home', // 默认显示界面
    navigationOptions: {  // 屏幕导航的默认选项, 也可以在组件内用 static navigationOptions 设置(会覆盖此处的设置)
        header: {  // 导航栏相关设置项
            backTitle: '返回',  // 左上角返回键文字
            style: {
                backgroundColor: '#fff'
            },
            titleStyle: {
                color: 'green'
            }
        },
        cardStack: {
            gesturesEnabled: true
        }
    }, 
    mode: 'card',  // 页面切换模式, 左右是card(相当于iOS中的push效果), 上下是modal(相当于iOS中的modal效果)
    headerMode: 'screen', // 导航栏的显示模式, screen: 有渐变透明效果, float: 无透明效果, none: 隐藏导航栏
    onTransitionStart: ()=>{ console.log('导航栏切换开始'); },  // 回调
    onTransitionEnd: ()=>{ console.log('导航栏切换结束'); }  // 回调
});

```

### navigationOptions

参数:

- title: 导航栏的标题

- header: 导航栏设置对象
    - visible: 导航栏是否显示
    - title: 导航栏的标题, 可以是字符串也可以是个组件
    - backTitle: 左上角的返回键文字, 默认是上一个页面的title
    - right: 导航栏右按钮
    - left: 导航栏左按钮
    - style: 导航栏的style
    - titleStyle: 导航栏的title的style
    - tintColor: 导航栏颜色

- cardStack: 配置card stack
    - gesturesEnabled: 是否允许右滑返回，在iOS上默认为true，在Android上默认为false

在组件中设置static navigationOptions示例:

```javascript
static navigationOptions = {
    title: 'homeThree',
    header: (navigation, defaultHeader) => ({
      ...defaultHeader,  // 默认预设
      visible: true  // 覆盖预设中的此项
    }),
    cardStack: {
        gesturesEnabled: false  // 是否可以右滑返回
    }
};

// 或这样
static navigationOptions = {
    // title: 'Two', // 写死标题
    title: (navigation, childRouter) => {  // 动态标题
        if (navigation.state.params.isSelected) {
            return `${navigation.state.params.name}选中`;
        } else {
            return `${navigation.state.params.name}没选中`;
        }
    },
    header: ({ state, setParams, goBack }) => {
        let right;
        if (state.params.isSelected) {
            right = (<Button title="取消" onPress={() => setParams({ isSelected: false })}/>);
        } else {
            right = (<Button title="选择" onPress={() => setParams({ isSelected: true })}/>);
        }
        let left = (<Button title="返回" onPress={() => goBack()}/>);
        let visible = false;  // 是否显示导航栏
        return { right, left, visible };
    },
    // header: {left: <Button title="返回"/>},
};
```

### StackNavigatorConfig

参数:
- initialRouteName: 设置默认的页面组件，必须是上面已注册的页面组件
- initialRouteParams: 初始路由的参数
- navigationOptions: 屏幕导航的默认选项
- paths: RouteConfigs里面路径设置的映射

- mode: 页面切换模式:
    - card: 普通app常用的左右切换
    - modal: 上下切换
    
- headerMode: 导航栏的显示模式:

    - float: 无透明效果, 默认
    - screen: 有渐变透明效果, 如微信QQ的一样
    - none: 隐藏导航栏

cardStyle: 样式
    - onTransitionStart: 页面切换开始时的回调函数
    - onTransitionEnd: 页面切换结束时的回调函数

## TabNavigator 标签栏
```javascript
// 注册tabs
const Tabs = TabNavigator({
    Home: {
        screen: Home,
        navigationOptions: {  // 也可以写在组件的static navigationOptions内
            tabBar: {
                label: '首页',
                icon: ({tintColor}) => (<Image source={require('./app/images/home.png')} style={[{tintColor: tintColor},styles.icon]}/>),
            },
        }
    },
    Bill: {
        screen: Bill,
        navigationOptions: {
            tabBar: {
                label: '账单',
               icon: ({tintColor}) => (<Image source={require('./app/images/bill.png')} style={[{tintColor: tintColor},styles.icon]}/>),
            },
        }
    },
    Me: {
        screen: Me,
        navigationOptions: {
            tabBar: {
                label: '我',
                icon: ({tintColor}) => (<Image source={require('./app/images/me.png')} style={[{tintColor: tintColor},styles.icon]}/>),
            },
        }
    }
  }, {
      animationEnabled: false, // 切换页面时是否有动画效果
      tabBarPosition: 'bottom', // 显示在底端，android 默认是显示在页面顶端的
      swipeEnabled: false, // 是否可以左右滑动切换tab
      backBehavior: 'none', // 按 back 键是否跳转到第一个Tab(首页)， none 为不跳转
      tabBarOptions: {
          activeTintColor: '#ff8500', // 文字和图片选中颜色
          inactiveTintColor: '#999', // 文字和图片未选中颜色
          showIcon: true, // android 默认不显示 icon, 需要设置为 true 才会显示
          indicatorStyle: {
              height: 0  // 如TabBar下面显示有一条线，可以设高度为0后隐藏
          }, 
          style: {
              backgroundColor: '#fff', // TabBar 背景色
              // height: 44
          },
          labelStyle: {
              fontSize: 10, // 文字大小
          },
      },
});

```

## DrawerNavigator抽屉
```javascript
const DrawerNav = DrawerNavigator({
    Home: { screen: Home },
    Bill: { screen: Bill },
    Me: { screen: Me },
    HomeTwo: { screen: HomeTwo },
    HomeThree: { screen: HomeThree },
    HomeFour: { screen: HomeFour },
    BillTwo: { screen: BillTwo },
    BillThree: { screen: BillThree }
}, {
    drawerWidth: 200, // 抽屉宽
    drawerPosition: 'left', // 抽屉在左边还是右边
    // contentComponent: CustomDrawerContentComponent,  // 自定义抽屉组件
    contentOptions: {
      initialRouteName: Home, // 默认页面组件
      activeTintColor: 'white',  // 选中文字颜色
      activeBackgroundColor: '#ff8500', // 选中背景颜色
      inactiveTintColor: '#666',  // 未选中文字颜色
      inactiveBackgroundColor: '#fff', // 未选中背景颜色
      style: {  // 样式
        
      }
    }
});
```

### navigation

在StackNavigator中注册后的组件都有navigation这个属性. navigation又有5个参数:
1. navigate, 
1. goBack, 
1. state, 
1. setParams, 
1. dispatch, 
可以在组件下console.log一下this.props就能看到.

- this.props.navigation.navigate('Two', { name: 'two' }): push下一个页面
    - routeName: 注册过的目标路由名称
    - params: 传递的参数
    - action: 如果该界面是一个navigator的话，将运行这个sub-action

- this.props.navigation.goBack(): 返回上一页

- this.props.navigation.state: 每个界面通过这去访问它的router，state其中包括了：
    - routeName: 路由名
    - key: 路由身份标识
    - params: 参数
    
- this.props.navigation.setParams: 该方法允许界面更改router中的参数，可以用来动态的更改导航栏的内容

- this.props.navigation.dispatch: 可以dispatch一些action，主要支持的action有：

    - Navigate:
```javascript
import { NavigationActions } from 'react-navigation'

const navigationAction = NavigationActions.navigate({
  routeName: 'Profile',
  params: {},

  // navigate can have a nested navigate action that will be run inside the child router
  action: NavigationActions.navigate({ routeName: 'SubProfileRoute'})
})
this.props.navigation.dispatch(navigationAction)
```
    - Reset: Reset方法会清除原来的路由记录，添加上新设置的路由信息, 可以指定多个action，index是指定默认显示的那个路由页面, 注意不要越界了
```javascript
import { NavigationActions } from 'react-navigation'

const resetAction = NavigationActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({ routeName: 'Profile'}),
    NavigationActions.navigate({ routeName: 'Two'})
  ]
})
this.props.navigation.dispatch(resetAction)
```

    - SetParams: 为指定的router更新参数，该参数必须是已经存在于router的param中
```javascript

import { NavigationActions } from 'react-navigation'

const setParamsAction = NavigationActions.setParams({
  params: {}, // these are the new params that will be merged into the existing route params
  // The key of the route that should get the new params
  key: 'screen-123',
})
this.props.navigation.dispatch(setParamsAction)
```
Navigation Actions
支持以下actions:
1. Navigate:
1. Reset:
1. Back:
1. Set Params:
1. Init:

### Deep Link
其他app或浏览器使用url打开次app并进入指定页面. 如浏览器输入url demo4://home/home3直接进入home3页面.

## iOS版设置
1. 使用Xcode设置Schemes;
1. 在AppDelegate添加一下代码:
```
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
  return [RCTLinkingManager application:application openURL:url
                      sourceApplication:sourceApplication annotation:annotation];
}
```
1. js组件在注册路由时设置唯一的路径path, 例如Home2: { screen: Home2, path:'app/Home2' };
1. 在手机浏览器访问demo4://app/Home2, 弹窗选择打开, 就可以打开demo4 app并进到Home2页面了.

