import {useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CardDialogEdit from "./CardDialogEdit";
import { Add as AddIcon } from "@mui/icons-material";
import { Button } from "@mui/material";

export default function HeaderBar() {
  const [newCardDialogOpen, setNewCardDialogOpen] = useState(false);
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h3" component="div" sx={{ flexGrow: 1 }} justifyContent="center" align="center">
          Diary
        </Typography>
        <Button
          variant="contained"
          onClick={() => setNewCardDialogOpen(true)}
        >
          <AddIcon className="mr-2" />
          新增
        </Button>
      </Toolbar>
      <CardDialogEdit
        variant="new"
        open={newCardDialogOpen}
        onClose={() => setNewCardDialogOpen(false)}
      />
    </AppBar>
  );
}
