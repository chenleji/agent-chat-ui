# 慧择保险智能体聊天界面

慧择保险智能体聊天界面是一个基于 Vite + React 的应用程序，它通过聊天界面实现与任何具有 `messages` 键的 LangGraph 服务器的对话功能。


## 设置

首先，克隆仓库，或运行 [`npx` 命令](https://www.npmjs.com/package/create-agent-chat-app)：

```bash
npx create-agent-chat-app
```

或者

```bash
git clone https://github.com/chenleji/agent-chat-ui.git

cd agent-chat-ui
```

安装依赖：

```bash
pnpm install
```

运行应用：

```bash
pnpm dev
```

应用将在 `http://localhost:5173` 上运行。

## 使用方法

当应用运行后（或使用已部署的网站），您需要输入以下信息：

- **部署 URL**：您想要与之对话的 LangGraph 服务器的 URL。这可以是生产环境或开发环境的 URL。
- **助手/图 ID**：图的名称，或用于通过聊天界面获取和提交运行的助手 ID。
- **LangSmith API 密钥**：（仅连接已部署的 LangGraph 服务器时需要）您的 LangSmith API 密钥，用于在向 LangGraph 服务器发送请求时进行身份验证。

输入这些值后，点击 `继续`。然后您将被重定向到聊天界面，在那里您可以开始与 LangGraph 服务器对话。
