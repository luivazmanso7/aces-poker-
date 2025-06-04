import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;

  // Rotas que requerem autenticação
  const protectedRoutes = ['/dashboard', '/torneios', '/jogadores', '/temporadas', '/galeria'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Validação básica do formato do token JWT
  const isValidTokenFormat = (token: string): boolean => {
    try {
      const parts = token.split('.');
      return parts.length === 3 && parts.every(part => part.length > 0);
    } catch {
      return false;
    }
  };

  // Se está tentando acessar uma rota protegida
  if (isProtectedRoute) {
    if (!token || !isValidTokenFormat(token)) {
      // Token inválido ou ausente - redirecionar para login
      const response = NextResponse.redirect(new URL('/login', request.url));
      
      // Limpar cookie inválido se existir
      if (token) {
        response.cookies.set('auth-token', '', {
          expires: new Date(0),
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
      }
      
      return response;
    }
  }

  // Se está logado e tentando acessar a página de login, redireciona para o dashboard
  if (pathname === '/login' && token && isValidTokenFormat(token)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redireciona a raiz para o dashboard se estiver logado, senão para login
  if (pathname === '/') {
    if (token && isValidTokenFormat(token)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Adicionar headers de segurança a todas as respostas
  const response = NextResponse.next();
  
  // Headers de segurança adicionais
  response.headers.set('X-DNS-Prefetch-Control', 'off');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
