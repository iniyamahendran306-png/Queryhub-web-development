import React from 'react';

export default function MarkdownRenderer({ content }) {
  if (!content) return null;

  // Split by code blocks: ```
  const codeBlockRegex = /```([\s\S]*?)```/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: content.substring(lastIndex, match.index)
      });
    }
    // Add code block
    parts.push({
      type: 'code-block',
      content: match[1]
    });
    lastIndex = codeBlockRegex.lastIndex;
  }

  if (lastIndex < content.length) {
    parts.push({
      type: 'text',
      content: content.substring(lastIndex)
    });
  }

  // Parse inline text rules (bold, inline code)
  const parseInline = (text) => {
    // Regex for inline code: `code`
    // Regex for bold: **text**
    const inlineRegex = /(\*\*.*?\*\*|`.*?`)/g;
    const inlineParts = text.split(inlineRegex);

    return inlineParts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={index}>{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  // Render the parsed parts
  return (
    <div className="md-content">
      {parts.map((part, idx) => {
        if (part.type === 'code-block') {
          // Extract language if specified on the first line
          const lines = part.content.split('\n');
          let codeText = part.content;
          let lang = '';

          if (lines.length > 0 && lines[0].trim() && !lines[0].includes(' ') && lines[0].length < 15) {
            lang = lines[0].trim();
            codeText = lines.slice(1).join('\n');
          }

          return (
            <pre key={idx} style={{ position: 'relative' }}>
              {lang && (
                <span style={{
                  position: 'absolute',
                  top: '6px',
                  right: '12px',
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  letterSpacing: '0.05em'
                }}>
                  {lang}
                </span>
              )}
              <code>{codeText.trim()}</code>
            </pre>
          );
        } else {
          // Split by paragraphs (double newlines) or line breaks
          const paragraphs = part.content.split('\n\n');
          return paragraphs.map((para, pIdx) => {
            if (!para.trim()) return null;
            
            // Check for list items
            if (para.trim().startsWith('- ') || para.trim().startsWith('* ')) {
              const items = para.split(/\n[-*]\s+/);
              return (
                <ul key={`${idx}-${pIdx}`} style={{ margin: '12px 0 12px 20px' }}>
                  {items.map((item, iIdx) => {
                    const cleanItem = iIdx === 0 ? item.replace(/^[-*]\s+/, '') : item;
                    if (!cleanItem.trim()) return null;
                    return <li key={iIdx}>{parseInline(cleanItem)}</li>;
                  })}
                </ul>
              );
            }

            // Check for ordered list items
            if (/^\d+\.\s+/.test(para.trim())) {
              const items = para.split(/\n\d+\.\s+/);
              return (
                <ol key={`${idx}-${pIdx}`} style={{ margin: '12px 0 12px 20px' }}>
                  {items.map((item, iIdx) => {
                    const cleanItem = iIdx === 0 ? item.replace(/^\d+\.\s+/, '') : item;
                    if (!cleanItem.trim()) return null;
                    return <li key={iIdx}>{parseInline(cleanItem)}</li>;
                  })}
                </ol>
              );
            }

            // Check for headers (e.g. ### Header)
            if (para.trim().startsWith('### ')) {
              return <h4 key={`${idx}-${pIdx}`} style={{ fontSize: '16px', margin: '18px 0 8px 0', color: 'var(--text-primary)' }}>{parseInline(para.trim().substring(4))}</h4>;
            }
            if (para.trim().startsWith('## ')) {
              return <h3 key={`${idx}-${pIdx}`} style={{ fontSize: '18px', margin: '22px 0 10px 0', color: 'var(--text-primary)' }}>{parseInline(para.trim().substring(3))}</h3>;
            }

            // Fallback to normal paragraph
            return (
              <p key={`${idx}-${pIdx}`} style={{ marginBottom: '12px', whiteSpace: 'pre-wrap' }}>
                {parseInline(para)}
              </p>
            );
          });
        }
      })}
    </div>
  );
}
