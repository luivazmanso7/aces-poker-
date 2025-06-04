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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Avatar,
  Chip,
  Tooltip,
  Card,
  CardContent,
  Grid,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Save as SaveIcon,
  AutoFixHigh as AutoIcon,
  EmojiEvents as TrophyIcon,
  Undo as UndoIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { Torneio, Participacao, ParticipacaoLote } from '@/types/torneio';
import { torneioApi } from '@/services/torneio.service';
import participacaoService from '@/services/participacao.service';

interface RegistroResultadosDialogProps {
  open: boolean;
  onClose: () => void;
  torneio: Torneio | null;
  onSuccess?: () => void;
}

export default function RegistroResultadosDialog({
  open,
  onClose,
  torneio,
  onSuccess,
}: RegistroResultadosDialogProps) {
  const [participacoes, setParticipacoes] = useState<Participacao[]>([]);
  const [resultados, setResultados] = useState<ParticipacaoLote[]>([]);
  const [resultadosOriginais, setResultadosOriginais] = useState<ParticipacaoLote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [autoCalculate, setAutoCalculate] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  // Carregar participações
  useEffect(() => {
    const loadParticipacoes = async () => {
      if (!torneio || !open) return;

      setLoading(true);
      setError(null);

      try {
        const data = await torneioApi.getParticipacoes(torneio.id);
        setParticipacoes(data);

        const resultadosIniciais = data.map(p => ({
          id_jogador: p.id_jogador,
          posicao: p.posicao,
          pontuacao: p.pontuacao,
          jogador: p.jogador
        }));

        setResultados(resultadosIniciais);
        setResultadosOriginais(JSON.parse(JSON.stringify(resultadosIniciais)));
        setHasChanges(false);

      } catch (err) {
        console.error('Erro ao carregar participações:', err);
        setError('Erro ao carregar participações do torneio');
      } finally {
        setLoading(false);
      }
    };

    loadParticipacoes();
  }, [torneio, open]);

  // Reset ao fechar
  useEffect(() => {
    if (!open) {
      setError(null);
      setSuccess(null);
      setHasChanges(false);
    }
  }, [open]);

  // Detectar mudanças
  useEffect(() => {
    const changed = JSON.stringify(resultados) !== JSON.stringify(resultadosOriginais);
    setHasChanges(changed);
  }, [resultados, resultadosOriginais]);

  const updateResultado = (id_jogador: number, field: 'posicao' | 'pontuacao', value: number) => {
    setResultados(prev => {
      const updated = prev.map(r => 
        r.id_jogador === id_jogador 
          ? { ...r, [field]: value }
          : r
      );

      // Calcular posições automaticamente se habilitado
      if (field === 'pontuacao' && autoCalculate) {
        return participacaoService.calcularPosicoes(updated);
      }

      return updated;
    });
  };

  const handleCalcularPosicoes = () => {
    const resultadosComPosicoes = participacaoService.calcularPosicoes(resultados);
    setResultados(resultadosComPosicoes);
  };

  const handleResetResultados = () => {
    if (window.confirm('Deseja realmente reverter todas as alterações?')) {
      setResultados(JSON.parse(JSON.stringify(resultadosOriginais)));
    }
  };

  const handleSalvarResultados = async () => {
    if (!torneio) return;

    setLoading(true);
    setError(null);

    try {
      // Validar posições
      const validacao = participacaoService.validarPosicoes(resultados);
      if (!validacao.valido) {
        setError(validacao.erros.join(', '));
        return;
      }

      await participacaoService.updateResultadosLote(torneio.id, resultados);
      
      setSuccess('Resultados salvos com sucesso!');
      setResultadosOriginais(JSON.parse(JSON.stringify(resultados)));
      setHasChanges(false);
      
      if (onSuccess) onSuccess();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar resultados');
    } finally {
      setLoading(false);
    }
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
    return <Typography variant="body2" fontWeight="bold">{posicao}º</Typography>;
  };

  if (!torneio) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { height: '90vh' }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <TrophyIcon color="primary" />
            <Box>
              <Typography variant="h6">
                Registrar Resultados
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {torneio.nome} • {participacoes.length} participantes
              </Typography>
            </Box>
          </Box>
          {hasChanges && (
            <Chip
              label="Alterações não salvas"
              color="warning"
              variant="outlined"
              size="small"
            />
          )}
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

        {participacoes.length === 0 ? (
          <Alert severity="info">
            Nenhum jogador foi adicionado a este torneio ainda.
          </Alert>
        ) : (
          <>
            {/* Relatório e Controles */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, md: 8 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Resumo do Torneio
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <Typography variant="h4" color="primary">
                          {participacoes.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Participantes
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <Typography variant="h4" color="primary">
                          {resultados.reduce((sum, r) => sum + r.pontuacao, 0)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total de Pontos
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <Typography variant="h4" color="primary">
                          {participacoes.length > 0 ? Math.round(resultados.reduce((sum, r) => sum + r.pontuacao, 0) / participacoes.length) : 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Média de Pontos
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <Typography variant="h4" color="primary">
                          {resultados.find(r => r.posicao === 1)?.pontuacao || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Maior Pontuação
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Controles
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={2}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={autoCalculate}
                            onChange={(e) => setAutoCalculate(e.target.checked)}
                          />
                        }
                        label="Calcular posições automaticamente"
                      />
                      <Button
                        variant="outlined"
                        startIcon={<AutoIcon />}
                        onClick={handleCalcularPosicoes}
                        disabled={loading}
                        fullWidth
                      >
                        Calcular Posições
                      </Button>
                      {hasChanges && (
                        <Button
                          variant="outlined"
                          startIcon={<UndoIcon />}
                          onClick={handleResetResultados}
                          disabled={loading}
                          fullWidth
                          color="warning"
                        >
                          Reverter Alterações
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Divider sx={{ mb: 3 }} />

            {/* Tabela de Resultados */}
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width="100px">Posição</TableCell>
                    <TableCell>Jogador</TableCell>
                    <TableCell width="150px" align="center">
                      Pontuação
                      <Tooltip title="Insira a pontuação de cada jogador. As posições serão calculadas automaticamente se habilitado.">
                        <IconButton size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {resultados
                    .sort((a, b) => a.posicao - b.posicao)
                    .map((resultado) => (
                    <TableRow 
                      key={resultado.id_jogador}
                      sx={{ 
                        backgroundColor: resultado.posicao <= 3 
                          ? `${getPosicaoColor(resultado.posicao)}15` 
                          : undefined
                      }}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          {getPosicaoIcon(resultado.posicao)}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar 
                            src={resultado.jogador?.avatar_url}
                            sx={{ width: 40, height: 40 }}
                          >
                            {resultado.jogador?.nome.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {resultado.jogador?.nome}
                            </Typography>
                            {resultado.jogador?.apelido && (
                              <Typography variant="caption" color="text.secondary">
                                {resultado.jogador.apelido}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          type="number"
                          size="small"
                          value={resultado.pontuacao}
                          onChange={(e) => updateResultado(
                            resultado.id_jogador, 
                            'pontuacao', 
                            parseInt(e.target.value) || 0
                          )}
                          inputProps={{ 
                            min: 0,
                            style: { textAlign: 'center' }
                          }}
                          sx={{ width: 100 }}
                          disabled={loading}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {resultados.some(r => r.pontuacao > 0) && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Dica:</strong> As posições são calculadas automaticamente baseadas na pontuação. 
                  O jogador com maior pontuação ficará em 1º lugar.
                </Typography>
              </Alert>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSalvarResultados}
          disabled={loading || participacoes.length === 0 || !hasChanges}
          startIcon={<SaveIcon />}
        >
          Salvar Resultados
        </Button>
      </DialogActions>
    </Dialog>
  );
}
