# Linux DO · 飞书云文档外观

一个油猴脚本，把 [linux.do](https://linux.do/) 的 web 界面换成飞书云文档风格——主页像云文档文件列表，话题页像文档编辑页。**只换皮，不碰数据**：Linux DO 的真实内容、链接、按钮与交互全部保留。

<img width="1901" height="864" alt="image" src="https://github.com/user-attachments/assets/67cf0848-7692-465c-834a-f27ee3744d03" />


<img width="1901" height="863" alt="image" src="https://github.com/user-attachments/assets/6407a772-3f9a-4b34-9372-34b28bee33b9" />

## V2版本重大更新
1. 话题页重构，隐藏用户头像，部分元信息伪装为引用块，话题所有者为黄色样式，引用块内元素可点击
2. 隐藏帖子相关操作，hover帖子可展示
3. 隐藏时间线，hover右下角按钮可展示
4. 新增新老版本切换功能，通过左下角按钮切换
5. 新增回退到上一页功能，通过右下角按钮回退

### 图片说明
<img width="1918" height="864" alt="image" src="https://github.com/user-attachments/assets/c162e6ef-aa55-4662-b825-67c6cd683541" />


## 安装

1. 浏览器安装 [Tampermonkey](https://www.tampermonkey.net/)（或 Violentmonkey）。
2. 打开 [`linuxdo-lark.user.js`](./linuxdo-lark.user.js)，点 **Raw** 后按提示安装。
3. 访问 <https://linux.do/>。

## 覆盖范围

- 顶栏品牌显示为「飞书云文档」，favicon 与启动加载页 Logo 同步替换。
- **主页**：话题列表 → 云文档文件表格（标题 / 所有者 / 回复 / 浏览量 / 最近访问）。
- **话题页**：主帖与回复采用连续的文档排版，同时保留回复、点赞、Boost、楼层导航等原生功能。
- 可随时切换文档排版与 Linux DO 原始帖子样式，并提供快捷返回操作。
- 左侧导航保留原结构与交互，仅换外观。
- 浅色 / 深色外观自动跟随 linux.do 自身的颜色模式设置（含「自动」档跟随系统），配色对齐飞书网页端（暗色中性色用白色透明度梯度）。
- 支持 SPA 前进、后退与站内跳转后自动切换页面模式。

## 设计约束

- 以 CSS 为主改造原页面，仅添加必要的界面增强节点。
- 新增类名统一 `lark-` 前缀，DOM 增强幂等（MutationObserver 频繁触发不产生重复节点）。
- 不删除或替换原生功能节点；不伪造 Linux DO 不具备的功能。
- 仅适配桌面端，窄屏只保证可用。
- 需要支持 CSS `:has()` 的现代浏览器（Chrome 105+ / Safari 15.4+ / Firefox 121+）。

## License

MIT

## 友链

[linux.do](https://linux.do/)
