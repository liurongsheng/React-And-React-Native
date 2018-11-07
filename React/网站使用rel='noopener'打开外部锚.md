# 网站使用 rel="noopener" 打开外部锚

当您的页面链接至使用 target="_blank" 的另一个页面时，新页面将与您的页面在同一个进程上运行。 
如果新页面正在执行开销极大的 JavaScript，您的页面性能可能会受影响。


此外，target="_blank" 也是一个安全漏洞。
新的页面可以通过 window.opener 访问您的窗口对象，并且它可以使用 window.opener.location = newURL 将您的页面导航至不同的网址。

单击下面的一个链接，打开一个需要大量JavaScript计算的页面（以下并非链接，请参见原文——译者注）：
```
<a target="_blank">
<a target="_blank" rel="noopener">
```
rel="noopener noreferrer"

没有rel="noopener"，随机数会被新打开页面中的JavaScript阻断。
不仅如此，所有主线程活动也会被阻塞，试试选择页面中的文本。
但加了rel="noopener"之后，随机数生成一直保持在60fps。当然，是在Chrome或Opera中。
大多数浏览器都是多进程的，除了Firefox（他们正在改）。


每个进程包含多个线程，包括我们常说的“主”线程。
解析、样式计算、布局、绘制和非worker的JavaScript都在主线程里执行。

就是说，一个域中的JavaScript与另一个标签页或窗口中的域中的JavaScript在不同的线程里。
然而，由于我们可以通过window.opener同步跨窗口地访问DOM，
因此通过target="_blank"启动的窗口还在同一个进程（线程）中。通过window.open打开的iframe和窗口也一样。
rel="noopener"会阻止window.opener，因此不存在跨窗口访问。Chromium浏览器为此做过优化，会在独立的进程中打开新页面。

[参考地址](https://mathiasbynens.github.io/rel-noopener/#hax): https://mathiasbynens.github.io/rel-noopener/#hax
