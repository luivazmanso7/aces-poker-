'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/auth-context';

interface SecurityMonitorProps {
  children: React.ReactNode;
}

export default function SecurityMonitor({ children }: SecurityMonitorProps) {
  const { logout } = useAuth();

  useEffect(() => {
    // Monitorar tentativas de acesso malicioso
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Usuário saiu da aba - pode ser suspeito em contexto administrativo
        // Em produção, poderia logar esta ação
      }
    };

    // Detectar tentativas de abertura do DevTools
    const detectDevTools = () => {
      const devtools = {
        open: false,
        orientation: null as string | null
      };

      setInterval(() => {
        if (window.outerHeight - window.innerHeight > 160 || 
            window.outerWidth - window.innerWidth > 160) {
          if (!devtools.open) {
            devtools.open = true;
            // Em produção, poderia mostrar aviso ou logout automático
            if (process.env.NODE_ENV === 'production') {
              console.warn('Ferramentas de desenvolvedor detectadas em ambiente de produção');
            }
          }
        } else {
          devtools.open = false;
        }
      }, 500);
    };

    // Prevenir clique direito em produção
    const handleContextMenu = (e: MouseEvent) => {
      if (process.env.NODE_ENV === 'production') {
        e.preventDefault();
        return false;
      }
    };

    // Prevenir algumas teclas de atalho em produção
    const handleKeyDown = (e: KeyboardEvent) => {
      if (process.env.NODE_ENV === 'production') {
        // Bloquear F12, Ctrl+Shift+I, Ctrl+Shift+C, etc.
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C')) ||
            (e.ctrlKey && e.key === 'u')) { // Ctrl+U (view source)
          e.preventDefault();
          return false;
        }
      }
    };

    // Detectar inatividade prolongada
    let inactivityTimer: NodeJS.Timeout;
    const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutos

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        // Logout automático por inatividade
        logout();
      }, INACTIVITY_TIMEOUT);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    // Adicionar event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    
    // Monitorar atividade do usuário
    events.forEach(event => {
      document.addEventListener(event, resetInactivityTimer, true);
    });

    // Iniciar timer de inatividade
    resetInactivityTimer();

    // Detectar DevTools apenas em produção
    if (process.env.NODE_ENV === 'production') {
      detectDevTools();
    }

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      
      events.forEach(event => {
        document.removeEventListener(event, resetInactivityTimer, true);
      });
      
      clearTimeout(inactivityTimer);
    };
  }, [logout]);

  return <>{children}</>;
}
