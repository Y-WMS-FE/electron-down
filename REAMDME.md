# Electron markdown
> Electron + simplemde
>
![](https://img.shields.io/badge/electron-markdown-blue)

* 🌟 跨平台
* 🌟 开源
* 🌟 javascript

## 代办事项
*   ~~使用react + typescript~~
*   ~~支持拖动文件到应用中直接加载~~
*   ~~支持写入操作~~
*   ~~支持文件的新建~~
*   ~~禁止应用内command + r刷新~~
*   ~~文件新建对已存在文件进行校验，而不是直接覆盖(不需要修改，showSaveDialogSync会进行校验)~~
*   ~~command + n 打开新的窗口~~
*   ~~拖入文件进入已编辑窗口的时候，打开新的窗口~~
*   ~~限制窗口的数量~~
*   ~~touchBar显示文件标题~~
*   拖入相同文件进入窗口时不需要打开新的窗口
*   已编辑的窗口保存时，默认文件名为第一行文本
*   已编辑的窗口关闭时，提示用户保存
*   touchBar初版接入功能函数
*   用户调整的宽高本地化保存（并且针对样式优化，输入框居中，不应该限制height）
*   ~~支持多个窗口编辑~~
*   字体优化
*   main.js模块拆分
*   新建窗口时自动根据现有窗口的位置去调整
*   基本的动画优化
*   接入electron-builder打包
*   快捷键功能开发
*   对mac + windows的兼容
*   上传github

*   应用的图标

*   在windows中调试

*   完善menu菜单
*   touchBar兼容开发
*   支持拖动文件到应用快捷方式(dock)
*   接入eslint
*   对simplemde优化样式
*   文件保存新建之类操作从主进程中独立出来

## 开发日志
`2020-03-20`
1.  touchBar显示文件标题


`2020-03-19`
1.  拖动文件进入已编辑过的窗口时，弹出新的窗口并加载
2.  限制最多存在5个窗口，否则的话会弹框提示
3.  把window的功能操作独立到window-operator.js文件中
4.  把一般的dialog操作封装到modal.js文件中
5.  在util.js中封装了将函数转成promise

`2020-03-15`
1.  增加了command + n新建一个窗口
2.  调整了新建窗口的函数和出现位置
3.  调整了窗口的部分样式

`2020-03-13`
1.  新文件保存的时候弹框方法优化
2.  在index.ejs中针对非开发环境时候，阻止了command + r的默认事件

`2020-03-12`
1.  使用了React Context来进行中间数据存储
2.  md修改时在title上展示标记
3.  对拖入页面的文件修改保存，新文件的保存

`2020-03-12`
1.  开始使用electron + simplemde + index.html 来进行静态文件的搭建
2.  将index.html切换成使用react + typescript + webpack模式。
3.  发现react与elctron中通信问题，在index.html中注入window.$electron
4.  文件拖入页面加载




