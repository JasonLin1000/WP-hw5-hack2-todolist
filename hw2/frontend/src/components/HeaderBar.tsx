import HomeIcon from "@mui/icons-material/Home";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import uselist from "@/hooks/uselist";

export default function HeaderBar() {
  const {setPage,setList} = uselist();
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={()=>{setPage("home");setList("")}}
        >
          <HomeIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          WP Music
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
