# Health Monitoring - Frontend

本项目是“健康监测”全栈应用的客户端部分，基于 React 构建。它为用户提供了一个与后端 AI 服务进行交互的现代化、响应式的聊天界面。

## ✨ 主要功能

- **用户认证**: 提供完整的注册、登录、登出流程。
- **安全路由**: 使用私有路由保护需要认证才能访问的页面。
- **应用列表**: 动态从后端加载并展示可用的 AI 应用。
- **会话管理**: 展示历史会话列表，并能进入查看历史消息。
- **实时聊天**:
  - 支持与 AI 进行实时的流式文本聊天（打字机效果）。
  - 支持多模态（图文）聊天（接口已预留）。
  - 自动保存聊天记录，并能在新会话与历史会话间无缝切换。

## 🛠️ 技术栈

- **核心框架**: [React](https://reactjs.org/) (v19)
- **路由**: [React Router DOM](https://reactrouter.com/) (v7)
- **状态管理**: [React Context API](https://reactjs.org/docs/context.html) (用于全局认证状态) & `useState` (用于组件局部状态)
- **构建工具**: [Create React App](https://create-react-app.dev/) (`react-scripts`)
- **API 请求**:
  - 原生 `fetch` API
  - `@microsoft/fetch-event-source`: 用于实现与后端 SSE (Server-Sent Events) 的稳定流式连接。
- **语言**: JavaScript (ES6+)
- **样式**: 纯 CSS (计划升级为 CSS Modules)

## 📂 项目结构

项目遵循“关注点分离”的原则，采用了按功能划分的目录结构，清晰且易于维护。

```
health-monitoring-frontend/
└── src/
    ├── api/              # API 请求层 (已抽象)
    │   ├── authApi.js    # 认证相关 API
    │   ├── chatApi.js    # 聊天与会话相关 API
    │   └── index.js      # API 帮助函数和统一导出
    ├── assets/           # 静态资源 (图片, SVG 等)
    ├── components/       # 可复用的通用组件
    │   ├── common/       # 基础组件 (如 PrivateRoute)
    │   └── layout/       # 布局组件 (如 Header)
    ├── context/          # React Context (全局状态管理)
    │   └── AuthContext.js
    ├── hooks/            # 自定义 Hooks (待添加)
    ├── pages/            # 页面级组件
    │   ├── LoginPage.js
    │   ├── RegisterPage.js
    │   ├── AppListPage.js
    │   └── ...
    ├── styles/           # 全局样式
    │   ├── App.css
    │   └── index.css
    ├── utils/            # 通用工具函数 (待添加)
    ├── App.js            # 应用主入口和路由配置
    └── index.js          # React DOM 渲染入口
```

## 🚀 快速开始

### 1. 环境准备

- 确保你已安装 [Node.js](https://nodejs.org/) (推荐 v18 或更高版本)。
- 确保后端的 Spring Boot 服务正在本地的 `http://localhost:8080` 运行。

### 2. 安装依赖

在项目根目录下，执行以下命令安装所有必需的 npm 包：
```bash
npm install
```

### 3. 配置代理

本项目使用 `http-proxy-middleware` (`setupProxy.js`) 来解决开发环境下的跨域问题。所有从前端发起的 `/api` 请求都会被自动代理到后端服务。

请检查 `src/setupProxy.js` 文件，确保 `target` 地址与你的后端服务地址一致。
```javascript
// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080', // <-- 确保这里是你的后端地址
      changeOrigin: true,
    })
  );
};
```

### 4. 启动开发服务器

执行以下命令，启动项目：
```bash
npm start
```
应用将在 `http://localhost:3000` 上运行，并会自动在浏览器中打开。

## 📜 可用脚本

- `npm start`: 在开发模式下运行应用。
- `npm run build`: 将应用打包为生产环境的静态文件，输出到 `build` 目录。
- `npm test`: 启动测试运行器。
- `npm run eject`: **(危险操作)** 将项目的配置和脚本从 Create React App 中“弹出”，此操作不可逆。

## 🏛️ 核心架构解读

### API 层

- **位置**: `src/api/`
- **职责**: 统一管理所有与后端的数据交互。组件不应直接调用 `fetch`。
- **实现**:
  - `authApi.js` 封装了登录、注册等函数。
  - `chatApi.js` 封装了获取应用/会话、发起聊天等函数。
  - 这种分层使得组件代码更干净，API 的修改也只在一处进行。

### 状态管理

- **全局状态**: `src/context/AuthContext.js` 负责管理用户的认证信息 (`user`, `isAuthenticated`) 和相关的操作 (`login`, `logout`)。整个应用被 `AuthProvider` 包裹，任何子组件都可以通过 `useAuth()` hook 访问这些状态和方法。
- **局部状态**: 页面和组件内部的临时状态（如表单输入、加载状态等）继续使用 `useState` 进行管理。

### 路由

- **实现**: `react-router-dom`
- **配置**: 路由的定义集中在 `src/App.js` 中。
- **私有路由**: `src/components/common/PrivateRoute.js` 是一个高阶组件，它检查 `AuthContext` 中的 `isAuthenticated` 状态。如果用户未登录，它会自动将用户重定向到 `/login` 页面，从而保护需要认证的页面。

## 📈 未来优化方向

- **样式方案**: 从纯 CSS 迁移到 [CSS Modules](https://github.com/css-modules/css-modules)，实现组件级别的样式隔离。
- **引入 TypeScript**: 将项目迁移到 TypeScript，以获得静态类型检查带来的健壮性和更好的开发体验。
- **自定义 Hooks**: 将组件中可复用的逻辑（如数据请求、表单处理等）抽离到 `src/hooks/` 目录下的自定义 Hooks 中。
- **服务端状态管理**: 引入 `React Query` 或 `SWR` 来替代 `useEffect` 中的数据请求逻辑，以更好地管理缓存、加载和错误状态。