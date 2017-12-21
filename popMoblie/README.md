# popMobile.js文档说明

本插件主要由核心插件$.fn.popup和定义在window上的函数Dialog组成，具体使用方式如下。

## 插件核心$.fn.popup的api

$.fn.popup采用bootsrap代码风格，支持声明式使用和jQuery的链式调用。

jQuery的用法有两种：

### $(“#id”).popup(option);

option为一个对象，改变插件的默认配置；具体参数设置如下表：
选项	可选值	说明
backdrop	true(默认值)，false	是否点击遮罩层关闭窗口
show	true(默认值)，false	窗口初始化后是否立即打开
type	"top"(默认值)，"middle","bottom"	窗口定位，顶部，中间，底部
remote	url	Ajax下载弹窗的url，目前仅能用于Dialog插件

###$(“#id”).popup(“show”);

可传入一个类似于show之类的字符串，调用其核心构造函数Popup的相应方法。

##$.fn.popup的声明式使用

$.fn.popup支持声明式使用，为触发弹窗元素增加data-toggle="popup"的属性，option可以通过data- + option值的方式传入，例如data-type = "bottom"等。

#Dialog函数的api

Dialog函数用于ajax下载弹窗内容并打开，需传入三个参数Dialog(element,config,option)，其中element为弹窗的选择器表达式，config中必须传入remote，option为需要执行的方法。
