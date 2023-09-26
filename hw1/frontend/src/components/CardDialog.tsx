import { useState } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import CardDialogEdit from "./CardDialogEdit";

type CardDialogProps = {
  open: boolean;
  onClose: () => void;
  cardId: string;
  title: string;
  description: string;
  date: string;
  tag: string;
  mood: string;
};


export default function CardDialog(props: CardDialogProps) {
  const [cardDialogEdit, setCardDialogEdit] = useState(false);

  const { open, onClose} = props;
  const id =props.cardId;
  const title =props.title;
  const description = props.description;
  const date = props.date;
  const tag = props.tag;
  const mood = props.mood;  

  const handleClose = () => {
    onClose();
  };
  
  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle className="flex gap-4">
          <button
            className="w-full rounded-md p-2 hover:bg-white/10"
          >
            <Typography className="text-start">{title}</Typography>
          </button>
          <Typography sx={{ mb: 1}}>
            {date}
          </Typography>
          <Chip label={tag} color="primary"/>
          <Chip label={mood} color="secondary"/>
        </DialogTitle>
        <DialogContent className="w-[600px]">
          <button
            className="w-full rounded-md p-2 hover:bg-white/10"
          >
            <Typography className="text-start">{description}</Typography>
          </button>
          <DialogActions>
            <Button onClick={() => {setCardDialogEdit(true)}}>編輯</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <CardDialogEdit
        variant="edit"
        open={cardDialogEdit}
        onClose={() => setCardDialogEdit(false)}
        title={title}
        description={description}
        date={date}
        tag={tag}
        mood={mood}
        cardId={id}
      />
    </>
  );
}
