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
  Fab,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Casino as CasinoIcon,
} from '@mui/icons-material';
import { Torneio, CreateTorneioDto, UpdateTorneioDto, TorneioFilters } from '@/types/torneio';
import { Temporada } from '@/types/temporada';
import { torneioApi } from '@/services/torneio.service';
import { temporadaApi } from '@/services/temporada.service';
import TorneioCard from '@/components/torneio/torneio-card';
import TorneioDialog from '@/components/torneio/torneio-dialog-new';
import GestaoParticipacaoDialog from '@/components/torneio/gestao-participacao-dialog';

type SnackbarSeverity = 'success' | 'error' | 'warning' | 'info';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: SnackbarSeverity;
}

export default function TorneiosPage() {
  const [torneios, setTorneios] = useState<Torneio[]>([]);
  const [filteredTorneios, setFilteredTorneios] = useState<Torneio[]>([]);
  const [temporadas, setTemporadas] = useState<Temporada[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTorneio, setEditingTorneio] = useState<Torneio | null>(null);
  const [participacaoDialog, setParticipacaoDialog] = useState<{
    open: boolean;
    torneio: Torneio | null;
  }>({
    open: false,
    torneio: null,
  });
  
  // Filtros
  const [filters, setFilters] = useState<TorneioFilters>({
    search: '',
    temporadaId: undefined,
    ativo: undefined,
  });
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showSnackbar = (message: string, severity: SnackbarSeverity) => {
    setSnackbar({ open: true, message, severity });
  };

  const loadTorneios = useCallback(async () => {
    try {
      const data = await torneioApi.getTorneiosWithStats();
      setTorneios(data);
    } catch {
      showSnackbar('Erro ao carregar torneios', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTemporadas = useCallback(async () => {
    try {
      const data = await temporadaApi.findAll();
      setTemporadas(data);
    } catch {
      showSnackbar('Erro ao carregar temporadas', 'error');
    }
  }, []);

  useEffect(() => {
    loadTorneios();
    loadTemporadas();
  }, [loadTorneios, loadTemporadas]);

  // Aplicar filtros
  useEffect(() => {
    let filtered = torneioApi.filterTorneios(torneios, filters);

    // Filtro por status
    if (statusFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(torneio => {
        const torneioDate = new Date(torneio.data_hora);
        
        switch (statusFilter) {
          case 'upcoming':
            return torneioDate > now && torneio.ativo;
          case 'past':
            return torneioDate < now;
          case 'active':
            return torneio.ativo;
          case 'inactive':
            return !torneio.ativo;
          default:
            return true;
        }
      });
    }

    // Ordenar por data (mais recentes primeiro)
    filtered.sort((a, b) => new Date(b.data_hora).getTime() - new Date(a.data_hora).getTime());
    
    setFilteredTorneios(filtered);
  }, [torneios, filters, statusFilter]);

  const handleCreateTorneio = async (data: CreateTorneioDto) => {
    try {
      await torneioApi.create(data);
      await loadTorneios();
      showSnackbar('Torneio criado com sucesso!', 'success');
    } catch (error) {
      throw error; // Re-throw para o dialog lidar com o erro
    }
  };

  const handleEditTorneio = async (data: UpdateTorneioDto) => {
    if (!editingTorneio) return;
    
    try {
      await torneioApi.update(editingTorneio.id, data);
      await loadTorneios();
      setEditingTorneio(null);
      showSnackbar('Torneio atualizado com sucesso!', 'success');
    } catch (error) {
      throw error; // Re-throw para o dialog lidar com o erro
    }
  };

  const handleDeleteTorneio = async (id: number) => {
    try {
      await torneioApi.delete(id);
      await loadTorneios();
      showSnackbar('Torneio excluído com sucesso!', 'success');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error && 
        typeof error.response === 'object' && error.response !== null && 
        'data' in error.response && typeof error.response.data === 'object' && 
        error.response.data !== null && 'message' in error.response.data 
        ? String(error.response.data.message) 
        : 'Erro ao excluir torneio';
      showSnackbar(errorMessage, 'error');
    }
  };

  const handleViewParticipacoes = (torneio: Torneio) => {
    setParticipacaoDialog({
      open: true,
      torneio,
    });
  };

  const handleManageParticipacoes = (torneio: Torneio) => {
    setParticipacaoDialog({
      open: true,
      torneio,
    });
  };

  const handleAddJogadores = (torneio: Torneio) => {
    setParticipacaoDialog({
      open: true,
      torneio,
    });
  };

  const handleRegistrarResultados = (torneio: Torneio) => {
    setParticipacaoDialog({
      open: true,
      torneio,
    });
  };

  const handleFilterChange = (field: keyof TorneioFilters, value: string | number | boolean | undefined) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      temporadaId: undefined,
      ativo: undefined,
    });
    setStatusFilter('all');
  };

  // Estatísticas rápidas
  const stats = {
    total: torneios.length,
    ativos: torneios.filter(t => t.ativo).length,
    agendados: torneios.filter(t => torneioApi.isUpcoming(t.data_hora) && t.ativo).length,
    finalizados: torneios.filter(t => torneioApi.isPast(t.data_hora)).length,
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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CasinoIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            <div>
              <Typography variant="h4" component="h1" fontWeight="bold">
                Torneios
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Gerencie os torneios de poker
              </Typography>
            </div>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
            size="large"
          >
            Novo Torneio
          </Button>
        </Box>

        {/* Estatísticas */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main" fontWeight="bold">
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {stats.ativos}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ativos
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main" fontWeight="bold">
                {stats.agendados}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Agendados
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main" fontWeight="bold">
                {stats.finalizados}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Finalizados
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Filtros */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <FilterIcon color="action" />
          <Typography variant="h6">Filtros</Typography>
          <Button size="small" onClick={clearFilters}>
            Limpar
          </Button>
        </Box>

        <Grid container spacing={3} alignItems="center">
          {/* Busca */}
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              placeholder="Buscar por nome, local ou observações..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Temporada */}
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Temporada</InputLabel>
              <Select
                value={filters.temporadaId || ''}
                onChange={(e) => handleFilterChange('temporadaId', e.target.value || undefined)}
                label="Temporada"
              >
                <MenuItem value="">Todas</MenuItem>
                {temporadas.map((temporada) => (
                  <MenuItem key={temporada.id} value={temporada.id}>
                    {temporada.nome} ({temporada.ano})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Status */}
          <Grid size={{ xs: 12, md: 5 }}>
            <ToggleButtonGroup
              value={statusFilter}
              exclusive
              onChange={(_, value) => value && setStatusFilter(value)}
              size="small"
            >
              <ToggleButton value="all">Todos</ToggleButton>
              <ToggleButton value="upcoming">Agendados</ToggleButton>
              <ToggleButton value="past">Finalizados</ToggleButton>
              <ToggleButton value="active">Ativos</ToggleButton>
              <ToggleButton value="inactive">Inativos</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
      </Paper>

      {/* Content */}
      {filteredTorneios.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', bgcolor: 'background.paper' }}>
          <CasinoIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {torneios.length === 0 ? 'Nenhum torneio encontrado' : 'Nenhum torneio corresponde aos filtros'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {torneios.length === 0 
              ? 'Comece criando o primeiro torneio'
              : 'Tente ajustar os filtros para encontrar torneios'
            }
          </Typography>
          {torneios.length === 0 && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
            >
              Criar Primeiro Torneio
            </Button>
          )}
        </Paper>
      ) : (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              {filteredTorneios.length} torneio{filteredTorneios.length !== 1 ? 's' : ''} encontrado{filteredTorneios.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            {filteredTorneios.map((torneio) => (
              <Grid key={torneio.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <TorneioCard
                  torneio={torneio}
                  onEdit={setEditingTorneio}
                  onDelete={handleDeleteTorneio}
                  onViewParticipacoes={handleViewParticipacoes}
                  onManageParticipacoes={handleManageParticipacoes}
                  onAddJogadores={handleAddJogadores}
                  onRegistrarResultados={handleRegistrarResultados}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="adicionar torneio"
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
      <TorneioDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={(data) => handleCreateTorneio(data as CreateTorneioDto)}
      />

      <TorneioDialog
        open={!!editingTorneio}
        onClose={() => setEditingTorneio(null)}
        onSubmit={(data) => handleEditTorneio(data as UpdateTorneioDto)}
        torneio={editingTorneio}
        isEditing
      />

      <GestaoParticipacaoDialog
        open={participacaoDialog.open}
        onClose={() => setParticipacaoDialog({ open: false, torneio: null })}
        torneio={participacaoDialog.torneio}
        onRefresh={loadTorneios}
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
