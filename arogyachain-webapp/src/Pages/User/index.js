/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-unused-vars */
import Home from './Home';
import Ehrs from './EHRs';
import ACLHistory from './ACLHistory';
import { useAxios } from '../../utils/axios';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import ArticleIcon from '@mui/icons-material/Article';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ControlCameraIcon from '@mui/icons-material/ControlCamera';
import { useState } from 'react';
import {
  Link,
  Switch,
  useRouteMatch,
  Route,
  Redirect,
  useHistory,
} from 'react-router-dom';
import urlJoin from 'url-join';
import { toast } from 'react-toastify';
import { useStoreState, useStoreActions } from 'easy-peasy';

const drawerWidth = 240;

function ResponsiveDrawer(props) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const match = useRouteMatch();
  const axios = useAxios();
  const identity = useStoreState(store => store?.identityDetails?.identity);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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
      {
        name: 'ACL Hisotry',
        path: '/accessControlHistory',
        icon: ControlCameraIcon,
      },
    ];

    return menu;
  }

  const drawer = (
    <div>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
          style={{ textAlign: 'center' }}
        >
          Arogyachain
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {generateDrawerMenuItems()?.map((item, i) => (
          <ListItem
            key={item?.name}
            disablePadding
            component={Link}
            to={item?.path}
            style={{ color: '#865DFF' }}
            onClick={() => handleDrawerToggle()}
          >
            <ListItemButton
              selected={window?.location?.pathname?.startsWith(item?.path)}
            >
              <ListItemIcon>
                <item.icon style={{ color: '#865DFF' }} />
              </ListItemIcon>
              <ListItemText primary={item?.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window.document.body : undefined;

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
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
            style={{ textAlign: 'left' }}
          >
            Arogyachain
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
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          overflowX: 'hidden',
          textAlign: 'left',
        }}
      >
        <Toolbar />
        <Switch>
          <Route path={urlJoin(match.path, 'myEhrs')}>
            <Ehrs />
          </Route>
          <Route path={urlJoin(match.path, 'home')} strict>
            <Home />
          </Route>
          <Route path={urlJoin(match.path, 'accessControlHistory')} strict>
            <ACLHistory />
          </Route>
          <Route path={urlJoin(match.path, '/')} strict>
            <Redirect to={urlJoin(match.path, 'home')} />
          </Route>
        </Switch>
      </Box>
    </Box>
  );
}

export default ResponsiveDrawer;
