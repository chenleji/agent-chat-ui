/**
 * HumanInterrupt调试指南
 * 
 * 我们已经在以下关键位置添加了调试日志：
 * 
 * 1. isAgentInboxInterruptSchema函数 - 验证接收到的interrupt是否符合预期格式
 *    - 日志前缀: "HumanInterrupt验证"
 * 
 * 2. AssistantMessage组件 - 检查interrupt状态和渲染条件
 *    - 日志前缀: "Interrupt检测详情" 和 "渲染ThreadView组件"/"渲染GenericInterruptView组件"
 * 
 * 3. useInterruptedActions钩子 - 处理用户对interrupt的响应
 *    - 日志前缀: "resumeRun" 和 "handleSubmit"
 * 
 * 如何使用这些日志进行调试：
 * 
 * 1. 打开浏览器开发者工具 (F12 或 右键 -> 检查)
 * 2. 切换到Console选项卡
 * 3. 在Console过滤器中输入以下关键词来查看特定日志:
 *    - "HumanInterrupt验证" - 查看interrupt结构验证过程
 *    - "Interrupt检测" - 查看interrupt的检测和渲染逻辑
 *    - "resumeRun" - 查看响应提交流程
 *    - "handleSubmit" - 查看用户提交处理流程
 * 
 * 调试HumanInterrupt问题的常见步骤：
 * 
 * 1. 检查是否接收到正确格式的interrupt (查看 "HumanInterrupt验证" 日志)
 * 2. 检查interrupt是否被正确识别 (查看 "Interrupt检测详情" 日志)
 * 3. 验证interrupt的渲染条件 (检查 isLastMessage 和 isValidSchema 字段)
 * 4. 监控用户响应的处理流程 (查看 "handleSubmit" 和 "resumeRun" 日志)
 * 
 * 注意: 以上日志仅用于开发环境，在生产环境中应当移除或禁用这些详细日志。
 */

export const enableDebugLogging = true;

// 可以扩展这个文件，添加更多日志工具函数 