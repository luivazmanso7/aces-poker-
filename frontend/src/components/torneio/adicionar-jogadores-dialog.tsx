'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  Chip,
  Avatar,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Checkbox,
  Divider,
  InputAdornment,
  Badge,
} from '@mui/material';
import {
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
  FilterList as FilterListIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { Torneio } from '@/types/torneio';
import { Jogador } from '@/types/jogador';
import { jogadorService } from '@/services/jogador.service';
import { torneioApi } from '@/services/torneio.service';
import participacaoService from '@/services/participacao.service';

interface AdicionarJogadoresDialogProps {
  open: boolean;
  onClose: () => void;
  torneio: Torneio | null;
  onSuccess?: () => void;
}

export default function AdicionarJogadoresDialog({
  open,
  onClose,
  torneio,
  onSuccess,
}: AdicionarJogadoresDialogProps) {
  const [jogadoresDisponiveis, setJogadoresDisponiveis] = useState<Jogador[]>([]);
  const [selectedJogadores, setSelectedJogadores] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJogadores, setFilteredJogadores] = useState<Jogador[]>([]);

  // Carregar jogadores disponíveis
  useEffect(() => {
    const loadJogadores = async () => {
      if (!torneio || !open) return;

      setLoading(true);
      setError(null);

      try {
        const [jogadoresData, participacoesData] = await Promise.all([
          jogadorService.findAll(),
          torneioApi.getParticipacoes(torneio.id)
        ]);

        const jogadoresAtivos = jogadoresData.filter((j: Jogador) => j.ativo);
        const disponiveis = participacaoService.filtrarJogadoresDisponiveis(
          jogadoresAtivos,
          participacoesData
        );

        setJogadoresDisponiveis(disponiveis);
        setFilteredJogadores(disponiveis);

      } catch (err) {
        console.error('Erro ao carregar jogadores:', err);
        setError('Erro ao carregar lista de jogadores');
      } finally {
        setLoading(false);
      }
    };

    loadJogadores();
  }, [torneio, open]);

  // Filtrar jogadores por busca
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredJogadores(jogadoresDisponiveis);
    } else {
      const filtered = jogadoresDisponiveis.filter(jogador =>
        jogador.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (jogador.apelido && jogador.apelido.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (jogador.cidade && jogador.cidade.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredJogadores(filtered);
    }
  }, [searchTerm, jogadoresDisponiveis]);

  // Reset ao fechar
  useEffect(() => {
    if (!open) {
      setSelectedJogadores(new Set());
      setSearchTerm('');
      setError(null);
      setSuccess(null);
    }
  }, [open]);

  const handleToggleJogador = (jogadorId: number) => {
    setSelectedJogadores(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jogadorId)) {
        newSet.delete(jogadorId);
      } else {
        newSet.add(jogadorId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedJogadores.size === filteredJogadores.length) {
      setSelectedJogadores(new Set());
    } else {
      setSelectedJogadores(new Set(filteredJogadores.map(j => j.id)));
    }
  };

  const handleAdicionarJogadores = async () => {
    if (!torneio || selectedJogadores.size === 0) return;

    setLoading(true);
    setError(null);

    try {
      await participacaoService.addMultiplosJogadores(
        torneio.id,
        Array.from(selectedJogadores)
      );

      setSuccess(`${selectedJogadores.size} jogador(es) adicionado(s) com sucesso!`);
      setSelectedJogadores(new Set());
      
      // Recarregar lista de jogadores disponíveis
      const [jogadoresData, participacoesData] = await Promise.all([
        jogadorService.findAll(),
        torneioApi.getParticipacoes(torneio.id)
      ]);

      const jogadoresAtivos = jogadoresData.filter((j: Jogador) => j.ativo);
      const disponiveis = participacaoService.filtrarJogadoresDisponiveis(
        jogadoresAtivos,
        participacoesData
      );

      setJogadoresDisponiveis(disponiveis);
      setFilteredJogadores(disponiveis);

      if (onSuccess) onSuccess();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar jogadores');
    } finally {
      setLoading(false);
    }
  };

  if (!torneio) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { height: '80vh' }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <PersonAddIcon color="primary" />
            <Box>
              <Typography variant="h6">
                Adicionar Jogadores
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {torneio.nome}
              </Typography>
            </Box>
          </Box>
          <Badge badgeContent={selectedJogadores.size} color="primary">
            <PersonIcon />
          </Badge>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {/* Busca e Estatísticas */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Buscar jogadores por nome, apelido ou cidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <Chip
              icon={<PersonIcon />}
              label={`${jogadoresDisponiveis.length} disponíveis`}
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<FilterListIcon />}
              label={`${filteredJogadores.length} encontrados`}
              color="secondary"
              variant="outlined"
            />
            <Chip
              icon={<PersonAddIcon />}
              label={`${selectedJogadores.size} selecionados`}
              color="success"
              variant={selectedJogadores.size > 0 ? "filled" : "outlined"}
            />
            
            <Button
              size="small"
              onClick={handleSelectAll}
              disabled={filteredJogadores.length === 0}
            >
              {selectedJogadores.size === filteredJogadores.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Lista de Jogadores */}
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <Typography>Carregando jogadores...</Typography>
          </Box>
        ) : filteredJogadores.length === 0 ? (
          <Alert severity="info">
            {jogadoresDisponiveis.length === 0
              ? 'Todos os jogadores ativos já estão participando deste torneio.'
              : 'Nenhum jogador encontrado com os termos de busca.'
            }
          </Alert>
        ) : (
          <Grid container spacing={2}>
            {filteredJogadores.map((jogador) => (
              <Grid key={jogador.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  variant="outlined"
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: selectedJogadores.has(jogador.id) ? 2 : 1,
                    borderColor: selectedJogadores.has(jogador.id) 
                      ? 'primary.main' 
                      : 'divider',
                    backgroundColor: selectedJogadores.has(jogador.id)
                      ? 'primary.50'
                      : 'background.paper',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'primary.50',
                    }
                  }}
                  onClick={() => handleToggleJogador(jogador.id)}
                >
                  <CardContent sx={{ pb: 1 }}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        src={jogador.avatar_url}
                        sx={{ width: 48, height: 48 }}
                      >
                        {jogador.nome.charAt(0)}
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="body1" fontWeight="medium">
                          {jogador.nome}
                        </Typography>
                        {jogador.apelido && (
                          <Typography variant="body2" color="text.secondary">
                            &quot;{jogador.apelido}&quot;
                          </Typography>
                        )}
                        {jogador.cidade && (
                          <Typography variant="caption" color="text.secondary">
                            {jogador.cidade}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ pt: 0, justifyContent: 'space-between' }}>
                    <Box display="flex" gap={1}>
                      {jogador.total_torneios > 0 && (
                        <Chip
                          label={`${jogador.total_torneios} torneios`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                      {jogador.vitorias > 0 && (
                        <Chip
                          label={`${jogador.vitorias} vitórias`}
                          size="small"
                          color="warning"
                          variant="outlined"
                        />
                      )}
                    </Box>
                    <Checkbox
                      checked={selectedJogadores.has(jogador.id)}
                      onChange={() => handleToggleJogador(jogador.id)}
                      color="primary"
                      size="small"
                    />
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleAdicionarJogadores}
          disabled={loading || selectedJogadores.size === 0}
          startIcon={<PersonAddIcon />}
        >
          Adicionar {selectedJogadores.size} Jogador{selectedJogadores.size !== 1 ? 'es' : ''}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
