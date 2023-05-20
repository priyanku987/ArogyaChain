/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
import Home from './Home';
import CreateEhr from './CreateEhr';
import PatientEhrs from './PatientEhrs';
import { useAxios } from '../../utils/axios';
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import HomeIcon from '@mui/icons-material/Home';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import PostAddIcon from '@mui/icons-material/PostAdd';
import ArticleIcon from '@mui/icons-material/Article';
import MailIcon from '@mui/icons-material/Mail';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { Link, Switch, useRouteMatch, Route, Redirect } from 'react-router-dom';
import urlJoin from 'url-join';
import { toast } from 'react-toastify';
import { useStoreState, useStoreActions } from 'easy-peasy';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: prop => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    textAlign: 'left',
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const drawerMenuItems = [
  {
    name: 'Home',
    path: '/home',
    icon: HomeIcon,
  },
  {
    name: 'Register Patient',
    path: '/registerPatient',
    icon: PersonAddIcon,
  },
  {
    name: 'Create EHR',
    path: '/createEHR',
    icon: PostAddIcon,
  },
  {
    name: 'EHRs',
    path: '/listEhrs',
    icon: ArticleIcon,
  },
];

export default function Healthcare() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const match = useRouteMatch();
  const axios = useAxios();
  const identity = useStoreState(store => store?.identityDetails?.identity);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  function generateDrawerMenuItems() {
    const menu = [
      {
        name: 'Home',
        path: '/home',
        icon: HomeIcon,
      },
      {
        name: 'My EHRs',
        path: '/myEhrs',
        icon: ArticleIcon,
      },
    ];

    if (Object.keys(identity?.attrs)?.includes('DOCTOR')) {
      menu.push({
        name: 'Patients EHRs',
        path: '/patientsEhrs',
        icon: ArticleIcon,
      });
      menu.push({
        name: 'Create EHR',
        path: '/createEhr',
        icon: PostAddIcon,
      });
    }

    if (Object.keys(identity?.attrs)?.includes('ADMIN')) {
      menu.push({
        name: 'Register Identity',
        path: '/registerIdentity',
        icon: PersonAddIcon,
      });
    }
    return menu;
  }

  async function logout() {
    try {
      setLoggingOut(true);
      await axios.post('/common/logout', {}, { withCredentials: true });
      window.location.reload();
      toast.info('Logged out successfully!', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        style: {
          backgroundColor: 'black',
        },
      });
      setLoggingOut(false);
    } catch (error) {
      toast.error('Unable to logout!', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        style: {
          backgroundColor: 'black',
        },
      });
      setLoggingOut(false);
    }
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
            style={{ textAlign: 'left' }}
          >
            Healthcare
          </Typography>

          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>My account</MenuItem>
              <MenuItem
                onClick={() => {
                  logout();
                }}
              >
                Logout {loggingOut ? 'hihi' : null}
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {generateDrawerMenuItems()?.map((item, i) => (
            <ListItem
              key={item?.name}
              disablePadding
              component={Link}
              to={item?.path}
              style={{ color: '#865DFF' }}
            >
              <ListItemButton
                selected={window.location?.pathname?.startsWith(item?.path)}
              >
                <ListItemIcon>
                  <item.icon style={{ color: '#865DFF' }} />
                </ListItemIcon>
                <ListItemText primary={item?.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main open={open} style={{ minHeight: '100%' }}>
        <DrawerHeader />
        <Switch>
          <Route path={urlJoin(match.path, 'patientsEhrs')}>
            <PatientEhrs />
          </Route>
          <Route path="/myEhrs" exact>
            <>myehr</>
          </Route>

          <Route path="/createEhr" exact>
            <CreateEhr />
          </Route>
          <Route path={urlJoin(match.path, 'home')} strict>
            <Home />
          </Route>
          <Route path={urlJoin(match.path, '/')} strict>
            <Redirect to={urlJoin(match.path, 'home')} />
          </Route>
        </Switch>
      </Main>
    </Box>
  );
}
