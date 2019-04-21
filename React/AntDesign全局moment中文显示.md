# AntDesign 全局 moment 中文显示

```
// 全局中文
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

ReactDOM.render(
    <Provider {...RootStore}>
        <LocaleProvider locale={zh_CN}>
            <App />
        </LocaleProvider>
    </Provider>,
    document.getElementById('root')
);
```

[官网地址](https://ant.design/components/date-picker-cn)
