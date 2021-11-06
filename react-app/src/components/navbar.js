import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as LinkRouter } from 'react-router-dom';
import { useState } from 'react';
import { Link, List, ListItem, ListItemText } from '@mui/material';


const NavBar = () => { 

    const [sideMenu,setSideMenu]= useState(false)
    

return(
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
            <IconButton onClick={()=>setSideMenu(true)} size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                <MenuIcon />
            </IconButton>
            <Drawer anchor='left' open={sideMenu} onClose={()=>setSideMenu(false)}>
                <Box sx={{ width:250 }} role="presentation"></Box>
                <List>
                    <ListItem button component={LinkRouter}  to="/home" >
                        <Link underline="none" >
                            <ListItemText primary={'Home'}></ListItemText>
                        </Link>
                    </ListItem>
                    <ListItem button component={LinkRouter}  to="/logs" >
                        <Link underline="none" >
                            <ListItemText primary={'Logs'}></ListItemText>
                        </Link>
                    </ListItem>
                    <ListItem button component={LinkRouter}  to="/single" >
                        <Link underline="none" >
                            <ListItemText primary={'Real Time Player Stats'}></ListItemText>
                        </Link>
                    </ListItem>
                </List>
            </Drawer>

            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                USAC Squid Game
            </Typography>
            
        </Toolbar>
      </AppBar>
    </Box>
)


}   

export default NavBar