<!-- 徽章区域（项目状态、版本、依赖等） -->

<p align="center">
  <img src="https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white" alt="Chrome Extension">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT">
  <img src="https://img.shields.io/badge/Version-1.0-blue" alt="Version">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen" alt="Status">
</p>

# 📚 文献直通车

一款支持自行配置学校信息的非官方 Chrome 扩展。它可以将普通论文链接**一键转换为本校授权访问链接**，并**直接沿用当前浏览器的学校登录状态**。使用它，您可以**继续使用个人 VPN**，**无需修改任何代理配置**，也**完全无需登录校园网**。

> 💡 **通用配置工具，不是“所有学校装好即用”。** 
> 支持以下两种方式；是否可访问全文取决于学校订购范围和访问系统。

| 访问方式 | 支持情况 |
| :--- | :--- |
| **WebVPN 通道**<br>`/https/编码/路径` 地址 | 🟢 设置页面添加各数据库映射 |
| **EZproxy 通道**<br>`login?url=论文网址` 入口 | 🟢 设置页面填写学校 URL 模板 |
| **纯 CARSI 机构登录**<br>Shibboleth / OpenAthens | 🟡 不提供通用自动登录；若同时有支持的代理入口，可配置该入口 |
| **纯 VPN 客户端** | 🔴 本扩展不能代替 VPN 客户端 |

---

## ⚙️ 安装

1. 下载 ZIP，解压到长期保留的文件夹，例如 `C:\BrowserExtensions\paper-campus-access`。
2. Chrome 地址栏打开 `chrome://extensions/`，开启“**开发者模式**”。
3. 点击“**加载已解压的扩展程序**”，选择直接包含 `manifest.json` 的文件夹。
4. 在弹出的“学校设置”页配置学校并保存。以后可右键扩展图标 →“选项”修改。

> ⚠️ **注意**：不要删除或移动已加载的文件夹。安装过同类扩展时，请先停用旧扩展，避免快捷键冲突。

---

## 🛠️ 配置学校

### 🌐 方式一：WebVPN

1. 填写学校名称和学校 WebVPN 首页地址。
2. 选择“**WebVPN 地址映射**”。
3. 从学校门户打开某个数据库，将原始数据库网址和通过学校打开后的网址分别粘贴到两个输入框。
4. 点击“**添加 / 更新此网站**”，按需添加其他数据库，最后“**保存学校设置**”。

> 📌 **格式要求**：学校地址需符合 `/https/编码/路径` 或 `/http/编码/路径` 格式。不符合时不能直接套用；不同学校、不同域名的编码不能随意混用。**请不要粘贴含登录票据的回调地址。**

### 🔗 方式二：EZproxy / URL 模板

1. 填写学校名称及学校代理门户首页地址。
2. 选择“**EZproxy / URL 模板**”。
3. 按学校图书馆公布的代理前缀填写模板，例如：
   ```text
   https://ezproxy.your-university.edu/login?url={encodedUrl}
   ```
   *（注：以上仅为格式示例，必须换成自己学校的真实域名。模板与门户必须同源，且包含一个 `{encodedUrl}` 表示编码后的论文地址。）*
4. 填入允许转换的论文网站域名，每行一个（如 `www.nature.com`），保存设置。

---

## 🚀 日常使用

本人完成一次学校登录后，照常在 Google Scholar 搜索论文。打开出版社论文页后，您可以通过以下方式使用：

*   ⌨️ **快捷键**：按 **`Ctrl + Shift + Y`** 
*   🖱️ **点击图标**：点击浏览器右上角的扩展按钮
*   🖱️ **右键菜单**：在链接上右键 →“**通过本校打开论文**”

扩展会在新标签页通过学校通道打开。登录有效时沿用学校会话，到期后需本人重新登录。DOI 或其他中转地址请先打开出版社页面再使用。

> 🛠️ **扩展维护**：增加网站只需进入“选项”添加并保存，无需改代码或刷新扩展。若快捷键冲突，请前往 `chrome://extensions/shortcuts` 修改。

---

## 🔒 权限与验证范围

本扩展仅申请 `activeTab`、`contextMenus`、`storage` 权限。
配置保存在本机，不包含账号密码，不读取 Cookie、正文或浏览历史，不改变 Clash 配置，不自动抓取或下载论文。保留少量文章编号查询参数，不转发其他跟踪或认证参数；依赖特殊参数的网站可能需要适配。

---

## 📁 文件结构

*   `manifest.json`：扩展声明
*   `background.mjs`：按钮与菜单逻辑
*   `route.mjs`：链接转换及验证
*   `options.html` / `options.mjs`：学校设置页面
*   `style.css`：页面样式
*   `help.html`：使用帮助
*   `README.md`：本说明

## 🤖 AI 一键配置指南

把项目地址 https://github.com/Peiwei-Wu/paper-campus-access 发给 Codex/Claude Code 等，并告诉它：“请阅读项目 README，帮我下载并安装扩展，根据我学校的图书馆或校外访问入口完成配置，再用一篇论文验证是否能访问全文；保留现有代理设置，需要学校账号、扫码或短信验证时由我本人操作。”

## 📝 开源协议
本项目基于 MIT License 开源。您可以自由地使用、修改和分发本项目，但请保留原作者版权声明。本项目仅供学习交流使用，请遵守所在学校的网络使用规定，请勿用于商业用途。
