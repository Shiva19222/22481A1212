import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import NavBar from './components/NavBar';

export default function NavBar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          URL Shortener
        </Typography>
        <Button color="inherit" component={Link} to="/" >
          Shorten
        </Button>
        <Button color="inherit" component={Link} to="/stats" >
          Statistics
        </Button>
      </Toolbar>
    </AppBar>
  );
}
