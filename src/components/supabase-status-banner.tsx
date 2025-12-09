'use client';

import { useEffect, useState } from 'react';
import { getSupabaseStatus } from '@/lib/supabase';
import { Cloud, CloudOff, Settings } from 'lucide-react';

export function SupabaseStatusBanner() {
  const [status, setStatus] = useState<ReturnType<typeof getSupabaseStatus> | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setStatus(getSupabaseStatus());
  }, []);

  if (!status || !isVisible) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 ${
        status.configured
          ? 'bg-gradient-to-r from-green-500 to-emerald-600'
          : 'bg-gradient-to-r from-orange-500 to-amber-600'
      } text-white shadow-lg`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {status.configured ? (
            <Cloud className="w-5 h-5" />
          ) : (
            <CloudOff className="w-5 h-5" />
          )}
          <div>
            <p className="font-semibold text-sm">{status.message}</p>
            {!status.configured && status.instruction && (
              <p className="text-xs opacity-90 mt-0.5">{status.instruction}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!status.configured && (
            <button
              onClick={() => {
                alert('Para configurar o Supabase:\n\n1. Acesse as Configurações do Projeto\n2. Vá em Integrações\n3. Conecte sua conta Supabase\n\nOu forneça suas credenciais (URL e Anon Key) no chat que eu configuro automaticamente!');
              }}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 active:bg-white/40 px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer"
            >
              <Settings className="w-4 h-4" />
              Configurar
            </button>
          )}
          <button
            onClick={() => setIsVisible(false)}
            className="text-white/80 hover:text-white text-xl leading-none px-2"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
