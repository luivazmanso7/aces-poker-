'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Container,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff, Lock, Person, Shield } from '@mui/icons-material';

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{email?: string, password?: string}>({});
  
  const { login } = useAuth();
  const router = useRouter();

  // Validação de entrada
  const validateForm = () => {
    const errors: {email?: string, password?: string} = {};
    
    // Validar email
    if (!credentials.email) {
      errors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      errors.email = 'Email deve ter formato válido';
    }
    
    // Validar senha
    if (!credentials.password) {
      errors.password = 'Senha é obrigatória';
    } else if (credentials.password.length < 6) {
      errors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validar formulário antes de enviar
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      await login(credentials.email.trim(), credentials.password);
      router.push('/dashboard');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpar erro do campo quando usuario começar a digitar
    if (fieldErrors[field as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #111827 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(124, 45, 18, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(55, 65, 81, 0.2) 0%, transparent 50%)
          `,
          zIndex: 1,
        },
      }}
      className="animate-fadeIn"
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
        <Card
          elevation={0}
          sx={{
            background: 'linear-gradient(145deg, rgba(30, 30, 30, 0.9) 0%, rgba(42, 42, 42, 0.9) 100%)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: 3,
            overflow: 'hidden',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(135deg, #7c2d12 0%, #f59e0b 50%, #fbbf24 100%)',
            },
          }}
          className="glass-effect animate-slideInUp"
        >
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box textAlign="center" mb={4}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7c2d12 0%, #f59e0b 100%)',
                  mb: 3,
                  boxShadow: '0 8px 32px rgba(245, 158, 11, 0.3)',
                }}
              >
                <Shield sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                ACES POKER
              </Typography>
              
              <Typography
                variant="subtitle1"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 500,
                }}
              >
                Painel Administrativo
              </Typography>
            </Box>

        

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit}>
              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    background: 'linear-gradient(135deg, rgba(211, 47, 47, 0.1) 0%, rgba(244, 67, 54, 0.1) 100%)',
                    border: '1px solid rgba(244, 67, 54, 0.3)',
                    color: '#ff6b6b',
                    '& .MuiAlert-icon': {
                      color: '#ff6b6b',
                    },
                  }}
                >
                  {error}
                </Alert>
              )}

              <TextField
                fullWidth
                label="Email"
                type="email"
                value={credentials.email}
                onChange={handleChange('email')}
                error={!!fieldErrors.email}
                helperText={fieldErrors.email}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: 'rgba(245, 158, 11, 0.7)' }} />
                    </InputAdornment>
                  ),
                }}
                required
              />

              <TextField
                fullWidth
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={handleChange('password')}
                error={!!fieldErrors.password}
                helperText={fieldErrors.password}
                sx={{ mb: 4 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: 'rgba(245, 158, 11, 0.7)' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: 'rgba(245, 158, 11, 0.7)' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                required
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  height: 56,
                  background: 'linear-gradient(135deg, #7c2d12 0%, #f59e0b 100%)',
                  boxShadow: '0 8px 32px rgba(245, 158, 11, 0.3)',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #8b3a1f 0%, #f6a310 100%)',
                    boxShadow: '0 12px 40px rgba(245, 158, 11, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  '&:active': {
                    transform: 'translateY(0px)',
                  },
                  '&:disabled': {
                    background: 'rgba(245, 158, 11, 0.3)',
                    color: 'rgba(255, 255, 255, 0.5)',
                  },
                }}
                startIcon={loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : undefined}
              >
                {loading ? 'Autenticando...' : 'Entrar'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Footer */}
        <Box textAlign="center" mt={4}>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontWeight: 500,
            }}
          >
            © 2024 ACES POKER - Administração
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
