# Visualization Engine

基于 React + Vite + TypeScript 构建的可视化引擎项目。

## 🚀 快速开始 (Getting Started)

### 环境准备

确保你的本地环境已安装 Node.js (推荐 v18+)。

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

启动后访问控制台输出的本地地址 (通常是 <http://localhost:5173)。>

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

## 📂 工程结构 (Project Structure)

```
visualizationEngine/
├── src/                # 源代码目录
│   ├── assets/         # 静态资源 (图片等)
│   ├── App.css         # App 组件样式
│   ├── App.tsx         # 根组件
│   ├── index.css       # 全局样式
│   ├── main.tsx        # 入口文件
│   └── vite-env.d.ts   # Vite 类型定义
├── public/             # 纯静态资源 (不经过打包处理)
├── index.html          # HTML 模板
├── package.json        # 项目配置与依赖
├── tsconfig.json       # TypeScript 配置
├── tsconfig.app.json   # App 专用 TS 配置
├── tsconfig.node.json  # Node 相关 TS 配置
└── vite.config.ts      # Vite 构建配置
```

## ⚠️ 注意事项 (Notes)

1. **TypeScript 规范**
   - 项目严格遵循 TypeScript 类型检查。
   - 尽量避免使用 `any` 类型，确保代码的可维护性。

2. **样式管理**
   - 项目集成了 **TailwindCSS** 和 **Less**。
   - 全局样式入口为 `src/index.less`。
   - 支持使用 Tailwind 工具类和 Less 预处理功能。

3. **静态资源**
   - 引用 `src/assets` 下的资源会被 Vite 处理（哈希文件名、Base64 内联等）。
   - 引用 `public` 下的资源请直接使用绝对路径 (如 `/logo.png`)。

4. **开发规范**
   - 遵循 ESLint 规则。
   - 组件开发建议遵循单一职责原则。
