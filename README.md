# ds-whale-ui 🐳

一只会在 DeepSeek Harness Web UI 里**游动**的鲸鱼运行指示器：会话思考/执行工具时，**DeepSeek 同款品牌鲸鱼**（官方 logo 矢量形状，品牌蓝 #4D6BFE）出现在**输入框上方**（取代内置的 "Deep diving..." 状态行），沿一条细水线左右巡游；任务结束时它跃出水面再潜入水下。

A swimming whale running indicator for the DeepSeek Harness Web UI: 🐳 appears **above the composer** (replacing the built-in "Deep diving..." status line) while the agent is thinking or running tools.

## 特性

- **位置**：注册进官方 `conversation.input.dock` 插槽——输入框正上方的整宽行，随会话存在/消失；内置 "Deep diving..." 状态行被插件隐藏，位置与无障碍语义（`role="status"` + `aria-live="polite"`）由鲸鱼接管
- **游动 + 喷水**：运行期间 🐳 沿水线左右巡游（始终面朝前进方向、上下轻浮），头顶持续喷出三颗错峰上升的水滴；执行工具时泳速加快、身后拖出尾迹气泡
- **阶段感知动画**：思考时慢速巡游；执行工具时提速+尾迹气泡+水线流光；成功结束跃出水面、出错下潜告别，随后整行淡出收起
- **进度联动**：当 Agent 发布了任务清单（`todos` projection，即 todo_write 的计划面板数据）时，鲸鱼的巡游区间随完成度向右扩展（18% 起步 → 100%），水线同步点亮为进度条——鲸鱼游多远 = Agent 干到哪了；hover chip 里也会显示 `已完成/总数`。没有清单时巡游全宽，不受影响
- **零打扰**：空闲时不渲染、不占任何高度；出现/消失带高度过渡动画；整行 `pointer-events: none`（仅 🐳 本体可悬停/点击），绝不遮挡阅读或输入
- **hover 气泡 chip**：悬停 🐳 显示阶段（思考中/执行工具/…）、运行时长（mm:ss）与运行中的工具数；运行 15 秒后右侧出现内联计时（与原状态行一致）
- **点击彩蛋**：点一下 🐳，它会即兴跃起
- **设置面板**（设置 → 鲸鱼指示器）：启用开关、动画强度（完整/节能——节能模式鲸鱼停靠左侧仅轻浮，无游动/喷水）、显示运行时长、强调色（蓝/粉/橙，作用于水线、水滴与 chip），设置持久化
- 纯 CSS 动画（transform/opacity/left），无运行时依赖

## 安装（本地开发）

```sh
# 1. 构建客户端 bundle
npm run build

# 2. 安装进 web profile（本地 link 安装）
dsh plugin --profile web add /absolute/path/to/ds-whale-ui

# 3. 重启 dsh web 生效
```

修改 `src/` 后重新 `npm run build`，浏览器刷新即可看到效果（bundle 以 `no-cache` 服务，HMR 自动 rehash）。

## 发布

DSH 插件使用 **pnpm / npm 包** 的方式分发，用户通过 `dsh plugin` CLI 安装。

### 方式一：发布到 npm（推荐正式发布）

```sh
# 确保 package.json 里的 name / version / files 正确
npm publish          # 公开包
# 或
npm publish --access public   # scope 包首次发布需要 --access public
```

用户安装：
```sh
dsh plugin --profile web add ds-whale-ui
# 重启 dsh web
```

### 方式二：GitHub 仓库（适合开发阶段/内部分享）

```sh
# 推送到 GitHub 仓库（确保有 build 产物或配置了 prepare script）
git init && git add -A && git commit -m "initial"
git remote add origin git@github.com:yourname/ds-whale-ui.git
git push -u origin main
```

用户安装：
```sh
dsh plugin --profile web add github:yourname/ds-whale-ui
# 重启 dsh web
```

> **注意**：GitHub 方式安装时 pnpm 不自动运行 `prepare` / `build` 脚本（安全限制）。需要在
> profile 目录的 `pnpm-workspace.yaml` 里加 `allowBuilds: ["ds-whale-ui"]`，或直接把构建产物
> （`client/` 目录）提交到仓库。

### 方式三：本地路径（当前使用）

```sh
dsh plugin --profile web add /absolute/path/to/ds-whale-ui
# 或使用相对路径
dsh plugin --profile web add ./ds-whale-ui
```

### 卸载

```sh
dsh plugin --profile web remove ds-whale-ui
# 重启 dsh web
```

### 发布检查清单

- [x] `package.json` 的 `name` 字段是你想要的包名
- [x] `"dsh": { "bundle": { "patch": "./cordis.patch.yml" } }` — 声明自己是 DSH bundle
- [x] `"files"` 字段包含 `index.js`、`client/`、`cordis.patch.yml`、`README.md`
- [x] `"exports"` 映射了 `.`（host）、`./client`（browser）、`./cordis.patch.yml`（patch layer）
- [x] `npm run build` 能成功生成 `client/client.js`
- [x] host 依赖（`@deepseek-ai/dsh-settings`、`@deepseek-ai/schemastery`）声明在 `dependencies`

## 实现

- Host 半（`index.js`）：注册持久化设置命名空间 `ds-whale-ui`（Schemastery schema：`enabled` / `intensity` / `showElapsed` / `color` / `customLogo`）
- 浏览器半（`client/client.js`）：注册进官方 `conversation.input.dock` 与 `settings.section` 插槽；运行状态全部取自标准 `useSession` selector（`running` / `partial` / `runningCalls` / `turnTimings` / `nodes`）+ `useProjection('todos')`（进度联动），不直接绑定任何内部 store
- 自定义形象：设置面板支持上传 PNG/JPEG/WebP/GIF/SVG（≤512KB），客户端缩放到 52px data URL 持久化到 `settings.yaml`，渲染时替换 SVG 品牌鲸鱼

## License

MIT
