import { useRef, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import useSongs from "@/hooks/useSongs";
import { deleteList, updateList } from "@/utils/client";

import Song from "./Song";
import type { SongProps } from "./Song";
import SongDialog from "./SongDialog";

import Band from "../../../img/band.jpg";

export type SongListProps = {
  id: string;
  name: string;
  songs: SongProps[];
};

export default function SongList({ id, name, songs }: SongListProps) {
  const [openNewSongDialog, setOpenNewSongDialog] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const { fetchLists } = useSongs();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpdateName = async () => {
    if (!inputRef.current) return;

    const newName = inputRef.current.value;
    if (newName !== name) {
      try {
        await updateList(id, { name: newName });
        fetchLists();
      } catch (error) {
        alert("Error: Failed to update list name");
      }
    }
    setEditingName(false);
  };

  const handleDelete = async () => {
    try {
      await deleteList(id);
      fetchLists();
    } catch (error) {
      alert("Error: Failed to delete list");
    }
  };

  return (
    <>
      <Paper className="w-80 p-6">
        <img src={Band} width={250} height={250} alt="Band"/>
        <div className="flex gap-4">
          {editingName ? (
            <ClickAwayListener onClickAway={handleUpdateName}>
              <Input
                autoFocus
                defaultValue={name}
                className="grow"
                placeholder="Enter a new name for this list..."
                sx={{ fontSize: "2rem" }}
                inputRef={inputRef}
              />
            </ClickAwayListener>
          ) : (
            <button
              onClick={() => setEditingName(true)}
              className="w-full rounded-md p-2 hover:bg-white/10"
            >
              <Typography className="text-start" variant="h4">
                {name}
              </Typography>
            </button>
          )}
          <div className="grid place-items-center">
            <IconButton color="error" onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
        <Divider variant="middle" sx={{ mt: 1, mb: 2 }} />
        <div className="flex flex-col gap-4">
          {songs.map((song) => (
            <Song key={song.id} {...song} />
          ))}
          <Button
            variant="contained"
            onClick={() => setOpenNewSongDialog(true)}
          >
            <AddIcon className="mr-2" />
            Add a song
          </Button>
        </div>
      </Paper>
      <SongDialog
        variant="new"
        open={openNewSongDialog}
        onClose={() => setOpenNewSongDialog(false)}
        listId={id}
      />
    </>
  );
}
