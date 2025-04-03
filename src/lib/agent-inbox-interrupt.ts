import { HumanInterrupt } from "@langchain/langgraph/prebuilt";

export function isAgentInboxInterruptSchema(
  value: unknown,
): value is HumanInterrupt | HumanInterrupt[] {
  const valueAsObject = Array.isArray(value) ? value[0] : value;
  
  console.log("HumanInterrupt验证 - 接收到的值类型:", typeof valueAsObject, "是数组:", Array.isArray(value));
  
  if (!valueAsObject) {
    console.log("HumanInterrupt验证失败 - 值为空");
    return false;
  }
  
  const hasActionRequest = "action_request" in valueAsObject;
  const actionRequestIsObject = hasActionRequest && typeof valueAsObject.action_request === "object";
  
  if (hasActionRequest && actionRequestIsObject) {
    console.log("HumanInterrupt验证 - action_request:", JSON.stringify(valueAsObject.action_request, null, 2));
  } else {
    console.log("HumanInterrupt验证失败 - action_request不存在或不是对象");
  }
  
  const hasConfig = "config" in valueAsObject;
  const configIsObject = hasConfig && typeof valueAsObject.config === "object";
  
  if (hasConfig && configIsObject) {
    const config = valueAsObject.config as Record<string, any>;
    console.log("HumanInterrupt验证 - config:", {
      allow_respond: config.allow_respond,
      allow_accept: config.allow_accept,
      allow_edit: config.allow_edit,
      allow_ignore: config.allow_ignore
    });
  } else {
    console.log("HumanInterrupt验证失败 - config不存在或不是对象");
  }
  
  const result = (
    valueAsObject &&
    "action_request" in valueAsObject &&
    typeof valueAsObject.action_request === "object" &&
    "config" in valueAsObject &&
    typeof valueAsObject.config === "object" &&
    "allow_respond" in valueAsObject.config &&
    "allow_accept" in valueAsObject.config &&
    "allow_edit" in valueAsObject.config &&
    "allow_ignore" in valueAsObject.config
  );
  
  console.log("HumanInterrupt验证结果:", result);
  return result;
}
