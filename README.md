# Linux DO · 飞书云文档外观

一个油猴脚本，把 [linux.do](https://linux.do/) 的 web 界面换成飞书云文档风格——主页像云文档文件列表，话题页像文档编辑页。**只换皮，不碰数据**：Linux DO 的真实内容、链接、按钮与交互全部保留。

<img width="1881" height="865" alt="image" src="https://github.com/user-attachments/assets/c7be2963-8d4b-40a0-8c2c-589f9db082dc" />  



<img width="1901" height="866" alt="image" src="https://github.com/user-attachments/assets/32b9f4b5-f567-47a3-b5a2-577393eee70b" />


## 安装

1. 浏览器安装 [Tampermonkey](https://www.tampermonkey.net/)（或 Violentmonkey）。
2. 打开 [`linuxdo-lark.user.js`](./linuxdo-lark.user.js)，点 **Raw** 后按提示安装。
3. 访问 <https://linux.do/>。

## 覆盖范围

- 顶栏品牌显示为「飞书云文档」，favicon 同步替换。
- **主页**：话题列表 → 云文档文件表格（标题 / 所有者 / 回复 / 浏览量 / 最近访问）。
- **话题页**：主帖 → 文档正文，回复 → 评论卡片，右侧楼层轴功能不变。
- 左侧导航保留原结构与交互，仅换外观。
- 浅色 / 深色外观自动跟随 linux.do 自身的颜色模式设置（含「自动」档跟随系统），配色对齐飞书网页端（暗色中性色用白色透明度梯度）。
- 支持 SPA 前进、后退与站内跳转后自动切换页面模式。

## 设计约束

- 纯 CSS 改造原 DOM，仅添加必要的品牌、搜索入口与路径栏。
- 新增类名统一 `lark-` 前缀，DOM 增强幂等（MutationObserver 频繁触发不产生重复节点）。
- 不删除或替换原生功能节点；不伪造 Linux DO 不具备的功能。
- 仅适配桌面端，窄屏只保证可用。
- 需要支持 CSS `:has()` 的现代浏览器（Chrome 105+ / Safari 15.4+ / Firefox 121+）。

## License

MIT

## 友链
[linux.do](https://linux.do/)
