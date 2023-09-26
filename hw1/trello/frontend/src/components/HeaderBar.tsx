import { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Card from "@/components/Card";
import type { CardProps } from "@/components/Card";
import CardDialog from "@/components/CardDialog";
import useCards from "@/hooks/useCards";
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
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
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
      <CardDialog
          variant="new"
          open={newCardDialogOpen}
          onClose={() => setNewCardDialogOpen(false)}
          // listId={id}
        />
    </AppBar>
  );
}
