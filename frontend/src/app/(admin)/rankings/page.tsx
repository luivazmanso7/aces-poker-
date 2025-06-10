'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  SelectChangeEvent,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Star as StarIcon,
  Timeline as TimelineIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { temporadaApi } from '@/services/temporada.service';
import { Temporada, Ranking } from '@/types/temporada';

export default function RankingsPage() {
  const [temporadas, setTemporadas] = useState<Temporada[]>([]);
  const [temporadaSelecionada, setTemporadaSelecionada] = useState<number | ''>('');
  const [ranking, setRanking] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRanking, setLoadingRanking] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    carregarTemporadas();
  }, []);

  const carregarTemporadas = async () => {
    try {
      setLoading(true);
      const data = await temporadaApi.findAll();
      setTemporadas(data);
      
      // Se houver temporadas, selecionar a mais recente por padrão
      if (data.length > 0) {
        const temporadaAtual = data[0]; // já vem ordenado por ano desc
        setTemporadaSelecionada(temporadaAtual.id);
        await carregarRanking(temporadaAtual.id);
      }
    } catch (err) {
      console.error('Erro ao carregar temporadas:', err);
      setError('Erro ao carregar temporadas');
    } finally {
      setLoading(false);
    }
  };

  const carregarRanking = async (temporadaId: number) => {
    try {
      setLoadingRanking(true);
      setError('');
      const data = await temporadaApi.getRanking(temporadaId);
      setRanking(data);
    } catch (err) {
      console.error('Erro ao carregar ranking:', err);
      setError('Erro ao carregar ranking da temporada');
      setRanking([]);
    } finally {
      setLoadingRanking(false);
    }
  };

  const handleTemporadaChange = async (event: SelectChangeEvent<number>) => {
    const temporadaId = event.target.value as number;
    setTemporadaSelecionada(temporadaId);
    if (temporadaId) {
      await carregarRanking(temporadaId);
    } else {
      setRanking([]);
    }
  };

  const getTemporadaInfo = () => {
    if (!temporadaSelecionada) return null;
    return temporadas.find(t => t.id === temporadaSelecionada);
  };

  const getMedalIcon = (posicao: number) => {
    switch (posicao) {
      case 1:
        return <TrophyIcon sx={{ color: '#FFD700', fontSize: 24 }} />;
      case 2:
        return <TrophyIcon sx={{ color: '#C0C0C0', fontSize: 24 }} />;
      case 3:
        return <TrophyIcon sx={{ color: '#CD7F32', fontSize: 24 }} />;
      default:
        return <StarIcon sx={{ color: '#f59e0b', fontSize: 20 }} />;
    }
  };

  const getMedalColor = (posicao: number) => {
    switch (posicao) {
      case 1:
        return '#FFD700';
      case 2:
        return '#C0C0C0';
      case 3:
        return '#CD7F32';
      default:
        return '#f59e0b';
    }
  };

  const downloadRankingCSV = () => {
    if (!ranking.length || !getTemporadaInfo()) return;

    const temporadaInfo = getTemporadaInfo()!;
    
    // Cabeçalhos da planilha
    const headers = ['Posição', 'Jogador', 'Apelido', 'Pontuação', 'Status'];
    
    // Dados do ranking
    const data = ranking.map(item => [
      item.posicao,
      item.jogador.nome,
      item.jogador.apelido || '',
      item.pontuacao,
      item.posicao <= 3 ? 'Pódio' : item.posicao <= 10 ? 'Top 10' : 'Classificado'
    ]);

    // Criar CSV
    const csvContent = [
      [`Ranking - ${temporadaInfo.nome} (${temporadaInfo.ano})`],
      [`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`],
      [''],
      headers,
      ...data
    ].map(row => row.join(',')).join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `ranking-${temporadaInfo.nome.replace(/\s+/g, '-')}-${temporadaInfo.ano}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Seletor de Temporada */}
      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <FormControl sx={{ flex: 1 }}>
            <InputLabel id="temporada-select-label">Selecione uma Temporada</InputLabel>
            <Select
              labelId="temporada-select-label"
              id="temporada-select"
              value={temporadaSelecionada}
              label="Selecione uma Temporada"
              onChange={handleTemporadaChange}
            >
              {temporadas.map((temporada) => (
                <MenuItem key={temporada.id} value={temporada.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body1" fontWeight="medium">
                      {temporada.nome}
                    </Typography>
                    <Chip
                      label={temporada.ano}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Typography variant="body2" color="text.secondary">
                      ({temporada.torneios?.length || 0} torneios)
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          {/* Botão de Download */}
          {ranking.length > 0 && (
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={downloadRankingCSV}
              sx={{ minWidth: 150 }}
            >
              Baixar CSV
            </Button>
          )}
        </Box>

        {/* Info da Temporada Selecionada */}
        {getTemporadaInfo() && (
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Card sx={{ flex: 1 }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Temporada
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {getTemporadaInfo()?.nome}
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ flex: 1 }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Ano
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {getTemporadaInfo()?.ano}
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ flex: 1 }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Torneios
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {getTemporadaInfo()?.torneios?.length || 0}
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ flex: 1 }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Jogadores no Ranking
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {ranking.length}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        )}
      </Paper>

      {/* Mensagem de Erro */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Loading do Ranking */}
      {loadingRanking && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Tabela de Ranking */}
      {!loadingRanking && temporadaSelecionada && ranking.length > 0 && (
        <Paper elevation={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'primary.main' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', width: 80 }}>
                    Posição
                  </TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                    Jogador
                  </TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                    Pontuação
                  </TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ranking.map((item, index) => (
                  <TableRow
                    key={item.id_jogador}
                    sx={{
                      '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                      '&:hover': { bgcolor: 'action.selected' },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getMedalIcon(item.posicao)}
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          sx={{ color: getMedalColor(item.posicao) }}
                        >
                          {item.posicao}º
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {item.jogador.nome.charAt(0)}
                        </Avatar>
                        <div>
                          <Typography variant="body1" fontWeight="medium">
                            {item.jogador.nome}
                          </Typography>
                          {item.jogador.apelido && (
                            <Typography variant="body2" color="text.secondary">
                              "{item.jogador.apelido}"
                            </Typography>
                          )}
                        </div>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        {item.pontuacao}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Chip
                        label={item.posicao <= 3 ? 'Pódio' : item.posicao <= 10 ? 'Top 10' : 'Classificado'}
                        color={item.posicao <= 3 ? 'warning' : item.posicao <= 10 ? 'primary' : 'default'}
                        variant={item.posicao <= 3 ? 'filled' : 'outlined'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Mensagem quando não há ranking */}
      {!loadingRanking && temporadaSelecionada && ranking.length === 0 && !error && (
        <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
          <TrophyIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            Nenhum ranking encontrado
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Esta temporada ainda não possui ranking calculado ou não há participações registradas.
          </Typography>
        </Paper>
      )}

      {/* Mensagem quando nenhuma temporada está selecionada */}
      {!temporadaSelecionada && !loading && (
        <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
          <TimelineIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            Selecione uma temporada
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Escolha uma temporada no seletor acima para visualizar seu ranking.
          </Typography>
        </Paper>
      )}
    </Container>
  );
}