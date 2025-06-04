'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Alert,
  Snackbar,
  CircularProgress,
  Container,
  Paper,
  Chip,
  Fab,
} from '@mui/material';
import {
  Add as AddIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import { Temporada, CreateTemporadaDto, UpdateTemporadaDto, Ranking } from '@/types/temporada';
import { temporadaApi } from '@/services/temporada.service';
import TemporadaCard from '@/components/temporada/temporada-card';
import TemporadaDialog from '@/components/temporada/temporada-dialog';
import RankingDialog from '@/components/temporada/ranking-dialog';

type SnackbarSeverity = 'success' | 'error' | 'warning' | 'info';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: SnackbarSeverity;
}

export default function TemporadasPage() {
  const [temporadas, setTemporadas] = useState<Temporada[]>([]);
  const [currentSeason, setCurrentSeason] = useState<Temporada | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemporada, setEditingTemporada] = useState<Temporada | null>(null);
  const [rankingDialog, setRankingDialog] = useState<{
    open: boolean;
    temporada: Temporada | null;
    ranking: Ranking[];
  }>({
    open: false,
    temporada: null,
    ranking: [],
  });
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showSnackbar = (message: string, severity: SnackbarSeverity) => {
    setSnackbar({ open: true, message, severity });
  };

  const loadTemporadas = useCallback(async () => {
    try {
      const data = await temporadaApi.findAll();
      setTemporadas(data);
    } catch {
      showSnackbar('Erro ao carregar temporadas', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCurrentSeason = useCallback(async () => {
    try {
      const current = await temporadaApi.findCurrent();
      setCurrentSeason(current);
    } catch {
      // Não há temporada atual, isso é normal
    }
  }, []);

  useEffect(() => {
    loadTemporadas();
    loadCurrentSeason();
  }, [loadTemporadas, loadCurrentSeason]);

  const handleCreateTemporada = async (data: CreateTemporadaDto) => {
    try {
      await temporadaApi.create(data);
      await loadTemporadas();
      await loadCurrentSeason();
      showSnackbar('Temporada criada com sucesso!', 'success');
    } catch (error) {
      throw error; // Re-throw para o dialog lidar com o erro
    }
  };

  const handleEditTemporada = async (data: UpdateTemporadaDto) => {
    if (!editingTemporada) return;
    
    try {
      await temporadaApi.update(editingTemporada.id, data);
      await loadTemporadas();
      await loadCurrentSeason();
      setEditingTemporada(null);
      showSnackbar('Temporada atualizada com sucesso!', 'success');
    } catch (error) {
      throw error; // Re-throw para o dialog lidar com o erro
    }
  };

  const handleDeleteTemporada = async (id: number) => {
    try {
      await temporadaApi.delete(id);
      await loadTemporadas();
      await loadCurrentSeason();
      showSnackbar('Temporada excluída com sucesso!', 'success');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error && 
        typeof error.response === 'object' && error.response !== null && 
        'data' in error.response && typeof error.response.data === 'object' && 
        error.response.data !== null && 'message' in error.response.data 
        ? String(error.response.data.message) 
        : 'Erro ao excluir temporada';
      showSnackbar(errorMessage, 'error');
    }
  };

  const handleViewRanking = async (temporada: Temporada) => {
    try {
      const ranking = await temporadaApi.getRanking(temporada.id);
      setRankingDialog({
        open: true,
        temporada,
        ranking,
      });
    } catch {
      showSnackbar('Erro ao carregar ranking', 'error');
    }
  };

  const handleCalculateRanking = async (id: number) => {
    try {
      showSnackbar('Calculando ranking...', 'info');
      await temporadaApi.calculateRanking(id);
      await loadTemporadas();
      showSnackbar('Ranking calculado com sucesso!', 'success');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error && 
        typeof error.response === 'object' && error.response !== null && 
        'data' in error.response && typeof error.response.data === 'object' && 
        error.response.data !== null && 'message' in error.response.data 
        ? String(error.response.data.message) 
        : 'Erro ao calcular ranking';
      showSnackbar(errorMessage, 'error');
    }
  };

  const isCurrentSeason = (temporada: Temporada) => {
    return currentSeason?.id === temporada.id;
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TrophyIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            <div>
              <Typography variant="h4" component="h1" fontWeight="bold">
                Temporadas
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Gerencie as temporadas do campeonato ACES POKER
              </Typography>
            </div>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
            size="large"
          >
            Nova Temporada
          </Button>
        </Box>

        {currentSeason && (
          <Box sx={{ mt: 2 }}>
            <Chip
              label={`Temporada Atual: ${currentSeason.nome} (${currentSeason.ano})`}
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 'medium' }}
            />
          </Box>
        )}
      </Paper>

      {/* Content */}
      {temporadas.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', bgcolor: 'background.paper' }}>
          <TrophyIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhuma temporada encontrada
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Comece criando a primeira temporada do campeonato
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
          >
            Criar Primeira Temporada
          </Button>
        </Paper>
      ) : (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            {temporadas.length} temporada{temporadas.length !== 1 ? 's' : ''} encontrada{temporadas.length !== 1 ? 's' : ''}
          </Typography>
          
          <Grid container spacing={3}>
            {temporadas.map((temporada) => (
              <Grid key={temporada.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <TemporadaCard
                  temporada={temporada}
                  onEdit={setEditingTemporada}
                  onDelete={handleDeleteTemporada}
                  onViewRanking={handleViewRanking}
                  onCalculateRanking={handleCalculateRanking}
                  isCurrentSeason={isCurrentSeason(temporada)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="adicionar temporada"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
        onClick={() => setDialogOpen(true)}
      >
        <AddIcon />
      </Fab>

      {/* Dialogs */}
      <TemporadaDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={(data) => handleCreateTemporada(data as CreateTemporadaDto)}
      />

      <TemporadaDialog
        open={!!editingTemporada}
        onClose={() => setEditingTemporada(null)}
        onSubmit={(data) => handleEditTemporada(data as UpdateTemporadaDto)}
        temporada={editingTemporada}
        isEditing
      />

      <RankingDialog
        open={rankingDialog.open}
        onClose={() => setRankingDialog({ open: false, temporada: null, ranking: [] })}
        temporada={rankingDialog.temporada}
        ranking={rankingDialog.ranking}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
