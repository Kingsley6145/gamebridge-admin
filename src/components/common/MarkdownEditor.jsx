import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  Bold, Italic, Heading1, Heading2, Heading3, 
  List, ListOrdered, Code, Link, Image, Quote,
  Maximize2, Minimize2
} from 'lucide-react';
import { useThemeStore } from '../../styles/theme';

export const MarkdownEditor = ({
  value,
  onChange,
  placeholder = 'Start writing your markdown content...',
  label,
  required = false,
  error,
  className = ''
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editorValue, setEditorValue] = useState(value || '');
  const { theme } = useThemeStore();

  useEffect(() => {
    setEditorValue(value || '');
  }, [value]);

  const handleChange = (newValue) => {
    setEditorValue(newValue);
    onChange(newValue);
    // Auto-save to localStorage
    localStorage.setItem('markdown-draft', newValue);
  };

  const insertText = (before, after = '', placeholder = '') => {
    const textarea = document.querySelector('.markdown-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editorValue.substring(start, end);
    const textToInsert = before + (selectedText || placeholder) + after;
    
    const newValue = 
      editorValue.substring(0, start) + 
      textToInsert + 
      editorValue.substring(end);
    
    handleChange(newValue);
    
    // Set cursor position
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + before.length + (selectedText || placeholder).length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleKeyDown = (e) => {
    const textarea = e.target;
    const start = textarea.selectionStart;
    const value = editorValue;

    // Handle Enter key for bullet lists
    if (e.key === 'Enter') {
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const lineEnd = value.indexOf('\n', start);
      const currentLine = value.substring(lineStart, lineEnd === -1 ? value.length : lineEnd);
      
      // Check if current line is a bullet point
      if (currentLine.match(/^[\s]*[-*+]\s/)) {
        e.preventDefault();
        const indentMatch = currentLine.match(/^[\s]*/);
        const indent = indentMatch ? indentMatch[0] : '';
        const bullet = currentLine.match(/^[\s]*([-*+])/)?.[1] || '-';
        const newLine = `\n${indent}${bullet} `;
        
        const newValue = 
          value.substring(0, start) + 
          newLine + 
          value.substring(start);
        
        handleChange(newValue);
        
        setTimeout(() => {
          textarea.focus();
          const newPosition = start + newLine.length;
          textarea.setSelectionRange(newPosition, newPosition);
        }, 0);
      }
    }
  };

  const insertBulletList = () => {
    const textarea = document.querySelector('.markdown-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editorValue.substring(start, end);
    
    // If text is selected, wrap each line as a bullet point
    if (selectedText && selectedText.includes('\n')) {
      const lines = selectedText.split('\n').filter(line => line.trim());
      const bulletLines = lines.map(line => `- ${line.trim()}`).join('\n');
      const newValue = 
        editorValue.substring(0, start) + 
        bulletLines + 
        editorValue.substring(end);
      handleChange(newValue);
    } else {
      // Insert a single bullet point
      insertText('- ', '', 'List item');
    }
  };

  const toolbarButtons = [
    { icon: Bold, action: () => insertText('**', '**', 'bold text'), title: 'Bold' },
    { icon: Italic, action: () => insertText('*', '*', 'italic text'), title: 'Italic' },
    { icon: Heading1, action: () => insertText('# ', '', 'Heading 1'), title: 'Heading 1' },
    { icon: Heading2, action: () => insertText('## ', '', 'Heading 2'), title: 'Heading 2' },
    { icon: Heading3, action: () => insertText('### ', '', 'Heading 3'), title: 'Heading 3' },
    { icon: List, action: insertBulletList, title: 'Bullet List' },
    { icon: ListOrdered, action: () => insertText('1. ', '', 'Numbered item'), title: 'Numbered List' },
    { icon: Code, action: () => insertText('`', '`', 'code'), title: 'Inline Code' },
    { icon: Quote, action: () => insertText('> ', ''), title: 'Quote' },
    { icon: Link, action: () => insertText('[', '](url)', 'link text'), title: 'Link' },
    { icon: Image, action: () => insertText('![', '](url)', 'alt text'), title: 'Image' },
  ];

  const wordCount = editorValue.trim().split(/\s+/).filter(word => word.length > 0).length;
  const charCount = editorValue.length;

  return (
    <div className={`w-full ${className} ${isFullscreen ? 'fixed inset-0 z-50 bg-light-bg dark:bg-dark-bg' : ''}`}>
      {label && (
        <label className="block text-sm font-medium mb-2 text-light-text dark:text-dark-text">
          {label}
          {required && <span className="text-red ml-1">*</span>}
        </label>
      )}
      
      <div className={`
        border border-light-border dark:border-dark-border rounded-lg overflow-hidden
        ${isFullscreen ? 'h-full flex flex-col' : ''}
      `}>
        {/* Toolbar */}
        <div className="flex items-center justify-between p-2 border-b border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card">
          <div className="flex items-center gap-1">
            {toolbarButtons.map((button, index) => {
              const Icon = button.icon;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={button.action}
                  className="p-2 hover:bg-light-border dark:hover:bg-dark-border rounded transition-colors"
                  title={button.title || Icon.name}
                >
                  <Icon className="w-4 h-4 text-light-text dark:text-dark-text" />
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
              {wordCount} words • {charCount} chars
            </span>
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-light-border dark:hover:bg-dark-border rounded transition-colors"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4 text-light-text dark:text-dark-text" />
              ) : (
                <Maximize2 className="w-4 h-4 text-light-text dark:text-dark-text" />
              )}
            </button>
          </div>
        </div>

        {/* Editor and Preview */}
        <div className={`
          flex ${isFullscreen ? 'flex-1' : 'h-96'}
          bg-light-card dark:bg-dark-card
        `}>
          {/* Editor */}
          <div className="flex-1 flex flex-col border-r border-light-border dark:border-dark-border">
            <textarea
              className="markdown-textarea flex-1 w-full p-4 resize-none focus:outline-none bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text font-mono text-sm"
              value={editorValue}
              onChange={(e) => handleChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
            />
          </div>

          {/* Preview */}
          <div className="flex-1 overflow-y-auto p-4 bg-light-bg dark:bg-dark-bg">
            {editorValue.trim() ? (
              <div className="markdown-content prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={theme === 'dark' ? vscDarkPlus : oneLight}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {editorValue}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-light-textSecondary dark:text-dark-textSecondary italic">
                Preview will appear here...
              </p>
            )}
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red">{error}</p>
      )}
    </div>
  );
};

