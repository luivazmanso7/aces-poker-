'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingUp as TrendingUpIcon,
  EmojiEvents as TrophyIcon,
  CalendarToday as CalendarIcon,
  SportsCricket as TournamentIcon,
} from '@mui/icons-material';
import { Temporada } from '@/types/temporada';

interface TemporadaCardProps {
  temporada: Temporada;
  onEdit: (temporada: Temporada) => void;
  onDelete: (id: number) => void;
  onViewRanking: (temporada: Temporada) => void;
  onCalculateRanking: (id: number) => void;
  isCurrentSeason?: boolean;
}

export default function TemporadaCard({ 
  temporada, 
  onEdit, 
  onDelete, 
  onViewRanking, 
  onCalculateRanking, 
  isCurrentSeason = false 
}: TemporadaCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    onDelete(temporada.id);
    setDeleteDialogOpen(false);
    handleMenuClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const torneiosCount = temporada.torneios?.length || 0;
  const rankingCount = temporada.rankings?.length || 0;

  return (
    <>
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 3,
          }
        }}
      >
        {isCurrentSeason && (
          <Chip
            label="Temporada Atual"
            color="primary"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              zIndex: 1,
            }}
          />
        )}

        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
        </Box>

        <CardContent sx={{ flexGrow: 1, pt: isCurrentSeason ? 5 : 2 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            {temporada.nome}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <CalendarIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {temporada.ano}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TournamentIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {torneiosCount} torneio{torneiosCount !== 1 ? 's' : ''}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrophyIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {rankingCount} jogador{rankingCount !== 1 ? 'es' : ''} no ranking
              </Typography>
            </Box>
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            Criada em {formatDate(temporada.criada_em)}
          </Typography>
        </CardContent>

        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
          <Button
            size="small"
            startIcon={<TrendingUpIcon />}
            onClick={() => onViewRanking(temporada)}
            disabled={rankingCount === 0}
          >
            Ver Ranking
          </Button>

          <Button
            size="small"
            variant="outlined"
            onClick={() => onCalculateRanking(temporada.id)}
            disabled={torneiosCount === 0}
          >
            Calcular
          </Button>
        </CardActions>
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => { onEdit(temporada); handleMenuClose(); }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => { setDeleteDialogOpen(true); handleMenuClose(); }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Excluir</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Esta ação não pode ser desfeita!
          </Alert>
          <Typography>
            Tem certeza que deseja excluir a temporada &quot;{temporada.nome}&quot;?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Todos os torneios e rankings associados também serão removidos.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
