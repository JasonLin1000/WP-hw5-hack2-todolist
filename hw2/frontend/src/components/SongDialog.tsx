import { useState } from "react";

import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Input from "@mui/material/Input";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";

import useSongs from "@/hooks/useSongs";
import { createSong,updateSong } from "@/utils/client";

// this pattern is called discriminated type unions
// you can read more about it here: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions
// or see it in action: https://www.typescriptlang.org/play#example/discriminate-types
type NewSongDialogProps = {
  variant: "new";
  open: boolean;
  onClose: () => void;
  listId: string;
};

type EditSongDialogProps = {
  variant: "edit";
  open: boolean;
  onClose: () => void;
  listId: string;
  songId: string;
  title: string;
  singer: string;
  link: string;
};

type SongDialogProps = NewSongDialogProps | EditSongDialogProps;

export default function SongDialog(props: SongDialogProps) {
  const { variant, open, onClose, listId } = props;
  const title = variant === "edit" ? props.title : "";
  const singer = variant === "edit" ? props.singer : "";
  const link = variant === "edit" ? props.link : "";

  const [editingTitle, setEditingTitle] = useState(variant === "new");
  const [editingSinger, setEditingSinger] = useState(
    variant === "new",
  );
  const [editingLink, setEditingLink] = useState(variant === "new");
  const [addToOpen, setAddToOpen] = useState(false);

  // using a state variable to store the value of the input, and update it on change is another way to get the value of a input
  // however, this method is not recommended for large forms, as it will cause a re-render on every change
  // you can read more about it here: https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable
  const [newTitle, setNewTitle] = useState(title);
  const [newSinger, setNewSinger] = useState(singer);
  const [newListId, setNewListId] = useState(listId);
  const [addListId, setAddListId] = useState(listId);
  const [newLink,setNewLink] = useState(link);
  const { lists, fetchSongs } = useSongs();

  const handleClose = () => {
    setNewTitle(title);
    setNewSinger(singer);
    setNewListId(listId);
    onClose();
  };

  const handleAddToClose = () => {
    setAddToOpen(false);
  };

  const handleSave = async () => {
    try {
      if (variant === "new") {
        await createSong({
          title: newTitle,
          singer: newSinger,
          list_id: listId,
          link: newLink,
        });
      } else {
        if (
          newTitle === title &&
          newSinger === singer &&
          newListId === listId &&
          newLink === link
        ) {
          return;
        }
        // typescript is smart enough to know that if variant is not "new", then it must be "edit"
        // therefore props.songId is a valid value
        await updateSong(props.songId, {
          title: newTitle,
          singer: newSinger,
          list_id: newListId,
          link: newLink,
        });
      }
      fetchSongs();
    } catch (error) {
      alert("Error: Failed to save song");
    } finally {
      handleClose();
    }
  };

  const AddTo =async () => {
    try {
      await createSong({
        title: newTitle,
        singer: newSinger,
        list_id: addListId,
        link: newLink,
      });
      fetchSongs();
    }catch(error){
      alert("Error: Failed to add a song to another list");
    }finally {
      handleAddToClose();
    }
  }
  

  return (
    <>
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle className="flex gap-4">
        {editingTitle ? (
          <ClickAwayListener
            onClickAway={() => {
              if (variant === "edit") {
                setEditingTitle(false);
              }
            }}
          >
            <Input
              autoFocus
              defaultValue={title}
              onChange={(e) => setNewTitle(e.target.value)}
              className="grow"
              placeholder="Enter a title for this song..."
            />
          </ClickAwayListener>
        ) : (
          <button
            onClick={() => setEditingTitle(true)}
            className="w-full rounded-md p-2 hover:bg-white/10"
          >
            <Typography className="text-start">{newTitle}</Typography>
          </button>
        )}
        <Select
          value={newListId}
          onChange={(e) => setNewListId(e.target.value)}
        >
          {lists.map((list) => (
            <MenuItem value={list.id} key={list.id}>
              {list.name}
            </MenuItem>
          ))}
        </Select>
      </DialogTitle>
      <DialogTitle className="flex gap-4">
        {editingSinger ? (
            <ClickAwayListener
              onClickAway={() => {
                if (variant === "edit") {
                  setEditingSinger(false);
                }
              }}
            >
              <Input
                autoFocus
                defaultValue={singer}
                onChange={(e) => setNewSinger(e.target.value)}
                className="grow"
                placeholder="Enter a singer for this song..."
              />
            </ClickAwayListener>
          ) : (
            <button
              onClick={() => setEditingSinger(true)}
              className="w-full rounded-md p-2 hover:bg-white/10"
            >
              <Typography className="text-start">{newSinger}</Typography>
            </button>
          )}
      </DialogTitle>
      <DialogContent className="w-[600px]">
        {editingLink ? (
          <ClickAwayListener
            onClickAway={() => {
              if (variant === "edit") {
                setEditingLink(false);
              }
            }}
          >
            <textarea
              className="bg-white/0 p-2"
              autoFocus
              defaultValue={link}
              placeholder="Add a link"
              onChange={(e) => setNewLink(e.target.value)}
            />
          </ClickAwayListener>
        ) : (
          <button
            onClick={() => setEditingLink(true)}
            className="w-full rounded-md p-2 hover:bg-white/10"
          >
            <Typography className="text-start">{newLink}</Typography>
          </button>
        )}
        <DialogActions>
          <Button onClick={()=>setAddToOpen(true)}>add to</Button>
          <Button onClick={handleSave}>save</Button>
          <Button onClick={handleClose}>close</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
    <Dialog open={addToOpen} onClose={handleAddToClose}>
      <Select
        value={addListId}
        onChange={(e) => setAddListId(e.target.value)}
      >
        {lists.map((list) => (
          list.id !== listId ? (
            <MenuItem value={list.id} key={list.id}>
              {list.name}
            </MenuItem>
          ) : null
        ))}
      </Select>
      <Button onClick={AddTo}>add</Button>
      <Button onClick={handleAddToClose}>cancel</Button>
    </Dialog>
    </>
  );
}
