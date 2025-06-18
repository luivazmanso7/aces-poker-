'use client';

import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  Button,
  LinearProgress,
  Card,
  CardContent,
} from '@mui/material';
import {
  Plus,
  Zap,
} from 'lucide-react';
import {
  ParticipacoesPorMesChart,
  DistribuicaoJogadoresChart,
  RankingMedioTorneioChart,
  EvolucaoRankingChart
} from '@/components/dashboard/charts';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  // Simular carregamento inicial
  useEffect(() => {
    const initializeDashboard = async () => {
      // Simular carregamento da interface
      setTimeout(() => {
        setLoading(false);
      }, 800);
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





      {/* Seção de Analytics - Gráficos */}
      <Box mb={4}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 3,
          }}
        >
          📊 Analytics Dashboard
        </Typography>

        {/* Grid de Gráficos */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
            gap: 3,
            mb: 3,
          }}
        >
          {/* Participações por Mês */}
          <Card
            className="glass-effect"
            sx={{
              background: 'linear-gradient(145deg, rgba(30, 30, 30, 0.9) 0%, rgba(42, 42, 42, 0.9) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                Participações por Mês
              </Typography>
              <ParticipacoesPorMesChart />
            </CardContent>
          </Card>

          {/* Distribuição de Jogadores */}
          <Card
            className="glass-effect"
            sx={{
              background: 'linear-gradient(145deg, rgba(30, 30, 30, 0.9) 0%, rgba(42, 42, 42, 0.9) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                Jogadores Ativos vs Inativos
              </Typography>
              <DistribuicaoJogadoresChart />
            </CardContent>
          </Card>
        </Box>

        {/* Segunda linha de gráficos */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
            gap: 3,
          }}
        >
          {/* Ranking Médio por Torneio */}
          <Card
            className="glass-effect"
            sx={{
              background: 'linear-gradient(145deg, rgba(30, 30, 30, 0.9) 0%, rgba(42, 42, 42, 0.9) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                Ranking Médio por Torneio
              </Typography>
              <RankingMedioTorneioChart />
            </CardContent>
          </Card>

          {/* Evolução do Ranking */}
          <Card
            className="glass-effect"
            sx={{
              background: 'linear-gradient(145deg, rgba(30, 30, 30, 0.9) 0%, rgba(42, 42, 42, 0.9) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                Evolução do Ranking (Top 3)
              </Typography>
              <EvolucaoRankingChart />
            </CardContent>
          </Card>
        </Box>
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
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
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


    </Box>
  );
}
