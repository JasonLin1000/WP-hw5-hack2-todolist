import { useRef } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

import useSongs from "@/hooks/useSongs";
import { createList } from "@/utils/client";
//import { listenerCount } from "process";

type NewListDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function NewListDialog({ open, onClose }: NewListDialogProps) {
  // using a ref to get the dom element is one way to get the value of a input
  // another way is to use a state variable and update it on change, which can be found in SongDialog.tsx
  const listName = useRef<HTMLInputElement>(null);
  const listDescription = useRef<HTMLInputElement>(null);
  const { fetchLists } = useSongs();

  const handleAddList = async () => {
    try {
      await createList({ 
        name: listName.current?.value ?? "", 
        description: listDescription.current?.value ?? "",
     });
      fetchLists();
    } catch (error) {
      alert("Error: Failed to create list");
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add a list</DialogTitle>
      <DialogContent className="mx-auto flex max-h-full flex-col gap-3 px-24 py-12">
        <TextField
          inputRef={listName}
          label="List Name"
          variant="outlined"
          sx={{ mt: 2 }}
          autoFocus
        />
        <TextField
          inputRef={listDescription}
          label="List Desrciption"
          variant="outlined"
          sx={{ mt: 1 }}
          autoFocus
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAddList}>add</Button>
        <Button onClick={onClose}>cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
