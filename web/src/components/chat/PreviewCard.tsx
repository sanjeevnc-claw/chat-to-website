'use client';

import { useState } from 'react';
import { ExternalLink, RefreshCw, Monitor, Smartphone, Tablet } from 'lucide-react';

interface PreviewCardProps {
  url: string;
}

type ViewMode = 'desktop' | 'tablet' | 'mobile';

export function PreviewCard({ url }: PreviewCardProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [refreshKey, setRefreshKey] = useState(0);

  const viewModeConfig = {
    desktop: { width: '100%', icon: Monitor },
    tablet: { width: '768px', icon: Tablet },
    mobile: { width: '375px', icon: Smartphone },
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
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

        <div className="flex items-center gap-2">
          <button
            onClick={() => setRefreshKey(prev => prev + 1)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Refresh preview"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Open
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* URL bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg mb-4">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/50" />
        </div>
        <div className="flex-1 text-sm text-muted-foreground truncate">
          {url}
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
          {/* Placeholder for iframe - in real implementation, this would be an actual iframe */}
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Monitor className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Preview Loading...</h3>
              <p className="text-sm text-gray-500 max-w-xs">
                Your website preview will appear here once generated.
              </p>
              <p className="text-xs text-gray-400 mt-4">
                {url}
              </p>
            </div>
          </div>
          
          {/* Real iframe would be:
          <iframe 
            key={refreshKey}
            src={url}
            className="w-full h-full border-0"
            title="Website preview"
          />
          */}
        </div>
      </div>
    </div>
  );
}
