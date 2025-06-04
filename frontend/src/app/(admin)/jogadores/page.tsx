'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  CircularProgress,
  Paper,
  Pagination,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Person as PersonIcon,
  EmojiEvents as TrophyIcon,
  TrendingUp as TrendingUpIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';

import type { Jogador, JogadorFilters } from '@/types/jogador';
import { jogadorService } from '@/services/jogador.service';
import JogadorCard from '@/components/jogador/jogador-card';
import JogadorDialog from '@/components/jogador/jogador-dialog';
import JogadorDetalhesDialog from '@/components/jogador/jogador-detalhes-dialog';

const ITEMS_POR_PAGINA = 12;

export default function JogadoresPage() {
  // Estados principais
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [jogadoresFiltrados, setJogadoresFiltrados] = useState<Jogador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Estados dos diálogos
  const [dialogAberto, setDialogAberto] = useState(false);
  const [detalhesDialogAberto, setDetalhesDialogAberto] = useState(false);
  const [deleteDialogAberto, setDeleteDialogAberto] = useState(false);
  const [jogadorSelecionado, setJogadorSelecionado] = useState<Jogador | null>(null);
  const [jogadorParaEditar, setJogadorParaEditar] = useState<Jogador | undefined>(undefined);

  // Estados de filtros e busca
  const [filtros, setFiltros] = useState<JogadorFilters>({
    ativo: undefined,
    cidade: '',
    search: '',
    ordenacao: 'nome',
    direcao: 'asc',
  });

  // Estados de paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Estados de estatísticas
  const [stats, setStats] = useState({
    total: 0,
    ativos: 0,
    inativos: 0,
    comVitorias: 0,
  });

  // Carregar jogadores
  const carregarJogadores = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await jogadorService.getJogadoresWithStats();
      setJogadores(data);
      
      // Calcular estatísticas
      const stats = {
        total: data.length,
        ativos: data.filter(j => j.ativo).length,
        inativos: data.filter(j => !j.ativo).length,
        comVitorias: data.filter(j => j.vitorias > 0).length,
      };
      setStats(stats);
      
    } catch (err) {
      console.error('Erro ao carregar jogadores:', err);
      setError('Erro ao carregar lista de jogadores');
    } finally {
      setLoading(false);
    }
  }, []);

  // Aplicar filtros
  const aplicarFiltros = useCallback(() => {
    const filtrados = jogadorService.filterJogadores(jogadores, filtros);
    setJogadoresFiltrados(filtrados);
    
    // Recalcular paginação
    const novoTotalPaginas = Math.ceil(filtrados.length / ITEMS_POR_PAGINA);
    setTotalPaginas(novoTotalPaginas);
    
    // Resetar para primeira página se necessário
    if (paginaAtual > novoTotalPaginas) {
      setPaginaAtual(1);
    }
  }, [jogadores, filtros, paginaAtual]);

  // Efeitos
  useEffect(() => {
    carregarJogadores();
  }, [carregarJogadores]);

  useEffect(() => {
    aplicarFiltros();
  }, [aplicarFiltros]);

  // Handlers dos filtros
  const handleFiltroChange = (campo: keyof JogadorFilters, valor: string | boolean | undefined) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
    setPaginaAtual(1); // Resetar para primeira página
  };

  const limparFiltros = () => {
    setFiltros({
      ativo: undefined,
      cidade: '',
      search: '',
      ordenacao: 'nome',
      direcao: 'asc',
    });
    setPaginaAtual(1);
  };

  // Handlers dos diálogos
  const handleNovoJogador = () => {
    setJogadorParaEditar(undefined);
    setDialogAberto(true);
  };

  const handleEditarJogador = (jogador: Jogador) => {
    setJogadorParaEditar(jogador);
    setDialogAberto(true);
  };

  const handleVerDetalhes = (jogador: Jogador) => {
    setJogadorSelecionado(jogador);
    setDetalhesDialogAberto(true);
  };

  const handleExcluirJogador = (jogador: Jogador) => {
    setJogadorSelecionado(jogador);
    setDeleteDialogAberto(true);
  };

  const confirmarExclusao = async () => {
    if (!jogadorSelecionado) return;

    try {
      await jogadorService.delete(jogadorSelecionado.id);
      setDeleteDialogAberto(false);
      setJogadorSelecionado(null);
      carregarJogadores();
    } catch (err) {
      console.error('Erro ao excluir jogador:', err);
      setError('Erro ao excluir jogador');
    }
  };

  const handleSuccessDialog = () => {
    setDialogAberto(false);
    setJogadorParaEditar(undefined);
    carregarJogadores();
  };

  // Dados paginados
  const indiceInicio = (paginaAtual - 1) * ITEMS_POR_PAGINA;
  const indiceFim = indiceInicio + ITEMS_POR_PAGINA;
  const jogadoresPaginados = jogadoresFiltrados.slice(indiceInicio, indiceFim);

  // Cidades únicas para filtro
  const cidadesUnicas = Array.from(
    new Set(jogadores.map(j => j.cidade).filter(Boolean))
  ).sort();

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Gestão de Jogadores
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            Importar
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            Exportar
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNovoJogador}
          >
            Novo Jogador
          </Button>
        </Box>
      </Box>

      {/* Estatísticas */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
        gap: 3,
        mb: 3 
      }}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <PersonIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {stats.total}
            </Typography>
            <Typography color="text.secondary">Total de Jogadores</Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {stats.ativos}
            </Typography>
            <Typography color="text.secondary">Jogadores Ativos</Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <TrophyIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {stats.comVitorias}
            </Typography>
            <Typography color="text.secondary">Com Vitórias</Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
              {stats.total > 0 ? Math.round((stats.comVitorias / stats.total) * 100) : 0}%
            </Typography>
            <Typography color="text.secondary">Taxa de Campeões</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            md: '2fr 1fr 1fr 1fr 1fr' 
          },
          gap: 2,
          alignItems: 'center'
        }}>
          <TextField
            fullWidth
            label="Buscar jogador"
            value={filtros.search}
            onChange={(e) => handleFiltroChange('search', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            placeholder="Nome, apelido, email..."
          />

          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filtros.ativo ?? ''}
              onChange={(e) => handleFiltroChange('ativo', e.target.value === '' ? undefined : e.target.value === 'true')}
              label="Status"
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="true">Ativos</MenuItem>
              <MenuItem value="false">Inativos</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Cidade</InputLabel>
            <Select
              value={filtros.cidade}
              onChange={(e) => handleFiltroChange('cidade', e.target.value)}              label="Cidade"
            >
              <MenuItem value="">Todas</MenuItem>
              {cidadesUnicas.map((cidade) => (
                <MenuItem key={cidade} value={cidade}>
                  {cidade}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Ordenar por</InputLabel>
            <Select
              value={filtros.ordenacao}
              onChange={(e) => handleFiltroChange('ordenacao', e.target.value)}
              label="Ordenar por"
            >
              <MenuItem value="nome">Nome</MenuItem>
              <MenuItem value="pontos">Pontos</MenuItem>
              <MenuItem value="vitorias">Vitórias</MenuItem>
              <MenuItem value="torneios">Torneios</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            onClick={limparFiltros}
            startIcon={<FilterListIcon />}
          >
            Limpar
          </Button>
        </Box>

        {/* Chips de filtros ativos */}
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {filtros.ativo !== undefined && (
            <Chip
              label={`Status: ${filtros.ativo ? 'Ativo' : 'Inativo'}`}
              onDelete={() => handleFiltroChange('ativo', undefined)}
              size="small"
            />
          )}
          {filtros.cidade && (
            <Chip
              label={`Cidade: ${filtros.cidade}`}
              onDelete={() => handleFiltroChange('cidade', '')}
              size="small"
            />
          )}
          {filtros.search && (
            <Chip
              label={`Busca: ${filtros.search}`}
              onDelete={() => handleFiltroChange('search', '')}
              size="small"
            />
          )}
        </Box>
      </Paper>

      {/* Resultados */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Mostrando {jogadoresPaginados.length} de {jogadoresFiltrados.length} jogador(es)
        </Typography>
      </Box>

      {/* Lista de jogadores */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : jogadoresPaginados.length > 0 ? (
        <>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: '1fr 1fr', 
              md: '1fr 1fr 1fr' 
            },
            gap: 3
          }}>
            {jogadoresPaginados.map((jogador) => (
              <JogadorCard
                key={jogador.id}
                jogador={jogador}
                onEdit={handleEditarJogador}
                onDelete={handleExcluirJogador}
                onViewDetails={handleVerDetalhes}
              />
            ))}
          </Box>

          {/* Paginação */}
          {totalPaginas > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPaginas}
                page={paginaAtual}
                onChange={(event, page) => setPaginaAtual(page)}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <PersonIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            Nenhum jogador encontrado
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {filtros.search || filtros.ativo !== undefined || filtros.cidade
              ? 'Tente ajustar os filtros de busca'
              : 'Começe criando seu primeiro jogador'
            }
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNovoJogador}
          >
            Novo Jogador
          </Button>
        </Paper>
      )}

      {/* FAB para adicionar */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: { xs: 'flex', md: 'none' },
        }}
        onClick={handleNovoJogador}
      >
        <AddIcon />
      </Fab>

      {/* Diálogos */}
      <JogadorDialog
        open={dialogAberto}
        onClose={() => setDialogAberto(false)}
        onSuccess={handleSuccessDialog}
        jogador={jogadorParaEditar}
      />

      <JogadorDetalhesDialog
        open={detalhesDialogAberto}
        onClose={() => setDetalhesDialogAberto(false)}
        onEdit={handleEditarJogador}
        jogador={jogadorSelecionado}
      />

      {/* Diálogo de confirmação de exclusão */}
      <Dialog
        open={deleteDialogAberto}
        onClose={() => setDeleteDialogAberto(false)}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir o jogador{' '}
            <strong>{jogadorSelecionado?.nome}</strong>?
            <br />
            <br />
            Esta ação não pode ser desfeita e todos os dados relacionados 
            (participações em torneios, rankings, etc.) serão perdidos.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogAberto(false)}>
            Cancelar
          </Button>
          <Button onClick={confirmarExclusao} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
