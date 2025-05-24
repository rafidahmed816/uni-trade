import ChatIcon from "@mui/icons-material/Chat";
import ListAltIcon from "@mui/icons-material/ListAlt";
import MapIcon from "@mui/icons-material/Map";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

const drawerWidth = 260;

const MarketplaceSidebar = () => (
  <Drawer
    variant="permanent"
    sx={{
      width: drawerWidth,
      flexShrink: 0,
      [`& .MuiDrawer-paper`]: {
        width: drawerWidth,
        boxSizing: "border-box",
        bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#fff",
        top: "88px", // Position below navbar (navbar height + some padding)
        height: "calc(100vh - 88px)", // Adjust height to fill remaining viewport
      },
    }}
    PaperProps={{
      sx: {
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#fff",
        top: "88px", // Position below navbar
        height: "calc(100vh - 88px)", // Adjust height to fill remaining viewport
      },
    }}
  >
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Marketplace
      </Typography>
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon sx={{ color: "#fff" }}>
              <ChatIcon />
            </ListItemIcon>
            <ListItemText primary="Messages" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon sx={{ color: "#fff" }}>
              <ListAltIcon />
            </ListItemIcon>
            <ListItemText primary="My Listings" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon sx={{ color: "#fff" }}>
              <MapIcon />
            </ListItemIcon>
            <ListItemText primary="Meeting Maps" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  </Drawer>
);

export default MarketplaceSidebar;