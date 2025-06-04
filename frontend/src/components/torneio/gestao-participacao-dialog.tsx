'use client';

import { useState, useEffect, useCallback } from 'react';
import './fixes.css';
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
  TextField,
  Autocomplete,
  Tab,
  Tabs,
  Card,
  CardContent,
  Badge,
  InputAdornment,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  EmojiEvents as TrophyIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  Save as SaveIcon,
  PersonAdd as PersonAddIcon,
  Leaderboard as LeaderboardIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { Torneio, Participacao, CreateParticipacaoDto, UpdateParticipacaoDto, ParticipacaoLote } from '@/types/torneio';
import { Jogador } from '@/types/jogador';
import { torneioApi } from '@/services/torneio.service';
import { jogadorService } from '@/services/jogador.service';
import participacaoService from '@/services/participacao.service';

interface GestaoParticipacaoDialogProps {
  open: boolean;
  onClose: () => void;
  torneio: Torneio | null;
  onRefresh?: () => void;
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
      id={`participacao-tabpanel-${index}`}
      aria-labelledby={`participacao-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function GestaoParticipacaoDialog({
  open,
  onClose,
  torneio,
  onRefresh,
}: GestaoParticipacaoDialogProps) {
  // Helper para obter avatar
  const getAvatarUrl = (jogador: { avatar_url?: string; foto?: string } | null | undefined): string | undefined => {
    return jogador?.avatar_url || jogador?.foto;
  };

  const [tabValue, setTabValue] = useState(0);
  const [participacoes, setParticipacoes] = useState<Participacao[]>([]);
  const [todosJogadores, setTodosJogadores] = useState<Jogador[]>([]);
  const [jogadoresDisponiveis, setJogadoresDisponiveis] = useState<Jogador[]>([]);
  const [mostrarTodosJogadores, setMostrarTodosJogadores] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Estados para adicionar jogadores
  const [selectedJogadores, setSelectedJogadores] = useState<Jogador[]>([]);
  
  // Estados para registrar resultados
  const [resultados, setResultados] = useState<ParticipacaoLote[]>([]);
  const [editingMode, setEditingMode] = useState(false);
  
  // Estados para edição individual
  const [editingParticipacao, setEditingParticipacao] = useState<Participacao | null>(null);
  const [editForm, setEditForm] = useState({ posicao: 1, pontuacao: 0 });

  // Carregar dados
  const loadData = useCallback(async () => {
    if (!torneio) return;

    setLoading(true);
    setError(null);

    try {
      const [participacoesData, jogadoresData] = await Promise.all([
        torneioApi.getParticipacoes(torneio.id),
        jogadorService.findAll()
      ]);

      console.log('Jogadores carregados da API:', jogadoresData);
      console.log('Participações carregadas:', participacoesData);

      // Garantir que jogadoresData é um array antes de filtrar
      if (!Array.isArray(jogadoresData)) {
        console.error('jogadoresData não é um array:', jogadoresData);
        setError('Erro ao carregar jogadores: formato inválido');
        setTodosJogadores([]);
        setJogadoresDisponiveis([]);
        return;
      }

      const jogadoresAtivos = jogadoresData.filter((j: Jogador) => j.ativo);
      console.log('Jogadores ativos:', jogadoresAtivos);
      
      setParticipacoes(participacoesData.sort((a: Participacao, b: Participacao) => a.posicao - b.posicao));
      setTodosJogadores(jogadoresAtivos);
      
      // Filtrar jogadores disponíveis
      const disponiveis = participacaoService.filtrarJogadoresDisponiveis(
        jogadoresAtivos,
        participacoesData
      );
      console.log('Jogadores disponíveis após filtro:', disponiveis);
      setJogadoresDisponiveis(disponiveis);

      // Inicializar resultados para edição
      const resultadosIniciais = participacoesData.map((p: Participacao) => ({
        id_jogador: p.id_jogador,
        posicao: p.posicao,
        pontuacao: p.pontuacao,
        jogador: p.jogador
      }));
      setResultados(resultadosIniciais);

    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados do torneio');
    } finally {
      setLoading(false);
    }
  }, [torneio]);

  useEffect(() => {
    if (open && torneio) {
      loadData();
    }
  }, [open, torneio, loadData]);

  // Reset quando fechar
  useEffect(() => {
    if (!open) {
      setTabValue(0);
      setSelectedJogadores([]);
      setEditingMode(false);
      setEditingParticipacao(null);
      setError(null);
      setSuccess(null);
    }
  }, [open]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError(null);
    setSuccess(null);
  };

  // Adicionar jogadores selecionados
  const handleAdicionarJogadores = async () => {
    if (!torneio || selectedJogadores.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const proximaPosicao = participacoes.length + 1;
      
      for (let i = 0; i < selectedJogadores.length; i++) {
        const jogador = selectedJogadores[i];
        const data: CreateParticipacaoDto = {
          id_jogador: jogador.id,
          posicao: proximaPosicao + i,
          pontuacao: 0
        };
        
        await torneioApi.addParticipacao(torneio.id, data);
      }

      setSuccess(`${selectedJogadores.length} jogador(es) adicionado(s) com sucesso!`);
      setSelectedJogadores([]);
      await loadData();
      if (onRefresh) onRefresh();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar jogadores');
    } finally {
      setLoading(false);
    }
  };

  // Salvar resultados em lote
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
      setEditingMode(false);
      await loadData();
      if (onRefresh) onRefresh();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar resultados');
    } finally {
      setLoading(false);
    }
  };

  // Editar participação individual
  const handleEditParticipacao = (participacao: Participacao) => {
    setEditingParticipacao(participacao);
    setEditForm({
      posicao: participacao.posicao,
      pontuacao: participacao.pontuacao
    });
  };

  const handleSaveEdit = async () => {
    if (!torneio || !editingParticipacao) return;

    setLoading(true);
    setError(null);

    try {
      await torneioApi.updateParticipacao(
        torneio.id,
        editingParticipacao.id_jogador,
        editForm as UpdateParticipacaoDto
      );

      setSuccess('Participação atualizada com sucesso!');
      setEditingParticipacao(null);
      await loadData();
      if (onRefresh) onRefresh();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar participação');
    } finally {
      setLoading(false);
    }
  };

  // Remover participação
  const handleRemoveParticipacao = async (participacao: Participacao) => {
    if (!torneio || !window.confirm('Deseja realmente remover este jogador do torneio?')) return;

    setLoading(true);
    setError(null);

    try {
      await torneioApi.removeParticipacao(torneio.id, participacao.id_jogador);
      setSuccess('Jogador removido do torneio!');
      await loadData();
      if (onRefresh) onRefresh();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover jogador');
    } finally {
      setLoading(false);
    }
  };

  // Atualizar resultado individual no lote
  const updateResultado = (id_jogador: number, field: 'posicao' | 'pontuacao', value: number) => {
    setResultados(prev => prev.map(r => 
      r.id_jogador === id_jogador 
        ? { ...r, [field]: value }
        : r
    ));
  };

  // Calcular posições automaticamente
  const handleCalcularPosicoes = () => {
    const resultadosComPosicoes = participacaoService.calcularPosicoes(resultados);
    setResultados(resultadosComPosicoes);
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
      <DialogTitle sx={{ pb: 1, bgcolor: 'rgba(0, 0, 0, 0.04)' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <LeaderboardIcon color="primary" sx={{ fontSize: 28 }} />
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Gestão de Participações
              </Typography>
              <Typography variant="body2" color="text.primary">
                {torneio.nome} • {new Date(torneio.data_hora).toLocaleDateString('pt-BR')}
              </Typography>
            </Box>
          </Box>
          <Badge badgeContent={participacoes.length} color="primary" sx={{ '& .MuiBadge-badge': { fontWeight: 'bold' } }}>
            <PersonIcon sx={{ color: 'text.primary', fontSize: 24 }} />
          </Badge>
        </Box>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="participacao tabs">
          <Tab 
            icon={<PersonAddIcon />} 
            label="Adicionar Jogadores" 
            iconPosition="start"
          />
          <Tab 
            icon={<LeaderboardIcon />} 
            label="Registrar Resultados" 
            iconPosition="start"
          />
          <Tab 
            icon={<TrophyIcon />} 
            label="Participações" 
            iconPosition="start"
          />
        </Tabs>
      </Box>

      <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
        {error && (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ m: 2 }}>
            {success}
          </Alert>
        )}

        {/* Tab 1: Adicionar Jogadores */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Selecione os jogadores cadastrados que deseja adicionar a este torneio. É possível buscar pelo nome, apelido ou cidade.
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setMostrarTodosJogadores(!mostrarTodosJogadores)}
                >
                  {mostrarTodosJogadores ? 'Mostrar disponíveis' : 'Mostrar todos'}
                </Button>
              </Box>
              
              <Autocomplete
                multiple
                options={mostrarTodosJogadores ? 
                  // Filtramos pelo termo de busca, mas mostramos todos jogadores
                  todosJogadores.filter(j => 
                    searchTerm === '' || 
                    j.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (j.apelido && j.apelido.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (j.cidade && j.cidade.toLowerCase().includes(searchTerm.toLowerCase()))
                  ) : 
                  // Filtramos pelo termo de busca, mas apenas jogadores disponíveis
                  jogadoresDisponiveis.filter(j => 
                    searchTerm === '' || 
                    j.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (j.apelido && j.apelido.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (j.cidade && j.cidade.toLowerCase().includes(searchTerm.toLowerCase()))
                  )
                }
                getOptionLabel={(jogador) => `${jogador.nome} ${jogador.apelido ? `(${jogador.apelido})` : ''} ${jogador.cidade ? `- ${jogador.cidade}` : ''}`}
                value={selectedJogadores}
                onChange={(event, newValue) => {
                  // Filtrar apenas jogadores que não estão no torneio
                  const jogadoresValidos = newValue.filter(jogador => 
                    !participacoes.some(p => p.id_jogador === jogador.id)
                  );
                  setSelectedJogadores(jogadoresValidos);
                }}
                getOptionDisabled={(option) => participacoes.some(p => p.id_jogador === option.id)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Selecionar Jogadores"
                    placeholder="Buscar jogadores por nome, apelido ou cidade..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
                renderOption={(props, jogador) => {
                  // Verificar se o jogador já está no torneio
                  const jaNoTorneio = participacoes.some(p => p.id_jogador === jogador.id);
                  // Calcular se jogador está disponível para adicionar
                  const disponivel = !jaNoTorneio;
                  
                  return (
                    <Box 
                      component="li" 
                      {...props} 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        opacity: disponivel ? 1 : 0.6,
                        ...(jaNoTorneio ? {
                          cursor: 'not-allowed',
                          backgroundColor: 'rgba(25, 118, 210, 0.15)'
                        } : {
                          backgroundColor: 'rgba(0, 0, 0, 0.03)',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.08)',
                          }
                        })
                      }}
                    >
                      <Avatar 
                        src={getAvatarUrl(jogador)}
                        sx={{ width: 32, height: 32 }}
                      >
                        {jogador.nome.charAt(0)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" fontWeight="bold" sx={{ color: '#000000' }}>
                            {jogador.nome}
                          </Typography>
                          {jaNoTorneio && (
                            <Chip
                              size="small"
                              label="Já adicionado"
                              color="primary"
                              variant="outlined"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          {jogador.apelido && (
                            <Typography variant="caption" sx={{ color: '#333333', fontWeight: 'medium' }}>
                              {jogador.apelido}
                            </Typography>
                          )}
                          {jogador.cidade && (
                            <Typography variant="caption" sx={{ color: '#333333', fontWeight: 'medium' }}>
                              • {jogador.cidade}
                            </Typography>
                          )}
                          {jogador.total_torneios > 0 && (
                            <Chip 
                              size="small" 
                              label={`${jogador.total_torneios} torneio${jogador.total_torneios > 1 ? 's' : ''}`} 
                              variant="outlined"
                              sx={{ height: 20, fontSize: '0.7rem' }} 
                            />
                          )}
                        </Box>
                      </Box>
                    </Box>
                  );
                }}
                renderTags={(value, getTagProps) =>
                  value.map((jogador, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={jogador.id}
                      avatar={
                        <Avatar src={jogador.avatar_url}>
                          {jogador.nome.charAt(0)}
                        </Avatar>
                      }
                      label={jogador.apelido || jogador.nome}
                      variant="outlined"
                    />
                  ))
                }
                disabled={loading}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Card variant="outlined" sx={{ flex: 1, bgcolor: 'rgba(0, 0, 0, 0.05)' }}>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
                    {todosJogadores.length}
                  </Typography>
                  <Typography variant="body2" color="text.primary">
                    Total de jogadores cadastrados
                  </Typography>
                </CardContent>
              </Card>
              <Card variant="outlined" sx={{ flex: 1, bgcolor: 'rgba(0, 0, 0, 0.05)' }}>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
                    {jogadoresDisponiveis.length}
                  </Typography>
                  <Typography variant="body2" color="text.primary">
                    Jogadores disponíveis para adicionar
                  </Typography>
                </CardContent>
              </Card>
              <Card variant="outlined" sx={{ flex: 1, bgcolor: 'rgba(0, 0, 0, 0.05)' }}>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
                    {participacoes.length}
                  </Typography>
                  <Typography variant="body2" color="text.primary">
                    Jogadores já participando
                  </Typography>
                </CardContent>
              </Card>
            </Box>
                  
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                Selecione os jogadores que deseja adicionar a este torneio. Apenas jogadores ativos que ainda não participam deste torneio são mostrados.
              </Typography>
            </Alert>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                {selectedJogadores.length > 0 && (
                  <Alert severity="success" icon={<PersonAddIcon />} sx={{ display: 'inline-flex' }}>
                    <Typography variant="body2">
                      {selectedJogadores.length} jogador{selectedJogadores.length !== 1 ? 'es' : ''} selecionado{selectedJogadores.length !== 1 ? 's' : ''}
                    </Typography>
                  </Alert>
                )}
              </Box>
              <Button
                variant="contained"
                startIcon={<PersonAddIcon />}
                onClick={handleAdicionarJogadores}
                disabled={loading || selectedJogadores.length === 0}
                size="large"
                color="primary"
                sx={{ 
                  px: 3, 
                  py: 1,
                  boxShadow: selectedJogadores.length > 0 ? 2 : 0,
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: selectedJogadores.length > 0 ? 'translateY(-2px)' : 'none',
                    boxShadow: selectedJogadores.length > 0 ? 3 : 0,
                  }
                }}
              >
                Adicionar {selectedJogadores.length} Jogador{selectedJogadores.length !== 1 ? 'es' : ''} ao Torneio
              </Button>
            </Box>
          </Box>
        </TabPanel>

        {/* Tab 2: Registrar Resultados */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6">
                Registrar Resultados do Torneio
              </Typography>
              <Box display="flex" gap={1}>
                <Button
                  variant="outlined"
                  startIcon={<StarIcon />}
                  onClick={handleCalcularPosicoes}
                  disabled={loading}
                >
                  Calcular Posições
                </Button>
                {editingMode ? (
                  <>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSalvarResultados}
                      disabled={loading}
                    >
                      Salvar Resultados
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={() => setEditingMode(false)}
                      disabled={loading}
                    >
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => setEditingMode(true)}
                    disabled={loading || participacoes.length === 0}
                  >
                    Editar Resultados
                  </Button>
                )}
              </Box>
            </Box>

            {participacoes.length === 0 ? (
              <Alert severity="info">
                Nenhum jogador adicionado ao torneio ainda. 
                Vá para a aba &quot;Adicionar Jogadores&quot; para começar.
              </Alert>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell width="80px">Posição</TableCell>
                      <TableCell>Jogador</TableCell>
                      <TableCell width="120px" align="center">Pontuação</TableCell>
                      {!editingMode && <TableCell width="100px" align="center">Ações</TableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(editingMode ? resultados : participacoes).map((item) => (
                      <TableRow 
                        key={item.id_jogador}
                        sx={{ 
                          backgroundColor: item.posicao <= 3 ? `${getPosicaoColor(item.posicao)}15` : undefined
                        }}
                      >
                        <TableCell>
                          {editingMode ? (
                            <TextField
                              type="number"
                              size="small"
                              value={item.posicao}
                              onChange={(e) => updateResultado(
                                item.id_jogador, 
                                'posicao', 
                                parseInt(e.target.value) || 1
                              )}
                              inputProps={{ min: 1 }}
                              sx={{ width: 70 }}
                            />
                          ) : (
                            <Box display="flex" alignItems="center" gap={1}>
                              {getPosicaoIcon(item.posicao)}
                            </Box>
                          )}
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar 
                              src={getAvatarUrl(item.jogador)}
                              sx={{ width: 40, height: 40 }}
                            >
                              {item.jogador?.nome.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {item.jogador?.nome}
                              </Typography>
                              {item.jogador?.apelido && (
                                <Typography variant="caption" color="text.secondary">
                                  {item.jogador.apelido}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          {editingMode ? (
                            <TextField
                              type="number"
                              size="small"
                              value={item.pontuacao}
                              onChange={(e) => updateResultado(
                                item.id_jogador, 
                                'pontuacao', 
                                parseInt(e.target.value) || 0
                              )}
                              inputProps={{ min: 0 }}
                              sx={{ width: 100 }}
                            />
                          ) : (
                            <Chip
                              label={`${item.pontuacao} pts`}
                              color={item.pontuacao > 0 ? "primary" : "default"}
                              variant="outlined"
                            />
                          )}
                        </TableCell>
                        {!editingMode && (
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              onClick={() => handleEditParticipacao(item as Participacao)}
                              color="primary"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveParticipacao(item as Participacao)}
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </TabPanel>

        {/* Tab 3: Lista de Participações */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Participações do Torneio
            </Typography>
            
            {participacoes.length === 0 ? (
              <Alert severity="info">
                Nenhuma participação registrada ainda.
              </Alert>
            ) : (
              <>
                <Box display="flex" gap={2} mb={3}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary">
                        {participacoes.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Participantes
                      </Typography>
                    </CardContent>
                  </Card>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary">
                        {participacoes.reduce((sum, p) => sum + p.pontuacao, 0)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total de Pontos
                      </Typography>
                    </CardContent>
                  </Card>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary">
                        {participacoes.length > 0 ? Math.round(participacoes.reduce((sum, p) => sum + p.pontuacao, 0) / participacoes.length) : 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Média de Pontos
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>

                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Posição</TableCell>
                        <TableCell>Jogador</TableCell>
                        <TableCell align="center">Pontuação</TableCell>
                        <TableCell align="center">Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {participacoes.map((participacao) => (
                        <TableRow 
                          key={participacao.id_jogador}
                          sx={{ 
                            backgroundColor: participacao.posicao <= 3 ? `${getPosicaoColor(participacao.posicao)}15` : undefined
                          }}
                        >
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              {getPosicaoIcon(participacao.posicao)}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={2}>
                              <Avatar 
                                src={getAvatarUrl(participacao.jogador)}
                                sx={{ width: 40, height: 40 }}
                              >
                                {participacao.jogador?.nome.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  {participacao.jogador?.nome}
                                </Typography>
                                {participacao.jogador?.apelido && (
                                  <Typography variant="caption" color="text.secondary">
                                    {participacao.jogador.apelido}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={`${participacao.pontuacao} pts`}
                              color={participacao.pontuacao > 0 ? "primary" : "default"}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              icon={<CheckCircleIcon />}
                              label="Confirmado"
                              color="success"
                              variant="outlined"
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Box>
        </TabPanel>

        {loading && (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
            bgcolor="rgba(255, 255, 255, 0.8)"
            zIndex={1000}
          >
            <CircularProgress />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={onClose} disabled={loading}>
          Fechar
        </Button>
      </DialogActions>

      {/* Dialog para edição individual */}
      <Dialog open={!!editingParticipacao} onClose={() => setEditingParticipacao(null)}>
        <DialogTitle>Editar Participação</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            <TextField
              label="Posição"
              type="number"
              value={editForm.posicao}
              onChange={(e) => setEditForm(prev => ({ ...prev, posicao: parseInt(e.target.value) || 1 }))}
              inputProps={{ min: 1 }}
              fullWidth
            />
            <TextField
              label="Pontuação"
              type="number"
              value={editForm.pontuacao}
              onChange={(e) => setEditForm(prev => ({ ...prev, pontuacao: parseInt(e.target.value) || 0 }))}
              inputProps={{ min: 0 }}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingParticipacao(null)}>
            Cancelar
          </Button>
          <Button onClick={handleSaveEdit} variant="contained" disabled={loading}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}
