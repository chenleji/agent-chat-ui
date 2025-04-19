import type { Message } from "@langchain/langgraph-sdk";

export function getContentString(content: Message["content"]): string {
  if (typeof content === "string") return content;
  const texts = content
    .filter((c): c is { type: "text"; text: string } => c.type === "text")
    .map((c) => c.text);
  return texts.join(" ");
}

/**
 * 从消息中提取思考内容(reasoning_content)
 * 
 * @param message AI消息
 * @returns 思考内容字符串，如果不存在则返回空字符串
 */
export function getReasoningContent(message: Message | undefined): string {
  if (!message) return '';
  
  // 检查消息是否有additional_kwargs字段
  if (message && 'additional_kwargs' in message) {
    const additionalKwargs = message.additional_kwargs as Record<string, any> | undefined;
    if (additionalKwargs && 'reasoning_content' in additionalKwargs) {
      return additionalKwargs.reasoning_content as string;
    }
  }
  
  return '';
}
