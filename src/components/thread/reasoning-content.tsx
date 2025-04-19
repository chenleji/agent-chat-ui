"use client";

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { MarkdownText } from './markdown-text';
import { cn } from '@/lib/utils';

interface ReasoningContentProps {
  content: string;
  isCollapsible?: boolean;
  initiallyExpanded?: boolean;
}

/**
 * 渲染LLM思考过程的组件，支持折叠/展开功能
 */
export function ReasoningContent({
  content,
  isCollapsible = true,
  initiallyExpanded = false
}: ReasoningContentProps) {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

  // 如果没有内容，不渲染任何东西
  if (!content) return null;

  return (
    <div className="mb-4 relative">
      {/* 思考过程标题和折叠按钮 */}
      {isCollapsible && (
        <div 
          className="flex items-center gap-1 mb-1 text-sm text-gray-500 cursor-pointer hover:text-gray-700"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          <span className="font-medium">思考过程</span>
        </div>
      )}

      {/* 思考内容 */}
      <div className={cn(
        "bg-gray-50 dark:bg-gray-800/30 rounded-md p-3 text-gray-500 dark:text-gray-400 text-sm transition-all",
        isCollapsible && !isExpanded && "hidden",
        isCollapsible && isExpanded && "block"
      )}>
        <MarkdownText>{content}</MarkdownText>
      </div>
    </div>
  );
} 