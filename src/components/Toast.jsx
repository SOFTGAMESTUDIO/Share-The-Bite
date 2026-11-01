import React from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border transition-all duration-300 transform translate-y-0 ${
              isSuccess
                ? 'bg-white border-emerald-500 text-emerald-950 shadow-emerald-900/10'
                : isError
                ? 'bg-white border-rose-500 text-rose-950 shadow-rose-900/10'
                : isWarning
                ? 'bg-white border-amber-500 text-amber-950 shadow-amber-900/10'
                : 'bg-white border-blue-500 text-slate-900 shadow-slate-900/10'
            }`}
          >
            <div className="mt-0.5 flex-shrink-0">
              {isSuccess && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
              {isError && <XCircle className="h-5 w-5 text-rose-600" />}
              {isWarning && <AlertTriangle className="h-5 w-5 text-amber-600" />}
              {!isSuccess && !isError && !isWarning && <Info className="h-5 w-5 text-blue-600" />}
            </div>

            <div className="flex-1 min-w-0">
              {toast.title && <h5 className="text-sm font-bold leading-tight">{toast.title}</h5>}
              <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-gray-400 hover:text-gray-600 p-1 -mr-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

