'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Typography,
  Box,
  Chip,
  Paper,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Stars as StarsIcon,
} from '@mui/icons-material';
import { Temporada, Ranking } from '@/types/temporada';

interface RankingDialogProps {
  open: boolean;
  onClose: () => void;
  temporada: Temporada | null;
  ranking: Ranking[];
}

export default function RankingDialog({ open, onClose, temporada, ranking }: RankingDialogProps) {
  if (!temporada) return null;

  const getRankingIcon = (posicao: number) => {
    switch (posicao) {
      case 1:
        return <TrophyIcon sx={{ color: '#FFD700' }} />;
      case 2:
        return <TrophyIcon sx={{ color: '#C0C0C0' }} />;
      case 3:
        return <TrophyIcon sx={{ color: '#CD7F32' }} />;
      default:
        return <StarsIcon sx={{ color: 'action.disabled' }} />;
    }
  };

  const getRankingColor = (posicao: number): 'warning' | 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' => {
    switch (posicao) {
      case 1:
        return 'warning';
      case 2:
        return 'default';
      case 3:
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TrophyIcon color="primary" />
          <div>
            <Typography variant="h6" component="div">
              Ranking - {temporada.nome}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {temporada.ano} • {ranking.length} jogador{ranking.length !== 1 ? 'es' : ''}
            </Typography>
          </div>
        </Box>
      </DialogTitle>

      <DialogContent>
        {ranking.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              Nenhum ranking disponível para esta temporada.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Execute o cálculo de ranking para gerar os resultados.
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width="80px">Posição</TableCell>
                  <TableCell>Jogador</TableCell>
                  <TableCell align="right">Pontuação</TableCell>
                  <TableCell align="right" width="140px">Atualizado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ranking.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getRankingIcon(item.posicao)}
                        <Chip
                          label={`${item.posicao}º`}
                          size="small"
                          color={getRankingColor(item.posicao)}
                          variant={item.posicao <= 3 ? 'filled' : 'outlined'}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={item.jogador.avatar_url}
                          alt={item.jogador.nome}
                          sx={{ width: 32, height: 32 }}
                        >
                          {item.jogador.nome.charAt(0).toUpperCase()}
                        </Avatar>
                        <div>
                          <Typography variant="body2" fontWeight="medium">
                            {item.jogador.nome}
                          </Typography>
                          {item.jogador.apelido && (
                            <Typography variant="caption" color="text.secondary">
                              &ldquo;{item.jogador.apelido}&rdquo;
                            </Typography>
                          )}
                        </div>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="medium">
                        {item.pontuacao.toLocaleString()} pts
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(item.atualizado_em)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}