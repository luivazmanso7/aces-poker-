'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Avatar,
  Alert,
  CircularProgress,
  Fab,
  TextField,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  EmojiEvents as TrophyIcon,
  Person as PersonIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { Torneio, Participacao, CreateParticipacaoDto, UpdateParticipacaoDto } from '@/types/torneio';
import { torneioApi } from '@/services/torneio.service';

interface ParticipacaoDialogProps {
  open: boolean;
  onClose: () => void;
  torneio: Torneio | null;
  onRefresh?: () => void;
}

interface ParticipacaoFormData {
  id_jogador: number;
  posicao: number;
  pontuacao: number;
}

export default function ParticipacaoDialog({
  open,
  onClose,
  torneio,
  onRefresh,
}: ParticipacaoDialogProps) {
  const [participacoes, setParticipacoes] = useState<Participacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingParticipacao, setEditingParticipacao] = useState<Participacao | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<ParticipacaoFormData>({
    id_jogador: 0,
    posicao: 1,
    pontuacao: 0,
  });

  // Carregar participações
  const loadParticipacoes = useCallback(async () => {
    if (!torneio) return;

    setLoading(true);
    setError(null);

    try {
      const data = await torneioApi.getParticipacoes(torneio.id);
      setParticipacoes(data.sort((a, b) => a.posicao - b.posicao));
    } catch {
      setError('Erro ao carregar participações');
    } finally {
      setLoading(false);
    }
  }, [torneio]);

  useEffect(() => {
    if (open && torneio) {
      loadParticipacoes();
    }
  }, [open, torneio, loadParticipacoes]);

  // Reset form quando fechar
  useEffect(() => {
    if (!open) {
      setEditingParticipacao(null);
      setShowAddForm(false);
      setFormData({
        id_jogador: 0,
        posicao: 1,
        pontuacao: 0,
      });
      setError(null);
    }
  }, [open]);

  const handleAddParticipacao = async () => {
    if (!torneio) return;

    try {
      await torneioApi.addParticipacao(torneio.id, formData as CreateParticipacaoDto);
      await loadParticipacoes();
      setShowAddForm(false);
      setFormData({
        id_jogador: 0,
        posicao: participacoes.length + 1,
        pontuacao: 0,
      });
      if (onRefresh) onRefresh();
    } catch (err: unknown) {
      setError(err instanceof Error && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data ? String(err.response.data.message) : 'Erro ao adicionar participação');
    }
  };

  const handleUpdateParticipacao = async () => {
    if (!torneio || !editingParticipacao) return;

    try {
      await torneioApi.updateParticipacao(
        torneio.id,
        editingParticipacao.id_jogador,
        {
          posicao: formData.posicao,
          pontuacao: formData.pontuacao,
        } as UpdateParticipacaoDto
      );
      await loadParticipacoes();
      setEditingParticipacao(null);
      if (onRefresh) onRefresh();
    } catch (err: unknown) {
      setError(err instanceof Error && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data ? String(err.response.data.message) : 'Erro ao atualizar participação');
    }
  };

  const handleDeleteParticipacao = async (participacao: Participacao) => {
    if (!torneio) return;

    if (confirm(`Remover ${participacao.jogador?.nome} do torneio?`)) {
      try {
        await torneioApi.removeParticipacao(torneio.id, participacao.id_jogador);
        await loadParticipacoes();
        if (onRefresh) onRefresh();
      } catch (err: unknown) {
        setError(err instanceof Error && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data ? String(err.response.data.message) : 'Erro ao remover participação');
      }
    }
  };

  const startEdit = (participacao: Participacao) => {
    setEditingParticipacao(participacao);
    setFormData({
      id_jogador: participacao.id_jogador,
      posicao: participacao.posicao,
      pontuacao: participacao.pontuacao,
    });
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingParticipacao(null);
    setShowAddForm(false);
    setFormData({
      id_jogador: 0,
      posicao: 1,
      pontuacao: 0,
    });
  };

  const getPosicaoColor = (posicao: number) => {
    switch (posicao) {
      case 1: return '#FFD700'; // Ouro
      case 2: return '#C0C0C0'; // Prata
      case 3: return '#CD7F32'; // Bronze
      default: return undefined;
    }
  };

  const getPosicaoIcon = (posicao: number) => {
    if (posicao <= 3) {
      return <TrophyIcon sx={{ color: getPosicaoColor(posicao), fontSize: 20 }} />;
    }
    return <PersonIcon color="action" fontSize="small" />;
  };

  if (!torneio) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, minHeight: '70vh' }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Box component="span" sx={{ fontWeight: 'bold', fontSize: '1.25rem', display: 'block' }}>
              Participações - {torneio.nome}
            </Box>
            <Typography variant="body2" color="text.secondary">
              {torneioApi.formatDateTime(torneio.data_hora)} • {torneio.local}
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Formulário de Adição/Edição */}
            {(showAddForm || editingParticipacao) && (
              <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
                <Typography variant="h6" gutterBottom>
                  {editingParticipacao ? 'Editar Participação' : 'Nova Participação'}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  {!editingParticipacao && (
                    <TextField
                      label="ID do Jogador"
                      type="number"
                      value={formData.id_jogador}
                      onChange={(e) => setFormData(prev => ({ ...prev, id_jogador: parseInt(e.target.value) || 0 }))}
                      size="small"
                      sx={{ minWidth: 120 }}
                    />
                  )}
                  
                  <TextField
                    label="Posição"
                    type="number"
                    value={formData.posicao}
                    onChange={(e) => setFormData(prev => ({ ...prev, posicao: parseInt(e.target.value) || 1 }))}
                    size="small"
                    sx={{ minWidth: 100 }}
                    inputProps={{ min: 1 }}
                  />
                  
                  <TextField
                    label="Pontuação"
                    type="number"
                    value={formData.pontuacao}
                    onChange={(e) => setFormData(prev => ({ ...prev, pontuacao: parseInt(e.target.value) || 0 }))}
                    size="small"
                    sx={{ minWidth: 120 }}
                    inputProps={{ min: 0 }}
                  />
                  
                  <Button
                    variant="contained"
                    onClick={editingParticipacao ? handleUpdateParticipacao : handleAddParticipacao}
                    disabled={!formData.id_jogador || !formData.posicao}
                  >
                    {editingParticipacao ? 'Atualizar' : 'Adicionar'}
                  </Button>
                  
                  <Button onClick={cancelEdit}>
                    Cancelar
                  </Button>
                </Box>
              </Paper>
            )}

            {/* Tabela de Participações */}
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Posição</TableCell>
                    <TableCell>Jogador</TableCell>
                    <TableCell align="right">Pontuação</TableCell>
                    <TableCell align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {participacoes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          Nenhuma participação registrada
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    participacoes.map((participacao) => (
                      <TableRow key={`${participacao.id_torneio}-${participacao.id_jogador}`}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getPosicaoIcon(participacao.posicao)}
                            <Typography fontWeight={participacao.posicao <= 3 ? 'bold' : 'normal'}>
                              {participacao.posicao}º
                            </Typography>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ width: 32, height: 32 }}>
                              {participacao.jogador?.nome?.[0] || '?'}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {participacao.jogador?.nome || `Jogador #${participacao.id_jogador}`}
                              </Typography>
                              {participacao.jogador?.apelido && (
                                <Typography variant="caption" color="text.secondary">
                                  {participacao.jogador.apelido}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        
                        <TableCell align="right">
                          <Chip
                            label={participacao.pontuacao}
                            color={participacao.posicao <= 3 ? 'primary' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => startEdit(participacao)}
                            color="primary"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteParticipacao(participacao)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Floating Action Button */}
            {!showAddForm && !editingParticipacao && (
              <Fab
                color="primary"
                size="medium"
                sx={{
                  position: 'fixed',
                  bottom: 24,
                  right: 24,
                }}
                onClick={() => {
                  setShowAddForm(true);
                  setFormData({
                    id_jogador: 0,
                    posicao: participacoes.length + 1,
                    pontuacao: 0,
                  });
                }}
              >
                <AddIcon />
              </Fab>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
