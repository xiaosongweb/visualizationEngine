# 可视化编排监控看板引擎需求文档

## 1. 产品概述 (Product Overview)

### 1.1 项目背景

随着业务系统的日益复杂，运维监控和业务运营数据的展示需求变得更加多样化和定制化。传统的固定式大屏开发周期长、修改成本高，无法满足快速变化的业务需求。因此，我们需要构建一个**可视化编排监控看板引擎**，允许用户通过简单的拖拽和配置，快速搭建专业的监控大屏和业务看板。

### 1.2 核心价值

- **提效 (Efficiency)**: 将传统需要数天的大屏开发工作缩短至数分钟。
- **灵活 (Flexibility)**: 支持布局自由调整、组件丰富多样、数据源动态绑定。
- **解耦 (Decoupling)**: 界面展示与后端数据解耦，前端专注于展示逻辑，后端专注于数据供给。

### 1.3 目标用户

- **运维工程师**: 快速搭建系统监控大屏，实时查看服务器、容器、应用状态。
- **运营人员**: 搭建业务数据看板，关注实时营收、流量转化等指标。
- **开发人员**: 快速集成并嵌入到现有系统中，作为仪表盘功能模块。

---

## 2. 核心功能模块 (Core Functional Modules)

### 2.0 看板管理工作台 (Dashboard Workspace)

提供统一的看板管理入口，支持对大量看板资源的有效组织与协作。

- **列表与视图 (List & Views)**:
  - **多视图切换**:
    - **卡片视图**: 展示看板缩略图、创建人、最后更新时间，适合视觉浏览。
    - **列表视图**: 展示详细元数据 (ID, Status, Tags)，支持按字段排序，适合管理。
- **组织与分类 (Organization)**:
  - **文件夹 (Folders)**: 支持多级文件夹归档，隔离不同业务域的看板资源。
  - **标签 (Tags)**: 支持 "Production", "Test", "Revenue" 等多维度标签，实现跨目录检索。
- **检索与操作 (Search & Actions)**:
  - **全能搜索**: 支持按 Name, Description, Creator, Tag 进行模糊搜索 (秒级响应)。
  - **快捷操作**: 支持 Clone (复制模板), Share (生成免登链接), Export (导出 JSON), Move (移动分组)。

### 2.1 画布区 (Canvas)

核心编辑区域，采用绝对定位布局 (Absolute Layout)。

- **拖拽与吸附 (Drag & Snap)**:
  - **Grid System**: 默认网格大小 `20px * 20px`。
  - **吸附阈值**: 拖拽组件时，距离参考线或网格线 `< 5px` 时自动吸附。
  - **参考线 (Smart Guides)**:
    - **中心对齐**: 组件中心点与其他组件中心点重合时显示红色虚线。
    - **边缘对齐**: 组件边缘 (Top/Bottom/Left/Right) 对齐时显示蓝色虚线。
- **缩放与漫游 (Zoom & Pan)**:
  - **缩放范围**: `10%` (Min) - `400%` (Max)。
  - **交互**:
    - `Ctrl + 滚轮`: 以鼠标指针为中心进行缩放。
    - `空格 + 拖拽`: 平移画布 (Pan)。
- **图层管理**: 实现类似 PhotoShop 的图层栈。
  - Z-Index 范围: `0` (Bottom) - `9999` (Top)。
  - 支持 **成组 (Group)**: 多个组件合并为一个 Group 容器，支持 Group 级别的拖拽和缩放。

### 2.2 组件库 (Component Library)

组件是引擎的原子单元，每个组件需遵循统一的生命周期接口。

- **组件生命周期 (Lifecycle)**:
  1. **Init**: 加载默认配置 (DefaultProps)。
  2. **Mount**: 组件挂载，注册事件监听。
  3. **Request**: (可选) 触发数据源请求。
  4. **Transform**: (可选) 执行数据转换脚本。
  5. **Render**: 渲染 UI (React/Vue Render)。
  6. **Unmount**: 销毁组件，清除定时器和事件监听。
  
- **内置组件规范**:
  - **基础图表**: 封装 ECharts，对外暴露 `option` 配置项，但通过 GUI 屏蔽复杂性。
  - **流式组件**:
    - **日志流**: 使用 `VirtualList` (虚拟滚动) 技术，支持 10万+ 行日志渲染不卡顿。
  - **辅助组件**:
    - **容器 (Container)**: 支持 Flex 布局子元素的容器组件。

### 2.3 配置面板 (Property Panel)

右侧属性配置区，数据流向为单向：`Config -> State -> Component Props`。

- **数据绑定 (Data Binding)**:
  - **静态数据**: JSON 编辑器 (Monaco Editor) 输入。
  - **API 请求**:
    - 支持方法: GET, POST。
    - **变量替换**: 在 URL/Headers/Body 中使用双大括号语法 `{{variable}}` 进行动态替换。
      - 例如 URL: `https://api.example.com/stats?region={{current_region}}`。
  - **数据转换 (Transform)**:
    - **函数签名**:

      ```javascript
      /**
       * @param {object} data - 接口原始返回数据
       * @param {object} _ - Lodash 实例
       * @param {object} vars - 当前全局变量
       */
      function transform(data, _, vars) {
        // Example:
        return data.list.filter(i => i.val > 10).map(i => ({ x: i.time, y: i.val }));
      }
      ```

    - **沙箱执行**: 使用 `new Function()` 或 QuickJS WASM 隔离执行，防止污染全局作用域。
  - **数据格式化 (Formatter)**:
    - 内置通用格式化器，无需手写代码：
      - **数值**: 千分位分隔 (`1,000`),保留小数 (`Fixed(2)`).
      - **存储单位**: 自动转换 B -> KB/MB/GB/TB (1024进制).
      - **网络流量**: bps -> Kbps/Mbps (1000进制).
      - **日期时间**: 时间戳 -> `YYYY-MM-DD HH:mm:ss`.

- **交互事件 (Events & Actions)**:
  - **EventBus**: 组件间通信总线。
  - **协议格式**: `emit(eventName, payload)`。
  - **常见动作**:
    - `link`: 打开新窗口。
    - `setGlobalState`: 更新全局变量 (e.g. `setGlobalState({ current_region: 'beijing' })`)。
    - `refresh`: 强制刷新指定组件的数据请求。

### 2.4 数据源管理 (Data Source)

后端代理模式 (Proxy Mode) 为主，支持前端直连模式 (Direct Mode)。

- **连接协议**:
  - **HTTP**: 标准 RESTful 调用，基于轮询 (Polling) 机制更新数据。
- **全局变量池 (Variable Store)**:
  - 存储页面级公共参数 (如 `time_range`, `env_id`)。
  - URL Query 参数自动注入变量池 (e.g. `?env=test` -> `vars.env = 'test'`)。
- **可观测性数据类型支持 (Observability Data Types)**:
  - **指标 (Metrics)**:
    - *特征*: 时序数据 (TimeSeries), 包含 Timestamp, Value, Tags.
    - *推荐图表*: 折线图, 面积图, 仪表盘, 热力图.
  - **日志 (Logs)**:
    - *特征*: 文本流数据, 包含 Timestamp, Level (Info/Error), Message, TraceID.
    - *推荐图表*: 日志检索列表 (Log List), 柱状图 (Log Volume), 关键词云.
  - **告警 (Alerts)**:
    - *特征*: 离散事件, 包含 StartTime/EndTime, Status (Firing/Resolved), Severity.
    - *推荐图表*: 告警列表, 告警泳道图, 状态信号灯.
  - **调用链 (Traces)**:
    - *特征*: 树状结构 (Spans), 包含 TraceID, Operation, Duration, ParentID.
    - *推荐图表*: 瀑布图 (Waterfall), 服务依赖拓扑图 (Service Map).

- **查询执行策略 (Query Execution)**:
  - **多语言支持**: 引擎需根据 `queryType` 自动适配驱动 (SQL Driver, Prometheus Client, Lucene Client).
  - **参数化查询 (Parameterized Query)**:
    - 支持使用 `{{vars.env}}` 等全局变量注入动态参数.
    - SQL 模式下强制使用预编译语句 (PreparedStatement) 防止注入攻击.

- **数据结构标准 (Data Structure Standards)**:
  - **TimeSeries (时序数据)**:
    - *结构*: `Array<{ time: Number, value: Number, metric?: String }>`
    - *用途*: 趋势分析. 引擎自动基于 `time` 对齐 X 轴.
  - **Scalar (标量数据)**:
    - *结构*: `Object<{ value: Number, unit?: String, status?: String }>` 或纯 `Number`
    - *用途*: 实时状态. 引擎取最新值展示于仪表盘/KPI.
  - **List (列表数据)**:
    - *结构*: `Array<Object>` (扁平对象数组)
    - *用途*: 明细展示. 结合 `columns` 配置进行表格/日志渲染.

### 2.5 顶部工具栏 (Toolbar)

- **保存/发布**:
  - **版本管理**: 每次保存生成版本快照，支持回滚到历史版本。
  - **发布**: 生成访问链接，支持设置访问密码或有效期。
- **预览模式**: 切换编辑/预览状态，真实模拟运行时效果。
- **历史记录**: 撤销 (Undo) / 重做 (Redo)，支持快捷键 (Ctrl+Z / Ctrl+Y)。
- **导入/导出 (Import/Export)**:
  - **配置导出 (Configuration)**:
    - **看板级**: 导出完整配置为 JSON (包含 Meta, Global, Components)。
    - **组件级**: 支持右键导出单个组件配置为 JSON 片段，实现跨看板复用。
  - **数据导出 (Data Export)**:
    - **JSON**: 导出当前视图的原始数据 (Raw Response)，用于排查 API 响应问题。
    - **CSV**: 导出格式化后的表格数据，支持 Excel 二次分析 (自动应用当前 Filter)。
- **清空画布**: 重置所有内容。

### 2.6 变量筛选栏 (Filter Bar)

位于顶部工具栏下方，用于用户交互式地控制全局变量，驱动图表联动。

- **支持控件**:
  - **下拉选择 (Select)**: 单选/多选 (e.g. `City: [Beijing, Shanghai]`).
  - **文本输入 (Input)**: 模糊搜索关键字.
  - **时间选择器 (TimePicker)**: 支持多种时间选择模式，满足不同回溯需求。
    - **最近时间 (Quick Ranges)**: `Last 5m`, `Last 30m`, `Last 1h`, `Last 6h`, `Last 24h`, `Last 7d`.
    - **常用区间 (Common Ranges)**: `Today`, `Yesterday`, `This Week`, `Last Week`.
    - **绝对时间 (Absolute)**: 精确选择 `Start Time` 至 `End Time` (YYYY-MM-DD HH:mm:ss).
    - **相对时间 (Relative)**: 支持类似 Grafana 的语法 (e.g. `now-1h` to `now`).
- **交互逻辑**:
  1. 用户变更控件值 -> 更新 `Global Variables`.
  2. 引擎检测依赖该变量的 API Request.
  3. 自动触发相关组件的 `refresh` 动作.

---

## 3. 非功能需求 (Non-functional Requirements)

### 3.1 性能要求 (Performance)

- **渲染性能**:
  - 支持单页面 100+ 组件流畅运行，FPS > 30。
  - 大数据量图表（如折线图展现 10000+ 点）开启 Sampling 优化，避免浏览器卡死。
- **加载速度**: 首屏加载时间 < 2秒 (骨架屏优化)。
- **内存控制**: 长期运行（如挂在电视墙上 7x24h）不应出现内存泄漏 (Memory Leak)。

### 3.2 用户体验与交互 (UI/UX)

- **视觉风格**:
  - 默认提供 **深色模式 (Dark Mode)**，适合监控大屏场景。
  - 支持 **主题切换** (Theme): 科技蓝、暗夜黑、简约白。
- **操作体验**:
  - 组件拖拽提供 **智能吸附 (Snapping)** 和 **辅助线 (Guidelines)**。
  - 快捷键支持: Copy (Cmd+C), Paste (Cmd+V), Save (Cmd+S), Delete (Backspace)。
- **响应式设计**:
  - 画布支持 **Scale 缩放** 模式，确保在 1080P/2K/4K/超宽屏上均能完美铺满，文字不模糊。

### 3.3 扩展性 (Extensibility)

- **插件化架构**:
  - 支持开发者按照规范开发自定义组件 (Vue/React Component)，并动态打包上传 (UMD格式)。
  - 提供 CLI 工具辅助组件开发和调试。

### 3.4 安全性 (Security)

- **权限控制**:
  - **RBAC 模型**: 管理员 (增删改查)、编辑者 (仅编辑)、访问者 (仅查看)。
  - **数据脱敏**: 支持对敏感字段（如手机号、IP）进行掩码处理。
- **数据安全**: 数据源连接信息 (DB Password) 加密存储，前端仅透传 Query ID。

### 3.5 部署与运行环境 (Deployment & Environment)

- **运行环境**: 兼容 Chrome 80+, Edge, Firefox, Safari。
- **部署方式**: 支持 Docker 容器化部署，Kubernetes 集群部署。
- **监控自监控**: 引擎本身需提供 Metrics 接口 (Prometheus格式)，监控自身 QPS、报错率。

### 3.6 国际化支持 (Internationalization)

- **编辑器 i18n**: 引擎菜单、提示、配置项需支持中/英 (Zh/En) 切换。
- **看板内容 i18n**:
  - 支持在文本组件中使用 Translation Key (e.g. `{{ t('sales_title') }}`).
  - 提供全局字典配置入口，允许为不同语言定义文案。

---

## 4. 附录：组件样式配置字典 (Appendix: Component Style Dictionary)

本节列出核心组件支持的样式配置项，开发人员需将 GUI 配置项映射到底层图表库 (ECharts) 的对应字段。

### 4.0 完整单位支持列表 (Metric Unit Library)

在配置面板的 "Format" 选项中，需支持以下标准化单位。

#### A. 核心 IT 运维 (IT Ops)

- **数据容量 (Data)**:
  - `IEC Standard` (1024进制): `Bi`, `KiB`, `MiB`, `GiB`, `TiB`, `PiB`
  - `SI Standard` (1000进制): `B`, `KB`, `MB`, `GB`, `TB`, `PB`
- **速率 (Data Rate)**:
  - `bps` (bits/sec), `Kbps`, `Mbps`, `Gbps`
  - `Bps` (bytes/sec), `KB/s`, `MB/s`, `GB/s`
  - `pps` (packets/sec)
- **时间 (Time)**:
  - `ns`, `μs`, `ms`, `s`, `m`, `h`, `d`, `week`, `year`
  - `Humanize` (Smart Duration): 自动转换为适合阅读的格式 (e.g. "2d 5h")
- **吞吐与负载 (Throughput)**:
  - `rps` (req/s), `ops` (ops/s), `wps` (write/s), `iops`

#### B. 物理与环境 (Physics & Environment) - *IoT 场景*

- **电力 (Energy)**:
  - `W` (Watt), `kW`, `MW`
  - `V` (Volt), `A` (Ampere), `Ω` (Ohm)
  - `J` (Joule), `kWh` (千瓦时)
  - `Hz` (Hertz), `kHz`, `GHz`
- **环境传感器**:
  - **温度**: `°C` (Celsius), `°F` (Fahrenheit), `K` (Kelvin)
  - **压力**: `Pa`, `hPa`, `bar`, `psi`, `atm`
  - **长度**: `mm`, `m`, `km`
  - **质量**: `mg`, `g`, `kg`, `t`
  - **声压**: `dB`, `dBm`

#### C. 其他通用 (Misc)

- **算力 (Hash Rate)**: `H/s`, `KH/s`, `MH/s`, `TH/s`
- **货币 (Currency)**: `CNY`, `USD`, `EUR`, `JPY`, `BTC`
- **杂项**: `Percent (0-100)`, `Percent (0.0-1.0)`, `Pixels`, `Cells`

### 4.1 基础折线图 (Line Chart)

| 配置项 ID | GUI 显示名称 | 数据类型 | 默认值 | 备注 |
| :--- | :--- | :--- | :--- | :--- |
| `lineStyle.width` | 线宽 (Width) | Number | 2 | 单位 px |
| `lineStyle.color` | 线条颜色 | Color | #1890ff | 支持渐变色配置 |
| `lineStyle.type` | 线条类型 | Select | solid | 可选: solid, dashed, dotted |
| `smooth` | 平滑曲线 | Boolean | false | 是否平滑过渡 |
| `areaStyle.opacity` | 区域透明度 | Number | 0 | 0.0 - 1.0 (为 0 时不显示区域) |
| `symbolSize` | 数据点大小 | Number | 4 | 设为 0 可隐藏数据点 |

### 4.2 基础柱状图 (Bar Chart)

| 配置项 ID | GUI 显示名称 | 数据类型 | 默认值 | 备注 |
| :--- | :--- | :--- | :--- | :--- |
| `barWidth` | 柱条宽度 | Number | auto | 可设为具体像素值 (e.g. 20) |
| `itemStyle.borderRadius` | 圆角半径 | Number | 0 | 仅上方圆角 (Top-Left, Top-Right) |
| `label.show` | 显示数值 | Boolean | false | |
| `label.position` | 数值位置 | Select | top | 可选: top, inside, left, right |
| `stack` | 堆叠标识 | String | null | 相同 stack 值的系列会堆叠显示 |

### 4.3 饼图 (Pie Chart)

| 配置项 ID | GUI 显示名称 | 数据类型 | 默认值 | 备注 |
| :--- | :--- | :--- | :--- | :--- |
| `radius` | 半径范围 | Array | [0, '75%'] | [内径, 外径]。内径>0 为环形图 |
| `roseType` | 玫瑰图模式 | Select | false | 可选: false, radius, area |
| `label.show` | 显示标签 | Boolean | true | |
| `labelLine.length` | 引导线长度 | Number | 15 | 第一段引导线长度 |

### 4.4 仪表盘 (Gauge)

| 配置项 ID | GUI 显示名称 | 数据类型 | 默认值 | 备注 |
| :--- | :--- | :--- | :--- | :--- |
| `axisLine.lineStyle.width` | 轴线宽度 | Number | 30 | |
| `pointer.width` | 指针宽度 | Number | 6 | |
| `detail.fontSize` | 数值字号 | Number | 24 | 中间显示的数值大小 |
| `colorStops` | 颜色分段 | Array | - | e.g. `[[0.3, 'green'], [0.7, 'yellow'], [1, 'red']]` |

### 4.5 翻牌器 (Number Flipper)

> *非 ECharts 组件，为大屏专用自定义组件*

| 配置项 ID | GUI 显示名称 | 数据类型 | 默认值 | 备注 |
| :--- | :--- | :--- | :--- | :--- |
| `digit.fontSize` | 数字大小 | Number | 48 | px |
| `digit.bg` | 数字背景 | Color | #000 | 单个数字的背景色 |
| `digit.gap` | 数字间距 | Number | 4 | px |
| `animation.duration` | 滚动时长 | Number | 1000 | ms, 数据变化时的滚动与动画时间 |

---

## 5. 协议与存储设计 (Protocol & Schema Design)

### 5.1 总体数据结构 (DSL Root)

大屏配置以 JSON 格式存储，作为前后端交互的标准协议。

```json
{
  "version": "1.0.0",
  "meta": {
    "name": "监控大屏 A",
    "width": 1920,
    "height": 1080,
    "screenshot": "https://cdn/snap/1.png"
  },
  "global": {
    "theme": "dark",
    "vars": {
      "env": "prod",
      "refresh_interval": 30000
    }
  },
  "components": [
    // Array of Component Nodes
  ]
}
```

### 5.2 组件 Schema 设计 (Component Model)

每个组件节点包含 4 个核心部分：元数据、样式、数据、交互。

```json
{
  "id": "line_chart_123456",
  "type": "LineChart",
  "name": "核心指标趋势图",
  "layout": {
    "x": 100, "y": 200, "w": 400, "h": 300,
    "zIndex": 10,
    "group": null
  },
  "style": {
    // 对应 ECharts Option 或 CSS 属性
    "lineStyle": { "width": 2, "color": "#ff0000" },
    "smooth": true
  },
  "data": {
    "sourceType": "api", // static | api | variable
    "queryType": "sql", // sql | promql | json | simple
    "formatType": "timeSeries", // timeSeries | scalar | list
    "config": {
      // 模式 A: 简单 API 调用
      "url": "https://api.com/data",
      "method": "GET",
      
      // 模式 B: 语句查询 (SQL/PQL)
      "query": "SELECT * FROM metrics WHERE env='{{vars.env}}'",
      
      // 模式 C: 结构化查询 (DSL)
      "queryObj": {
        "from": "logs",
        "where": { "status": 500 }
      },
      
      "interval": 5000
    },
    // 支持配置 formatter
    "format": { "type": "storage", "decimal": 2 }, 
    "transform": "return data.list.map(...)" // 转换脚本
  },
  "events": [
    {
      "trigger": "click",
      "action": "open_url",
      "payload": { "url": "https://detail.com?id=${data.id}" }
    }
  ]
}
```

### 5.3 Schema 驱动的配置表单 (Schema-Driven Form)

为了保证系统的可扩展性，右侧**配置面板 (Property Panel)** 不应硬编码，而应根据组件定义的 **JSON Schema** 动态渲染。

- **实现方案**: 采用 `Formily` 或 `react-jsonschema-form`。
- **工作流**:
  1. 开发新组件 `MyChart`。
  2. 编写 `MyChart.schema.json` 定义有哪些配置项（如线宽、颜色）。
  3. 注册组件到引擎。
  4. 引擎运行时读取 Schema，自动在右侧生成对应的表单控件 (Input, Select, ColorPicker)。

### 5.4 Schema 高级校验与扩展 (Advanced Schema)

- **高级校验 (Validation)**:
  - 引入 **AJV** 库，支持完整的 JSON Schema Validator。
  - 支持 `pattern` (正则), `min/max` (数值范围), `dependencies` (字段依赖) 等高级校验规则。
- **自定义扩展 (Extensions)**:
  - `x-component`: 指定渲染组件 (e.g. `"x-component": "ColorPicker"`).
  - `x-reactions`: 定义字段间的联动逻辑 (e.g. 当 `type=dashed` 时显示 `dashOffset` 配置项)。
