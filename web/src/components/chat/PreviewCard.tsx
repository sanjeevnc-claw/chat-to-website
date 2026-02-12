'use client';

import { useState, useMemo } from 'react';
import { ExternalLink, RefreshCw, Monitor, Smartphone, Tablet, Code, Eye, Copy, Check, Download } from 'lucide-react';

interface PreviewCardProps {
  url: string;
  code?: Map<string, string>;
}

type ViewMode = 'desktop' | 'tablet' | 'mobile';
type Tab = 'preview' | 'code';

export function PreviewCard({ url, code }: PreviewCardProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [activeTab, setActiveTab] = useState<Tab>('preview');
  const [activeFile, setActiveFile] = useState<string>('app/page.tsx');
  const [copied, setCopied] = useState(false);

  const viewModeConfig = {
    desktop: { width: '100%', icon: Monitor },
    tablet: { width: '768px', icon: Tablet },
    mobile: { width: '375px', icon: Smartphone },
  };

  const files = useMemo(() => {
    if (!code) return [];
    return Array.from(code.keys());
  }, [code]);

  const previewHtml = useMemo(() => {
    if (!code) return '';
    
    // Get the page content
    const pageCode = code.get('app/page.tsx') || code.get('page.tsx') || '';
    const globalCss = code.get('app/globals.css') || code.get('globals.css') || '';
    
    // Create a simple HTML preview
    // In production, we'd use a proper sandboxed iframe or deploy to Vercel
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    ${globalCss}
    body { font-family: system-ui, sans-serif; }
  </style>
</head>
<body>
  <div id="preview-note" style="background: #3b82f6; color: white; padding: 8px 16px; font-size: 14px; text-align: center;">
    📱 Live Preview - This is how your website will look
  </div>
  <div id="app">
    <!-- Simplified preview - actual site would be rendered properly -->
    <div style="padding: 20px;">
      <pre style="background: #f3f4f6; padding: 20px; border-radius: 8px; overflow: auto; font-size: 12px;">
Website code generated! 

Deploy to see the full interactive version.

Files created:
${files.map(f => `• ${f}`).join('\n')}
      </pre>
    </div>
  </div>
</body>
</html>`;
  }, [code, files]);

  const copyCode = async () => {
    if (!code) return;
    const currentCode = code.get(activeFile) || '';
    await navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadAll = () => {
    if (!code) return;
    
    // Create a simple zip-like text file with all code
    let content = '// CHAT TO WEBSITE - GENERATED CODE\n';
    content += '// Copy each section to the corresponding file\n\n';
    
    code.forEach((fileContent, fileName) => {
      content += `// ========== ${fileName} ==========\n`;
      content += fileContent;
      content += '\n\n';
    });
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'website-code.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
              activeTab === 'preview' 
                ? 'bg-background shadow-sm' 
                : 'hover:bg-background/50'
            }`}
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
              activeTab === 'code' 
                ? 'bg-background shadow-sm' 
                : 'hover:bg-background/50'
            }`}
          >
            <Code className="w-4 h-4" />
            Code
          </button>
        </div>

        {activeTab === 'code' && (
          <div className="flex items-center gap-2">
            <button
              onClick={copyCode}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              title="Copy code"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={downloadAll}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              title="Download all files"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
            {(Object.keys(viewModeConfig) as ViewMode[]).map((mode) => {
              const Icon = viewModeConfig[mode].icon;
              return (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === mode 
                      ? 'bg-background shadow-sm' 
                      : 'hover:bg-background/50'
                  }`}
                  title={mode.charAt(0).toUpperCase() + mode.slice(1)}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {activeTab === 'preview' ? (
        <>
          {/* URL bar */}
          <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg mb-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <div className="flex-1 text-sm text-muted-foreground truncate">
              your-website.vercel.app
            </div>
          </div>

          {/* Preview iframe */}
          <div className="flex-1 bg-muted rounded-lg overflow-hidden flex items-start justify-center p-4">
            <div 
              className="bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300"
              style={{ 
                width: viewModeConfig[viewMode].width,
                height: viewMode === 'desktop' ? '100%' : viewMode === 'tablet' ? '600px' : '667px',
                maxWidth: '100%',
              }}
            >
              {code ? (
                <iframe
                  srcDoc={previewHtml}
                  className="w-full h-full border-0"
                  title="Website preview"
                  sandbox="allow-scripts"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Monitor className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Preview Loading...</h3>
                    <p className="text-sm text-gray-500 max-w-xs">
                      Your website preview will appear here once generated.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* File tabs */}
          <div className="flex gap-1 mb-4 overflow-x-auto pb-2">
            {files.map((file) => (
              <button
                key={file}
                onClick={() => setActiveFile(file)}
                className={`px-3 py-1.5 rounded-md text-sm whitespace-nowrap transition-colors ${
                  activeFile === file 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {file.split('/').pop()}
              </button>
            ))}
          </div>

          {/* Code viewer */}
          <div className="flex-1 bg-[#1e1e1e] rounded-lg overflow-auto">
            <pre className="p-4 text-sm text-gray-300 font-mono">
              <code>{code?.get(activeFile) || '// No code yet'}</code>
            </pre>
          </div>
        </>
      )}

      {/* Deploy button */}
      {code && (
        <button className="mt-4 w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
          <ExternalLink className="w-4 h-4" />
          Deploy to Vercel
        </button>
      )}
    </div>
  );
}
