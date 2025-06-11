'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PhotoLibrary as PhotoLibraryIcon,
  CloudUpload as UploadIcon
} from '@mui/icons-material'
import { FotoAdminService, type Foto, type GaleriaOrganizada } from '@/services/foto-admin.service'
import { Temporada, Torneio } from '@/types/temporada'

const categorias = [
  { value: 'TEMPORADA', label: 'Temporada' },
  { value: 'HALL_DA_FAMA', label: 'Hall da Fama' },
  { value: 'MELHORES_MOMENTOS', label: 'Melhores Momentos' }
]

export default function GerenciamentoFotosPage() {
  const [galeria, setGaleria] = useState<GaleriaOrganizada>({
    temporadas: [],
    hall_da_fama: [],
    melhores_momentos: []
  })
  const [tabValue, setTabValue] = useState(0)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingFoto, setEditingFoto] = useState<Foto | null>(null)
  const [loading, setLoading] = useState(true)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })

  // Estados para dados de seleção
  const [temporadas, setTemporadas] = useState<Temporada[]>([])
  const [torneios, setTorneios] = useState<Torneio[]>([])
  const [loadingSelects, setLoadingSelects] = useState(false)

  const [formData, setFormData] = useState({
    imagem_url: '',
    legenda: '',
    album: '',
    categoria: 'TEMPORADA' as 'TEMPORADA' | 'HALL_DA_FAMA' | 'MELHORES_MOMENTOS',
    id_torneio: '',
    id_temporada: ''
  })
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('file')

  useEffect(() => {
    fetchGaleria()
    fetchSelectionData()
  }, [])

  // Função para carregar dados dos selects
  const fetchSelectionData = async () => {
    try {
      setLoadingSelects(true)
      const [temporadasData, torneiosData] = await Promise.all([
        FotoAdminService.getTemporadas(),
        FotoAdminService.getTorneios()
      ])
      
      setTemporadas(temporadasData)
      setTorneios(torneiosData)
    } catch (error) {
      console.error('Erro ao carregar dados de seleção:', error)
      setSnackbar({ open: true, message: 'Erro ao carregar dados', severity: 'error' })
    } finally {
      setLoadingSelects(false)
    }
  }

  // Atualizar preview quando arquivo é selecionado
  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setPreviewUrl('')
    }
  }, [selectedFile])

  // Atualizar preview quando URL é inserida
  useEffect(() => {
    if (uploadMode === 'url' && formData.imagem_url) {
      setPreviewUrl(formData.imagem_url)
    }
  }, [formData.imagem_url, uploadMode])

  const fetchGaleria = async () => {
    try {
      setLoading(true)
      const response = await FotoAdminService.getGaleriaOrganizada()
      setGaleria(response)
    } catch (error) {
      console.error('Erro ao carregar galeria:', error)
      setSnackbar({ open: true, message: 'Erro ao carregar galeria', severity: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (foto?: Foto) => {
    if (foto) {
      setEditingFoto(foto)
      setFormData({
        imagem_url: foto.imagem_url,
        legenda: foto.legenda || '',
        album: foto.album,
        categoria: foto.categoria,
        id_torneio: foto.id_torneio?.toString() || '',
        id_temporada: foto.id_temporada?.toString() || ''
      })
      setUploadMode('url')
      setPreviewUrl(foto.imagem_url)
    } else {
      setEditingFoto(null)
      setFormData({
        imagem_url: '',
        legenda: '',
        album: '',
        categoria: 'TEMPORADA',
        id_torneio: '',
        id_temporada: ''
      })
      setUploadMode('file')
      setPreviewUrl('')
      setSelectedFile(null)
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingFoto(null)
    setSelectedFile(null)
    setPreviewUrl('')
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleSubmit = async () => {
    try {
      if (editingFoto) {
        // Editar foto existente
        const dataToSend = {
          ...formData,
          id_torneio: formData.id_torneio ? parseInt(formData.id_torneio) : null,
          id_temporada: formData.id_temporada ? parseInt(formData.id_temporada) : null
        }
        await FotoAdminService.updateFoto(editingFoto.id, dataToSend)
        setSnackbar({ open: true, message: 'Foto atualizada com sucesso!', severity: 'success' })
      } else {
        // Criar nova foto
        const baseData = {
          legenda: formData.legenda,
          album: formData.album,
          categoria: formData.categoria,
          id_torneio: formData.id_torneio ? parseInt(formData.id_torneio) : null,
          id_temporada: formData.id_temporada ? parseInt(formData.id_temporada) : null
        }

        if (uploadMode === 'file' && selectedFile) {
          // Upload de arquivo
          await FotoAdminService.uploadFoto(selectedFile, baseData)
        } else if (uploadMode === 'url' && formData.imagem_url) {
          // Upload por URL
          await FotoAdminService.createFoto({
            ...baseData,
            imagem_url: formData.imagem_url
          })
        } else {
          throw new Error('Selecione um arquivo ou insira uma URL válida')
        }
        
        setSnackbar({ open: true, message: 'Foto adicionada com sucesso!', severity: 'success' })
      }

      handleCloseDialog()
      fetchGaleria()
    } catch (error) {
      console.error('Erro ao salvar foto:', error)
      setSnackbar({ open: true, message: 'Erro ao salvar foto', severity: 'error' })
    }
  }

  const handleDelete = async (fotoId: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta foto?')) {
      try {
        await FotoAdminService.deleteFoto(fotoId)
        setSnackbar({ open: true, message: 'Foto excluída com sucesso!', severity: 'success' })
        fetchGaleria()
      } catch (error) {
        console.error('Erro ao excluir foto:', error)
        setSnackbar({ open: true, message: 'Erro ao excluir foto', severity: 'error' })
      }
    }
  }

  const getCurrentFotos = () => {
    switch (tabValue) {
      case 0: return galeria.temporadas
      case 1: return galeria.hall_da_fama
      case 2: return galeria.melhores_momentos
      default: return []
    }
  }

  const getCategoriaLabel = (categoria: string) => {
    return categorias.find(cat => cat.value === categoria)?.label || categoria
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center' }}>
          <PhotoLibraryIcon sx={{ mr: 2 }} />
          Gerenciamento de Fotos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Adicionar Foto
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label={`Temporada (${galeria.temporadas.length})`} />
          <Tab label={`Hall da Fama (${galeria.hall_da_fama.length})`} />
          <Tab label={`Melhores Momentos (${galeria.melhores_momentos.length})`} />
        </Tabs>
      </Box>

      {loading ? (
        <Typography>Carregando...</Typography>
      ) : (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: 3 
        }}>
          {getCurrentFotos().map((foto) => (
            <Card key={foto.id}>
              <CardMedia
                component="img"
                height="200"
                image={foto.imagem_url}
                alt={foto.legenda}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h6" component="h3" noWrap>
                  {foto.legenda || 'Sem legenda'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Álbum: {foto.album}
                </Typography>
                <Chip
                  label={getCategoriaLabel(foto.categoria)}
                  size="small"
                  sx={{ mt: 1 }}
                />
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  {new Date(foto.data).toLocaleDateString('pt-BR')}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  color="primary"
                  onClick={() => handleOpenDialog(foto)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDelete(foto.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}

      {/* Dialog para adicionar/editar foto */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingFoto ? 'Editar Foto' : 'Adicionar Nova Foto'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            
            {/* Seleção do modo de upload */}
            {!editingFoto && (
              <FormControl component="fieldset">
                <FormLabel component="legend">Método de Upload</FormLabel>
                <RadioGroup
                  row
                  value={uploadMode}
                  onChange={(e) => setUploadMode(e.target.value as 'url' | 'file')}
                >
                  <FormControlLabel value="file" control={<Radio />} label="Upload de Arquivo" />
                  <FormControlLabel value="url" control={<Radio />} label="URL da Imagem" />
                </RadioGroup>
              </FormControl>
            )}

            {/* Upload de arquivo */}
            {uploadMode === 'file' && !editingFoto && (
              <Box>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<UploadIcon />}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Selecionar Arquivo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
                {selectedFile && (
                  <Typography variant="body2" color="text.secondary">
                    Arquivo selecionado: {selectedFile.name}
                  </Typography>
                )}
              </Box>
            )}

            {/* URL da imagem */}
            {uploadMode === 'url' && (
              <TextField
                label="URL da Imagem"
                value={formData.imagem_url}
                onChange={(e) => setFormData({ ...formData, imagem_url: e.target.value })}
                fullWidth
                required={uploadMode === 'url'}
              />
            )}

            {/* Preview da imagem */}
            {previewUrl && (
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Preview:
                </Typography>
                <Box
                  component="img"
                  src={previewUrl}
                  alt="Preview"
                  sx={{
                    maxWidth: '100%',
                    maxHeight: 200,
                    objectFit: 'contain',
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1
                  }}
                />
              </Box>
            )}

            <TextField
              label="Legenda"
              value={formData.legenda}
              onChange={(e) => setFormData({ ...formData, legenda: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />
            
            <TextField
              label="Álbum"
              value={formData.album}
              onChange={(e) => setFormData({ ...formData, album: e.target.value })}
              fullWidth
              required
            />
            
            <FormControl fullWidth required>
              <InputLabel>Categoria</InputLabel>
              <Select
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value as 'TEMPORADA' | 'HALL_DA_FAMA' | 'MELHORES_MOMENTOS' })}
                label="Categoria"
              >
                {categorias.map((categoria) => (
                  <MenuItem key={categoria.value} value={categoria.value}>
                    {categoria.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {/* Seletores avançados para associações */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Associações (opcionais)
              </Typography>
              
              {/* Seletor de Temporada */}
              <FormControl fullWidth>
                <InputLabel>Temporada</InputLabel>
                <Select
                  value={formData.id_temporada}
                  onChange={(e) => setFormData({ ...formData, id_temporada: e.target.value })}
                  label="Temporada"
                  disabled={loadingSelects}
                >
                  <MenuItem value="">
                    <em>Nenhuma temporada</em>
                  </MenuItem>
                  {temporadas.map((temporada) => (
                    <MenuItem key={temporada.id} value={temporada.id}>
                      {temporada.nome} ({temporada.ano})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Seletor de Torneio */}
              <FormControl fullWidth>
                <InputLabel>Torneio</InputLabel>
                <Select
                  value={formData.id_torneio}
                  onChange={(e) => setFormData({ ...formData, id_torneio: e.target.value })}
                  label="Torneio"
                  disabled={loadingSelects}
                >
                  <MenuItem value="">
                    <em>Nenhum torneio</em>
                  </MenuItem>
                  {torneios
                    .filter(torneio => !formData.id_temporada || torneio.id_temporada === Number(formData.id_temporada))
                    .map((torneio) => (
                      <MenuItem key={torneio.id} value={torneio.id}>
                        {torneio.nome} - {new Date(torneio.data_hora).toLocaleDateString('pt-BR')}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingFoto ? 'Atualizar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
