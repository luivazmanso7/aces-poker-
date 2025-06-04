'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { CreateTemporadaDto, UpdateTemporadaDto, Temporada } from '@/types/temporada';

interface TemporadaDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTemporadaDto | UpdateTemporadaDto) => Promise<void>;
  temporada?: Temporada | null;
  isEditing?: boolean;
}

export default function TemporadaDialog({ 
  open, 
  onClose, 
  onSubmit, 
  temporada, 
  isEditing = false 
}: TemporadaDialogProps) {
  const [formData, setFormData] = useState({
    nome: temporada?.nome || '',
    ano: temporada?.ano || new Date().getFullYear(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
      onClose();
      // Reset form
      setFormData({
        nome: '',
        ano: new Date().getFullYear(),
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error && 'response' in err && 
        typeof err.response === 'object' && err.response !== null && 
        'data' in err.response && typeof err.response.data === 'object' && 
        err.response.data !== null && 'message' in err.response.data 
        ? String(err.response.data.message) 
        : 'Erro ao salvar temporada';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setError(null);
    setFormData({
      nome: temporada?.nome || '',
      ano: temporada?.ano || new Date().getFullYear(),
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          {isEditing ? 'Editar Temporada' : 'Nova Temporada'}
        </Typography>
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nome da Temporada"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
              fullWidth
              placeholder="Ex: Campeonato ACES 2024"
              disabled={loading}
            />
            
            <TextField
              label="Ano"
              type="number"
              value={formData.ano}
              onChange={(e) => setFormData({ ...formData, ano: parseInt(e.target.value) })}
              required
              fullWidth
              inputProps={{
                min: 2020,
                max: new Date().getFullYear() + 5,
              }}
              disabled={loading}
            />
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
