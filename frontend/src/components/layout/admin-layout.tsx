'use client'

import { useAuth } from '@/context/auth-context'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { 
  Dashboard as DashboardIcon,
  EmojiEvents as TrophyIcon,
  SportsEsports as TournamentIcon,
  People as UsersIcon,
  Leaderboard as RankingIcon,
  PhotoLibrary as GalleryIcon,
  AddPhotoAlternate as PhotoManageIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Menu as MenuIcon,
  AccountCircle,
} from '@mui/icons-material'

interface AdminLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: DashboardIcon },
  { name: 'Temporadas', href: '/temporadas', icon: TrophyIcon },
  { name: 'Torneios', href: '/torneios', icon: TournamentIcon },
  { name: 'Jogadores', href: '/jogadores', icon: UsersIcon },
  { name: 'Rankings', href: '/rankings', icon: RankingIcon },
  { name: 'Galeria', href: '/galeria', icon: GalleryIcon },
  { name: 'Fotos', href: '/fotos', icon: PhotoManageIcon },
  { name: 'Administração', href: '/admin', icon: SettingsIcon },
]

const DRAWER_WIDTH = 280

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    handleProfileMenuClose()
    logout()
  }

  const isMenuOpen = Boolean(anchorEl)

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        <Box
          sx={{
            fontSize: '2rem',
            filter: 'grayscale(0.2)',
          }}
        >
          🃏
        </Box>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
            }}
          >
            ACES POKER
          </Typography>
          <Chip
            label="ADMIN"
            size="small"
            sx={{
              backgroundColor: 'rgba(0,0,0,0.08)',
              color: 'text.secondary',
              fontWeight: 500,
              fontSize: '0.7rem',
              height: 20,
            }}
          />
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: 'auto', py: 2 }}>
        <List>
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <ListItem key={item.name} disablePadding sx={{ px: 2, mb: 0.5 }}>
                <ListItemButton
                  onClick={() => {
                    router.push(item.href)
                    if (isMobile) {
                      setMobileOpen(false)
                    }
                  }}
                  selected={isActive}
                  sx={{
                    borderRadius: 2,
                    minHeight: 48,
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      borderLeft: '3px solid',
                      borderLeftColor: 'text.primary',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.08)',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? 'text.primary' : 'text.secondary',
                      minWidth: 40,
                    }}
                  >
                    <Icon />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? 'text.primary' : 'text.primary',
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
      </Box>

      {/* User info */}
      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          backgroundColor: 'background.default',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 1,
            borderRadius: 2,
            backgroundColor: 'background.paper',
            border: 1,
            borderColor: 'divider',
          }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              backgroundColor: 'action.selected',
              color: 'text.primary',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            {user.nome?.charAt(0).toUpperCase() || 'A'}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {user.nome}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: '0.75rem',
              }}
            >
              Administrador
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { lg: `${DRAWER_WIDTH}px` },
          backgroundColor: 'background.paper',
          backgroundImage: 'none',
          borderBottom: 1,
          borderColor: 'divider',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { lg: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Olá, {user.nome}
            </Typography>

            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        id="primary-search-account-menu"
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isMenuOpen}
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            borderRadius: 2,
            border: 1,
            borderColor: 'divider',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          },
        }}
      >
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Configurações
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Sair
        </MenuItem>
      </Menu>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { lg: DRAWER_WIDTH }, flexShrink: { lg: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              border: 'none',
              backgroundImage: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', lg: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              border: 'none',
              borderRight: 1,
              borderColor: 'divider',
              backgroundImage: 'none',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}
