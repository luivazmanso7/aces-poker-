'use client';

import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Divider,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  EmojiEvents as TrophyIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { Torneio } from '@/types/torneio';
import { torneioApi } from '@/services/torneio.service';

interface TorneioCardProps {
  torneio: Torneio;
  onEdit: (torneio: Torneio) => void;
  onDelete: (id: number) => void;
  onViewParticipacoes: (torneio: Torneio) => void;
  onManageParticipacoes: (torneio: Torneio) => void;
}

export default function TorneioCard({
  torneio,
  onEdit,
  onDelete,
  onViewParticipacoes,
  onManageParticipacoes,
}: TorneioCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(torneio);
    handleMenuClose();
  };

  const handleDelete = () => {
    if (showConfirmDelete) {
      onDelete(torneio.id);
      setShowConfirmDelete(false);
    } else {
      setShowConfirmDelete(true);
    }
    handleMenuClose();
  };

  const handleViewParticipacoes = () => {
    onViewParticipacoes(torneio);
    handleMenuClose();
  };

  const handleManageParticipacoes = () => {
    onManageParticipacoes(torneio);
    handleMenuClose();
  };

  const isUpcoming = torneioApi.isUpcoming(torneio.data_hora);
  const isPast = torneioApi.isPast(torneio.data_hora);
  const participantesCount = torneio._count?.participacoes || 0;

  const getStatusColor = (): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    if (!torneio.ativo) return 'error';
    if (isPast) return 'success';
    if (isUpcoming) return 'warning';
    return 'primary';
  };

  const getStatusLabel = () => {
    if (!torneio.ativo) return 'Inativo';
    if (isPast) return 'Finalizado';
    if (isUpcoming) return 'Agendado';
    return 'Ativo';
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
        opacity: torneio.ativo ? 1 : 0.7,
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Header com título e status */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flexGrow: 1, mr: 1 }}>
            <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
              {torneio.nome}
            </Typography>
            <Chip
              label={getStatusLabel()}
              color={getStatusColor()}
              size="small"
              variant="outlined"
              icon={torneio.ativo ? <VisibilityIcon /> : <VisibilityOffIcon />}
            />
          </Box>
          
          <IconButton
            size="small"
            onClick={handleMenuOpen}
            sx={{ mt: -1 }}
          >
            <MoreVertIcon />
          </IconButton>
        </Box>

        {/* Informações principais */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {/* Data e Hora */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ScheduleIcon color="action" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {torneioApi.formatDateTime(torneio.data_hora)}
            </Typography>
          </Box>

          {/* Local */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationIcon color="action" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {torneio.local}
            </Typography>
          </Box>

          {/* Participantes */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PeopleIcon color="action" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {participantesCount} participante{participantesCount !== 1 ? 's' : ''}
            </Typography>
          </Box>

          {/* Temporada */}
          {torneio.temporada && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrophyIcon color="action" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {torneio.temporada.nome} ({torneio.temporada.ano})
              </Typography>
            </Box>
          )}

          {/* Observações */}
          {torneio.observacoes && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                {torneio.observacoes.length > 100 
                  ? `${torneio.observacoes.substring(0, 100)}...`
                  : torneio.observacoes
                }
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>

      <Divider />

      {/* Actions */}
      <CardActions sx={{ px: 2, py: 1.5, justifyContent: 'space-between' }}>
        <Button
          size="small"
          startIcon={<PeopleIcon />}
          onClick={handleViewParticipacoes}
          color="primary"
        >
          Ver Participações
        </Button>

        <Button
          size="small"
          variant="outlined"
          onClick={handleManageParticipacoes}
          disabled={isPast && participantesCount === 0}
        >
          Gerenciar
        </Button>
      </CardActions>

      {/* Menu de Ações */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Editar
        </MenuItem>
        
        <MenuItem onClick={handleViewParticipacoes}>
          <PeopleIcon fontSize="small" sx={{ mr: 1 }} />
          Ver Participações
        </MenuItem>
        
        <MenuItem onClick={handleManageParticipacoes}>
          <TrophyIcon fontSize="small" sx={{ mr: 1 }} />
          Gerenciar Participações
        </MenuItem>
        
        <Divider />
        
        <MenuItem 
          onClick={handleDelete}
          sx={{ 
            color: showConfirmDelete ? 'error.main' : 'inherit',
            bgcolor: showConfirmDelete ? 'error.50' : 'inherit',
          }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          {showConfirmDelete ? 'Confirmar Exclusão' : 'Excluir'}
        </MenuItem>
      </Menu>
    </Card>
  );
}
