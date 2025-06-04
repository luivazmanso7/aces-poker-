'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Avatar,
  Typography,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tabs,
  Tab,
  Stack,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Cake as CakeIcon,
  EmojiEvents as TrophyIcon,
  TrendingUp as TrendingUpIcon,
  Stars as StarsIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';

import type { Jogador, Participacao, Ranking } from '@/types/jogador';
import { jogadorService } from '@/services/jogador.service';

interface JogadorDetalhesDialogProps {
  open: boolean;
  onClose: () => void;
  onEdit: (jogador: Jogador) => void;
  jogador: Jogador | null;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export default function JogadorDetalhesDialog({ 
  open, 
  onClose, 
  onEdit, 
  jogador 
}: JogadorDetalhesDialogProps) {
  const [tabValue, setTabValue] = useState(0);
  const [participacoes, setParticipacoes] = useState<Participacao[]>([]);
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Carregar dados detalhados quando abrir
  const loadPlayerDetails = useCallback(async () => {
    if (!jogador) return;

    setLoading(true);
    setError('');

    try {
      const [participacoesData, rankingsData] = await Promise.all([
        jogadorService.getPlayerHistory(jogador.id),
        jogadorService.getPlayerRankings(jogador.id),
      ]);

      setParticipacoes(participacoesData);
      setRankings(rankingsData);
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
      setError('Erro ao carregar dados do jogador');
    } finally {
      setLoading(false);
    }
  }, [jogador]);

  useEffect(() => {
    if (open && jogador) {
      loadPlayerDetails();
    }
  }, [open, jogador, loadPlayerDetails]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEdit = () => {
    if (jogador) {
      onEdit(jogador);
    }
  };

  if (!jogador) return null;

  const statusBadge = jogadorService.getStatusBadge(jogador);
  const idade = jogadorService.calcularIdade(jogador.data_nascimento);
  const percentualVitorias = jogador.total_torneios > 0 
    ? Math.round((jogador.vitorias / jogador.total_torneios) * 100) 
    : 0;
  const mediaPontos = jogador.total_torneios > 0
    ? Math.round(jogador.total_pontos / jogador.total_torneios)
    : 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { minHeight: '700px' }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Perfil do Jogador</span>
        <Box>
          <IconButton onClick={handleEdit} sx={{ mr: 1 }}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Header com informações básicas */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'auto 1fr',
            gap: 3,
            alignItems: 'center'
          }}>
            <Avatar
              src={jogador.avatar_url}
              sx={{ width: 100, height: 100, bgcolor: 'primary.main' }}
            >
              {jogador.nome.charAt(0).toUpperCase()}  
            </Avatar>
            
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {jogador.nome}
              </Typography>
              
              {jogador.apelido && (
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  &quot;{jogador.apelido}&quot;
                </Typography>
              )}

              <Box sx={{ mb: 2 }}>
                <Chip
                  label={statusBadge.label}
                  color={statusBadge.color}
                  sx={{ mr: 1 }}
                />
                {jogador.melhor_posicao && (
                  <Chip
                    label={`Melhor posição: ${jogador.melhor_posicao}º`}
                    variant="outlined"
                    color="primary"
                  />
                )}
              </Box>

              {/* Informações de contato */}
              <Stack spacing={1}>
                {jogador.email && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography>{jogador.email}</Typography>
                  </Box>
                )}
                
                {jogador.telefone && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography>{jogadorService.formatTelefone(jogador.telefone)}</Typography>
                  </Box>
                )}
                
                {jogador.cidade && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography>{jogador.cidade}</Typography>
                  </Box>
                )}
                
                {jogador.data_nascimento && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CakeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography>
                      {jogadorService.formatDataNascimento(jogador.data_nascimento)}
                      {idade && ` (${idade} anos)`}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography color="text.secondary">
                    Membro desde {jogadorService.formatDataCadastro(jogador.criado_em)}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Paper>

        {/* Estatísticas */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Estatísticas
          </Typography>
          
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr 1fr' },
            gap: 3
          }}>
            <Box sx={{ textAlign: 'center' }}>
              <TrendingUpIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {jogador.total_torneios}
              </Typography>
              <Typography color="text.secondary">Torneios</Typography>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <TrophyIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {jogador.vitorias}
              </Typography>
              <Typography color="text.secondary">Vitórias</Typography>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <StarsIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {jogador.total_pontos.toLocaleString()}
              </Typography>
              <Typography color="text.secondary">Pontos</Typography>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                {percentualVitorias}%
              </Typography>
              <Typography color="text.secondary">Taxa de Vitória</Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 3
          }}>
            <Typography variant="body2" color="text.secondary">
              Média de pontos por torneio: <strong>{mediaPontos}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Melhor posição: <strong>{jogador.melhor_posicao ? `${jogador.melhor_posicao}º lugar` : 'N/A'}</strong>
            </Typography>
          </Box>
        </Paper>

        {/* Bio */}
        {jogador.bio && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Biografia
            </Typography>
            <Typography>{jogador.bio}</Typography>
          </Paper>
        )}

        {/* Tabs com histórico e rankings */}
        <Paper sx={{ p: 0 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label={`Histórico de Torneios (${participacoes.length})`} />
              <Tab label={`Rankings (${rankings.length})`} />
            </Tabs>
          </Box>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          )}

          <TabPanel value={tabValue} index={0}>
            {participacoes.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Torneio</TableCell>
                      <TableCell>Data</TableCell>
                      <TableCell align="center">Posição</TableCell>
                      <TableCell align="center">Pontos</TableCell>
                      <TableCell>Temporada</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {participacoes.map((participacao, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography fontWeight="medium">
                            {participacao.torneio?.nome}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {participacao.torneio?.data_hora && 
                            new Date(participacao.torneio.data_hora).toLocaleDateString('pt-BR')
                          }
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={`${participacao.posicao}º`}
                            size="small"
                            color={participacao.posicao === 1 ? 'success' : 
                                   participacao.posicao <= 3 ? 'warning' : 'default'}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Typography fontWeight="medium">
                            {participacao.pontuacao}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {participacao.torneio?.temporada?.nome}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">
                  Nenhuma participação em torneios encontrada
                </Typography>
              </Box>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {rankings.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Temporada</TableCell>
                      <TableCell align="center">Posição</TableCell>
                      <TableCell align="center">Pontuação</TableCell>
                      <TableCell>Última Atualização</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rankings.map((ranking, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography fontWeight="medium">
                            {ranking.temporada?.nome}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={`${ranking.posicao}º`}
                            size="small"
                            color={ranking.posicao === 1 ? 'success' : 
                                   ranking.posicao <= 3 ? 'warning' : 'default'}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Typography fontWeight="medium">
                            {ranking.pontuacao}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {new Date(ranking.atualizado_em).toLocaleDateString('pt-BR')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">
                  Nenhum ranking encontrado
                </Typography>
              </Box>
            )}
          </TabPanel>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleEdit} variant="outlined">
          Editar Jogador
        </Button>
        <Button onClick={onClose} variant="contained">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
