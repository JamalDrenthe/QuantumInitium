import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#05070d] text-[#f5f5f7] flex items-center justify-center p-4 selection:bg-[#0071e3]">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full bg-[#0071e3]/15 blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-lg w-full bg-[#0c121e]/90 border border-white/12 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {this.props.fallbackTitle || 'Weergave herstellen'}
              </h2>
              <p className="text-sm text-[#86868b] leading-relaxed">
                Er is een onverwachte fout opgetreden bij het laden van deze interface. Klik op onderstaande knop om de weergave te vernieuwen.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 text-left overflow-x-auto text-xs font-mono text-rose-300">
                <span className="font-bold text-rose-400">Fout: </span>
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-white text-black font-semibold text-xs hover:bg-[#f5f5f7] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <RefreshCw className="w-4 h-4 text-[#0071e3]" />
                <span>Pagina Vernieuwen</span>
              </button>

              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/10 text-white font-semibold text-xs border border-white/15 hover:bg-white/15 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4 text-slate-300" />
                <span>Terug naar Hoofdpagina</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
