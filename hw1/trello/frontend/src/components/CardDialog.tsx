import { useState } from "react";

import { Delete as DeleteIcon, FilterListOff } from "@mui/icons-material";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";

import useCards from "@/hooks/useCards";
import { createCard, deleteCard, updateCard } from "@/utils/client";

const currentDate = new Date();

type NewCardDialogProps = {
  variant: "new";
  open: boolean;
  onClose: () => void;
};

type EditCardDialogProps = {
  variant: "edit";
  open: boolean;
  onClose: () => void;
  cardId: string;
  title: string;
  description: string;
  date: string;
  tag: string;
  mood: string;
};

type CardDialogProps = NewCardDialogProps | EditCardDialogProps;

type listformat = {
  id: string;
  name: string;
};
const tagList:listformat[]=[
  {
    id: "學業",
    name: "學業",
  },
  {
    id: "人際",
    name: "人際",
  },
  {
    id: "社團",
    name: "社團",
  },
];
const moodList:listformat[]=[
  {
    id: "快樂",
    name: "快樂",
  },
  {
    id: "生氣",
    name: "生氣",
  },
  {
    id: "難過",
    name: "難過",
  }
]

export default function CardDialog(props: CardDialogProps) {
  const { variant, open, onClose} = props;
  const title = variant === "edit" ? props.title : "";
  const description = variant === "edit" ? props.description : "";
  const date = variant === "edit" ? props.date : formatTime(currentDate);
  const tag = variant === "edit" ? props.tag : "";
  const mood = variant === "edit" ? props.mood : "";  


  const [edittingTitle, setEdittingTitle] = useState(variant === "new");
  const [edittingDescription, setEdittingDescription] = useState(variant === "new",);

  // using a state variable to store the value of the input, and update it on change is another way to get the value of a input
  // however, this method is not recommended for large forms, as it will cause a re-render on every change
  // you can read more about it here: https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);
  const [newDate, setNewDate] = useState(date);
  const [newTag, setNewTag] = useState(tag);
  const [newMood, setNewMood] = useState(mood);
  const [cardNum, setCardNum] = useState(0);

  const { lists, fetchCards } = useCards();

  const handleClose = () => {
    onClose();
    if (variant === "edit") {
      setNewTitle(title);
      setNewDescription(description);
      setNewDate(date);
      setNewTag(tag);
      setNewMood(mood);
    }
  };

  const handleSave = async () => {
    try {
      if (variant === "new") {
        createCard({
          title: newTitle,
          description: newDescription,
          date: newDate,
          tag: newTag,
          mood: newMood,
        });
        setCardNum(cardNum+1);
        fetchCards();
      } else {
        if (
          newTitle === title &&
          newDescription === description &&
          newTag === tag &&
          newMood === mood
        ) {
          return;
        }
        await updateCard(props.cardId, {
          title: newTitle,
          description: newDescription,
          date: newDate,
          tag: newTag,
          mood: newMood
        });
      }
      fetchCards();
    } catch (error) {
      alert("Error: Failed to save card");
    } finally {
      handleClose();
    }
  };

  const handleDelete = async () => {
    if (variant !== "edit") {
      return;
    }
    try {
      await deleteCard(props.cardId);
      setCardNum(cardNum-1);
      fetchCards();
    } catch (error) {
      alert("Error: Failed to delete card");
    } finally {
      handleClose();
    }
  };

  function formatTime(date:Date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份從0開始，所以要加1
    const day = date.getDate().toString().padStart(2, '0');
    const daysOfWeek = ['日', '一', '二', '三', '四', '五', '六'];
    const dayOfWeek = daysOfWeek[date.getDay()]; // 星期幾
  
    return `${year}/${month}/${day}(${dayOfWeek})`;
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle className="flex gap-4">
        {edittingTitle ? (
          <ClickAwayListener
            onClickAway={() => {
              if (variant === "edit") {
                setEdittingTitle(false);
              }
            }}
          >
            <Input
              autoFocus
              defaultValue={title}
              onChange={(e) => setNewTitle(e.target.value)}
              className="grow"
              placeholder="Enter a title for this card..."
            />
          </ClickAwayListener>
        ) : (
          <button
            onClick={() => setEdittingTitle(true)}
            className="w-full rounded-md p-2 hover:bg-white/10"
          >
            <Typography className="text-start">{newTitle}</Typography>
          </button>
        )}
        <Select
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
        >
          {tagList.map((list) => (
            <MenuItem value={list.id} key={list.id}>
              {list.name}
            </MenuItem>
          ))}
        </Select>
        <Select
          value={newMood}
          onChange={(e) => setNewMood(e.target.value)}
        >
          {moodList.map((mood) => (
            <MenuItem value={mood.id} key={mood.id}>
              {mood.name}
            </MenuItem>
          ))}
        </Select>
        <div>{date}</div>
        {variant === "edit" && (
          <IconButton color="error" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent className="w-[600px]">
        {edittingDescription ? (
          <ClickAwayListener
            onClickAway={() => {
              if (variant === "edit") {
                setEdittingDescription(false);
              }
            }}
          >
            <textarea
              className="bg-white/0 p-2"
              autoFocus
              defaultValue={description}
              placeholder="Add a more detailed description..."
              onChange={(e) => setNewDescription(e.target.value)}
            />
          </ClickAwayListener>
        ) : (
          <button
            onClick={() => setEdittingDescription(true)}
            className="w-full rounded-md p-2 hover:bg-white/10"
          >
            <Typography className="text-start">{newDescription}</Typography>
          </button>
        )}
        <DialogActions>
          <Button onClick={handleSave}>save</Button>
          <Button onClick={handleClose}>close</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
