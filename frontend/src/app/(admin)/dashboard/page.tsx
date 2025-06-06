'use client';

import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  Button,
  Alert,
  LinearProgress,
  Card,
  CardContent,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Plus,
  Zap,
  Trophy,
  RefreshCw,
  Database,
  Wifi,
} from 'lucide-react';
import { dashboardService, type DashboardStatistics } from '@/services/dashboard.service';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [stats, setStats] = useState<DashboardStatistics | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Carregar estatísticas
  const loadStatistics = async () => {
    try {
      setError('');
      const data = await dashboardService.getStatistics();
      setStats(data);
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
      setError('Erro ao carregar estatísticas do dashboard');
    } finally {
      setDataLoading(false);
    }
  };

  // Atualizar estatísticas
  const refreshStatistics = async () => {
    setRefreshing(true);
    await loadStatistics();
    setRefreshing(false);
  };

  // Simular carregamento inicial + carregar dados reais
  useEffect(() => {
    const initializeDashboard = async () => {
      // Simular carregamento da interface
      setTimeout(() => {
        setLoading(false);
      }, 800);

      // Carregar dados reais
      await loadStatistics();
    };

    initializeDashboard();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
        className="animate-fadeInUp"
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            background: 'linear-gradient(145deg, rgba(30, 30, 30, 0.8) 0%, rgba(42, 42, 42, 0.8) 100%)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            borderRadius: 3,
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 600,
              }}
            >
              Carregando ACES POKER Dashboard...
            </Typography>
          </Box>
          <LinearProgress
            sx={{
              width: 250,
              height: 6,
              borderRadius: 3,
              backgroundColor: 'rgba(245, 158, 11, 0.2)',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(135deg, #7c2d12 0%, #f59e0b 100%)',
                borderRadius: 3,
              },
            }}
          />
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }} className="animate-fadeInUp">
      {/* Header */}
      <Box mb={4}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #7c2d12 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          Dashboard ACES POKER
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontWeight: 500,
          }}
        >
          Painel de Controle Administrativo
        </Typography>
      </Box>

      {/* Status Alert */}
      <Alert
        severity="success"
        sx={{
          mb: 4,
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          color: '#22c55e',
          '& .MuiAlert-icon': {
            color: '#22c55e',
          },
        }}
        icon={<Wifi />}
      >
        <Typography sx={{ fontWeight: 600 }}>
          Sistema Online - Todas as funcionalidades ativas
        </Typography>
      </Alert>

      {/* Cards de Status em CSS Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
          mb: 4,
        }}
      >
        {/* Status do Sistema */}
        <Card
          className="glass-effect card-hover"
          sx={{
            background: 'linear-gradient(145deg, rgba(30, 30, 30, 0.9) 0%, rgba(42, 42, 42, 0.9) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #7c2d12 0%, #f59e0b 100%)',
                  mr: 2,
                }}
              >
                <Database size={24} color="white" />
              </Box>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                Status do Sistema
              </Typography>
            </Box>

            <Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Banco de Dados
                </Typography>
                <Chip
                  label="Online"
                  size="small"
                  sx={{
                    background: 'rgba(34, 197, 94, 0.2)',
                    color: '#22c55e',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    cursor: 'default',
                    '&:hover': {
                      background: 'rgba(34, 197, 94, 0.2)',
                    },
                  }}
                />
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  API Backend
                </Typography>
                <Chip
                  label="Ativo"
                  size="small"
                  sx={{
                    background: 'rgba(34, 197, 94, 0.2)',
                    color: '#22c55e',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    cursor: 'default',
                    '&:hover': {
                      background: 'rgba(34, 197, 94, 0.2)',
                    },
                  }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Estatísticas Rápidas */}
        <Card
          className="glass-effect card-hover"
          sx={{
            background: 'linear-gradient(145deg, rgba(30, 30, 30, 0.9) 0%, rgba(42, 42, 42, 0.9) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #7c2d12 0%, #f59e0b 100%)',
                  mr: 2,
                }}
              >
                <Trophy size={24} color="white" />
              </Box>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                Estatísticas
              </Typography>
              {refreshing && (
                <CircularProgress size={16} sx={{ ml: 1, color: '#f59e0b' }} />
              )}
            </Box>

            <Box>
              {dataLoading ? (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <CircularProgress size={24} sx={{ color: '#f59e0b' }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 1 }}>
                    Carregando estatísticas...
                  </Typography>
                </Box>
              ) : error ? (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="body2" sx={{ color: '#ef4444', mb: 1 }}>
                    {error}
                  </Typography>
                  <Button
                    size="small"
                    onClick={refreshStatistics}
                    disabled={refreshing}
                    sx={{ color: '#f59e0b', textTransform: 'none' }}
                  >
                    Tentar novamente
                  </Button>
                </Box>
              ) : stats ? (
                <>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Torneios Ativos
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#f59e0b', fontWeight: 600 }}>
                      {stats.torneiosAtivos}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Jogadores Cadastrados
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#f59e0b', fontWeight: 600 }}>
                      {dashboardService.formatNumber(stats.totalJogadores)}
                    </Typography>
                  </Box>
                  {stats.temporadaAtual && (
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Temporada Atual
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#f59e0b', fontWeight: 600 }}>
                        {stats.temporadaAtual.torneiosRealizados}/{stats.temporadaAtual.totalTorneios}
                      </Typography>
                    </Box>
                  )}
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Jogadores Ativos
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#f59e0b', fontWeight: 600 }}>
                      {dashboardService.formatNumber(stats.jogadoresAtivos)}
                    </Typography>
                  </Box>
                </>
              ) : (
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Nenhuma estatística disponível
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Ações Rápidas */}
      <Box mb={4}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: 'white',
            mb: 3,
          }}
        >
          Ações Rápidas
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            startIcon={<Plus />}
            sx={{
              background: 'linear-gradient(135deg, #7c2d12 0%, #f59e0b 100%)',
              py: 2,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #8b3a1f 0%, #f6a310 100%)',
              },
            }}
          >
            Novo Torneio
          </Button>

          <Button
            variant="outlined"
            startIcon={<Plus />}
            sx={{
              borderColor: 'rgba(245, 158, 11, 0.5)',
              color: '#f59e0b',
              py: 2,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#f59e0b',
                background: 'rgba(245, 158, 11, 0.1)',
              },
            }}
          >
            Novo Jogador
          </Button>

          <Button
            variant="outlined"
            startIcon={<RefreshCw />}
            sx={{
              borderColor: 'rgba(245, 158, 11, 0.5)',
              color: '#f59e0b',
              py: 2,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#f59e0b',
                background: 'rgba(245, 158, 11, 0.1)',
              },
            }}
          >
            Atualizar Sistema
          </Button>

          <Button
            variant="outlined"
            startIcon={<Zap />}
            sx={{
              borderColor: 'rgba(245, 158, 11, 0.5)',
              color: '#f59e0b',
              py: 2,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#f59e0b',
                background: 'rgba(245, 158, 11, 0.1)',
              },
            }}
          >
            Relatórios
          </Button>
        </Box>
      </Box>

      {/* Informações do Sistema */}
      <Card
        className="glass-effect"
        sx={{
          background: 'linear-gradient(145deg, rgba(30, 30, 30, 0.8) 0%, rgba(42, 42, 42, 0.8) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              fontWeight: 600,
              mb: 3,
            }}
          >
            Sistema ACES POKER - Informações

            Desenvolvido por Lui manso
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 4,
            }}
          >
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  color: '#f59e0b',
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                Versão do Sistema
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                ACES POKER v2.0.0
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  color: '#f59e0b',
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                Última Atualização
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                03 de Junho, 2025
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
