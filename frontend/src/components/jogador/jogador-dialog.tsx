'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Box,
  Alert,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Close as CloseIcon,
  PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';

import type { Jogador, CreateJogadorDto, UpdateJogadorDto } from '@/types/jogador';
import { jogadorService } from '@/services/jogador.service';

interface JogadorDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  jogador?: Jogador; // Se fornecido, é edição; se não, é criação
}

export default function JogadorDialog({ open, onClose, onSuccess, jogador }: JogadorDialogProps) {
  const [formData, setFormData] = useState<CreateJogadorDto>({
    nome: '',
    email: '',
    telefone: '',
    apelido: '',
    avatar_url: '',
    bio: '',
    cidade: '',
    data_nascimento: '',
    ativo: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const isEdit = !!jogador;

  // Inicializar formulário quando abrir ou mudar jogador
  useEffect(() => {
    if (open) {
      if (jogador) {
        // Edição - preencher com dados do jogador
        setFormData({
          nome: jogador.nome,
          email: jogador.email || '',
          telefone: jogador.telefone || '',
          apelido: jogador.apelido || '',
          avatar_url: jogador.avatar_url || '',
          bio: jogador.bio || '',
          cidade: jogador.cidade || '',
          data_nascimento: jogador.data_nascimento ? jogador.data_nascimento.split('T')[0] : '',
          ativo: jogador.ativo,
        });
      } else {
        // Criação - limpar formulário
        setFormData({
          nome: '',
          email: '',
          telefone: '',
          apelido: '',
          avatar_url: '',
          bio: '',
          cidade: '',
          data_nascimento: '',
          ativo: true,
        });
      }
      setErrors({});
      setSubmitError('');
    }
  }, [open, jogador]);

  const handleInputChange = (field: keyof CreateJogadorDto) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Nome é obrigatório
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    // Validar email se fornecido
    if (formData.email && !jogadorService.validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validar telefone se fornecido
    if (formData.telefone && !jogadorService.validateTelefone(formData.telefone)) {
      newErrors.telefone = 'Telefone inválido (mínimo 10 dígitos)';
    }

    // Validar data de nascimento se fornecida
    if (formData.data_nascimento) {
      const dataNasc = new Date(formData.data_nascimento);
      const hoje = new Date();
      const idade = hoje.getFullYear() - dataNasc.getFullYear();
      
      if (idade < 16) {
        newErrors.data_nascimento = 'Jogador deve ter pelo menos 16 anos';
      } else if (idade > 100) {
        newErrors.data_nascimento = 'Data de nascimento inválida';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSubmitError('');

    try {
      // Preparar dados - remover campos vazios opcionais
      const dataToSubmit = { ...formData };
      
      Object.keys(dataToSubmit).forEach(key => {
        const value = dataToSubmit[key as keyof CreateJogadorDto];
        if (value === '' || value === null || value === undefined) {
          delete dataToSubmit[key as keyof CreateJogadorDto];
        }
      });

      if (isEdit) {
        await jogadorService.update(jogador.id, dataToSubmit as UpdateJogadorDto);
      } else {
        await jogadorService.create(dataToSubmit);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar jogador:', error);
      setSubmitError('Erro ao salvar jogador. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '600px' }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{isEdit ? 'Editar Jogador' : 'Novo Jogador'}</span>
        <IconButton onClick={handleClose} disabled={loading}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}

        {/* Avatar */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={formData.avatar_url}
              sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}
            >
              {formData.nome.charAt(0).toUpperCase()}
            </Avatar>
            <Tooltip title="Adicionar foto">
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: -8,
                  right: -8,
                  bgcolor: 'background.paper',
                  boxShadow: 1,
                  '&:hover': { bgcolor: 'background.paper' }
                }}
                size="small"
              >
                <PhotoCameraIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 2
        }}>
          {/* Nome (obrigatório) */}
          <TextField
            label="Nome *"
            fullWidth
            value={formData.nome}
            onChange={handleInputChange('nome')}
            error={!!errors.nome}
            helperText={errors.nome}
            disabled={loading}
          />

          {/* Apelido */}
          <TextField
            label="Apelido"
            fullWidth
            value={formData.apelido}
            onChange={handleInputChange('apelido')}
            error={!!errors.apelido}
            helperText={errors.apelido}
              disabled={loading}
          />

          {/* Email */}
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={formData.email}
            onChange={handleInputChange('email')}
            error={!!errors.email}
            helperText={errors.email}
            disabled={loading}
          />

          {/* Telefone */}
          <TextField
            label="Telefone"
            fullWidth
            value={formData.telefone}
            onChange={handleInputChange('telefone')}
            error={!!errors.telefone}
            helperText={errors.telefone}
            placeholder="(11) 99999-9999"
            disabled={loading}
          />

          {/* Cidade */}
          <TextField
            label="Cidade"
            fullWidth
            value={formData.cidade}
            onChange={handleInputChange('cidade')}
            error={!!errors.cidade}
            helperText={errors.cidade}
            disabled={loading}
          />

          {/* Data de Nascimento */}
          <TextField
            label="Data de Nascimento"
              type="date"
            fullWidth
            value={formData.data_nascimento}
            onChange={handleInputChange('data_nascimento')}
            error={!!errors.data_nascimento}
            helperText={errors.data_nascimento}
            InputLabelProps={{ shrink: true }}
            disabled={loading}
          />

          {/* URL do Avatar */}
          <Box sx={{ gridColumn: '1 / -1' }}>
            <TextField
              label="URL do Avatar"
              fullWidth
              value={formData.avatar_url}
              onChange={handleInputChange('avatar_url')}
              error={!!errors.avatar_url}
              helperText={errors.avatar_url || 'URL da foto do perfil'}
              placeholder="https://exemplo.com/foto.jpg"
              disabled={loading}
            />
          </Box>

          {/* Bio */}
          <Box sx={{ gridColumn: '1 / -1' }}>
            <TextField
              label="Biografia"
              fullWidth
              multiline
              rows={3}
              value={formData.bio}
              onChange={handleInputChange('bio')}
              error={!!errors.bio}
              helperText={errors.bio || 'Breve descrição sobre o jogador'}
              disabled={loading}
            />
          </Box>

          {/* Status ativo */}
          <Box sx={{ gridColumn: '1 / -1' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.ativo}
                  onChange={handleInputChange('ativo')}
                  disabled={loading}
                />
              }
              label="Jogador ativo"
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !formData.nome.trim()}
        >
          {loading ? 'Salvando...' : (isEdit ? 'Salvar' : 'Criar')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
