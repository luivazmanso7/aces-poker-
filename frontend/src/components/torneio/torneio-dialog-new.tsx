'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Torneio, CreateTorneioDto, UpdateTorneioDto } from '@/types/torneio';
import { Temporada } from '@/types/temporada';
import { temporadaApi } from '@/services/temporada.service';

interface TorneioDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTorneioDto | UpdateTorneioDto) => Promise<void>;
  torneio?: Torneio | null;
  isEditing?: boolean;
  temporadaId?: number;
}

export default function TorneioDialog({
  open,
  onClose,
  onSubmit,
  torneio,
  isEditing = false,
  temporadaId,
}: TorneioDialogProps) {
  const [formData, setFormData] = useState({
    id_temporada: temporadaId || 0,
    nome: '',
    data_hora: '',
    local: '',
    observacoes: '',
    ativo: true,
  });
  const [temporadas, setTemporadas] = useState<Temporada[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingTemporadas, setLoadingTemporadas] = useState(true);

  // Carregar temporadas disponíveis
  useEffect(() => {
    const loadTemporadas = async () => {
      try {
        const data = await temporadaApi.findAll();
        setTemporadas(data);
      } catch {
        setError('Erro ao carregar temporadas');
      } finally {
        setLoadingTemporadas(false);
      }
    };

    if (open) {
      loadTemporadas();
    }
  }, [open]);

  // Preencher formulário quando editando
  useEffect(() => {
    if (torneio && isEditing) {
      // Formatar data para datetime-local input
      const dataFormatada = new Date(torneio.data_hora)
        .toISOString()
        .slice(0, 16);
      
      setFormData({
        id_temporada: torneio.id_temporada,
        nome: torneio.nome,
        data_hora: dataFormatada,
        local: torneio.local,
        observacoes: torneio.observacoes || '',
        ativo: torneio.ativo,
      });
    } else if (!isEditing) {
      // Reset para novo torneio
      const agora = new Date().toISOString().slice(0, 16);
      setFormData({
        id_temporada: temporadaId || 0,
        nome: '',
        data_hora: agora,
        local: '',
        observacoes: '',
        ativo: true,
      });
    }
  }, [torneio, isEditing, temporadaId]);

  // Reset ao fechar
  useEffect(() => {
    if (!open) {
      setError(null);
      if (!isEditing) {
        const agora = new Date().toISOString().slice(0, 16);
        setFormData({
          id_temporada: temporadaId || 0,
          nome: '',
          data_hora: agora,
          local: '',
          observacoes: '',
          ativo: true,
        });
      }
    }
  }, [open, isEditing, temporadaId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validações
    if (!formData.nome.trim()) {
      setError('Nome é obrigatório');
      return;
    }

    if (!formData.local.trim()) {
      setError('Local é obrigatório');
      return;
    }

    if (!formData.id_temporada) {
      setError('Temporada é obrigatória');
      return;
    }

    if (!formData.data_hora) {
      setError('Data e hora são obrigatórias');
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        ...formData,
        nome: formData.nome.trim(),
        local: formData.local.trim(),
        observacoes: formData.observacoes.trim() || undefined,
        data_hora: new Date(formData.data_hora).toISOString(),
      };

        if (isEditing && torneio) {
            await onSubmit({
            ...submitData,
            id: torneio.id,
            } as UpdateTorneioDto);
        } else {
            await onSubmit(submitData as CreateTorneioDto);
        }

      onClose();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error && 'response' in err && 
        typeof err.response === 'object' && err.response !== null && 
        'data' in err.response && typeof err.response.data === 'object' && 
        err.response.data !== null && 'message' in err.response.data 
        ? String(err.response.data.message) 
        : err instanceof Error 
          ? err.message 
          : 'Erro ao salvar torneio';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  };

  if (loadingTemporadas) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        <Typography variant="h5" component="h2" fontWeight="bold">
          {isEditing ? 'Editar Torneio' : 'Novo Torneio'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {isEditing 
            ? 'Atualize as informações do torneio' 
            : 'Preencha os dados para criar um novo torneio'
          }
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pb: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Temporada */}
            {!isEditing && (
              <FormControl fullWidth required>
                <InputLabel>Temporada</InputLabel>
                <Select
                  value={formData.id_temporada}
                  onChange={(e) => handleChange('id_temporada', e.target.value)}
                  label="Temporada"
                >
                  <MenuItem value={0} disabled>
                    Selecione uma temporada
                  </MenuItem>
                  {temporadas.map((temporada) => (
                    <MenuItem key={temporada.id} value={temporada.id}>
                      {temporada.nome} ({temporada.ano})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {/* Nome */}
            <TextField
              label="Nome do Torneio"
              value={formData.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              required
              fullWidth
              placeholder="Ex: Torneio Mensal de Janeiro"
            />

            {/* Data e Hora */}
            <TextField
              label="Data e Hora"
              type="datetime-local"
              value={formData.data_hora}
              onChange={(e) => handleChange('data_hora', e.target.value)}
              required
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />

            {/* Local */}
            <TextField
              label="Local"
              value={formData.local}
              onChange={(e) => handleChange('local', e.target.value)}
              required
              fullWidth
              placeholder="Ex: Clube do Poker, Sala Principal"
            />

            {/* Observações */}
            <TextField
              label="Observações"
              value={formData.observacoes}
              onChange={(e) => handleChange('observacoes', e.target.value)}
              fullWidth
              multiline
              rows={3}
              placeholder="Informações adicionais sobre o torneio..."
            />

            {/* Status Ativo */}
            <FormControlLabel
              control={
                <Switch
                  checked={formData.ativo}
                  onChange={(e) => handleChange('ativo', e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Torneio Ativo
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formData.ativo 
                      ? 'Torneio visível e disponível para participação' 
                      : 'Torneio oculto e indisponível'
                    }
                  </Typography>
                </Box>
              }
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={onClose} 
            disabled={loading}
            color="inherit"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading 
              ? 'Salvando...' 
              : isEditing 
                ? 'Atualizar' 
                : 'Criar Torneio'
            }
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
