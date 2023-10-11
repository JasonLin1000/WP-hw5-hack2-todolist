import { useRef, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Divider from "@mui/material/Divider";
import Input from "@mui/material/Input";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";

import useSongs from "@/hooks/useSongs";
import {updateList, deleteSong } from "@/utils/client";

import Song from "./Song";
import type { SongProps } from "./Song";
import SongDialog from "./SongDialog";
import HeaderBar from "@/components/HeaderBar";
import { useStyles } from "./Song";

import Band from "../../../img/band.jpg";
import { Dialog } from "@mui/material";

export type SongListProps = {
  id: string;
  name: string;
  songs: SongProps[];
  del: boolean;
};

export default function Lists({id}:{id:string}) {
  const [openNewSongDialog, setOpenNewSongDialog] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [selectedSongs, setSelectedSongs] = useState<SongProps[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [openDelConf,setOpenDelConf] = useState(false);

  const { lists, fetchLists, fetchSongs } = useSongs();
  const inputRef = useRef<HTMLInputElement>(null);
  const inputRef2 = useRef<HTMLInputElement>(null);
  const thisList = lists.find(item => item.id === id);
  const classes = useStyles();

  if(!thisList) return (<HeaderBar />);
  const name = thisList?.name;
  const description = thisList?.description;
  const songs = thisList?.songs;

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
  const handleUpdateDescription = async () => {
    if (!inputRef2.current) return;

    const newDescription = inputRef2.current?.value;
    if (newDescription !== description) {
      try {
        await updateList(id, { description: newDescription });
        fetchLists();
      } catch (error) {
        alert("Error: Failed to update list description");
      }
    }
    setEditingDescription(false);
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedSongs(songs);
    } else {
      setSelectedSongs([]);
    }
  };

  const toggleSelectSong = (song:SongProps) => {
    if (selectedSongs.includes(song)) {
      setSelectedSongs(selectedSongs.filter(s => s !== song));
    } else {
      setSelectedSongs([...selectedSongs, song]);
    }
  };

  const handleDelete = async () => {
    try {
      await Promise.all(selectedSongs.map((song)=>deleteOneSong(song)));
      setSelectedSongs([]);
      fetchSongs();
    } catch (error) {
      alert("Error: Failed to delete all song");
    }finally{
      setOpenDelConf(false);
    }
  };

  const deleteOneSong =async (song:SongProps) => {
    try {
      await deleteSong(song.id);
      fetchSongs();
    } catch (error) {
      return;
    }
  }

  return (
    <>
      <HeaderBar />
      <img src={Band} width={250} height={250} alt="Band"/>
      <div className="flex gap-4 flex-row float-right">
      <Button
        variant="contained"
        onClick={() => setOpenNewSongDialog(true)}
      >
        <AddIcon className="mr-2" />
        Add a song
      </Button>
      <Button
        variant="contained"
        onClick={() => setOpenDelConf(true)}
      >
        Delete
      </Button>
      </div>
      <div className="flex gap-4 flex-col" >
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
        {editingDescription ? (
          <ClickAwayListener onClickAway={handleUpdateDescription}>
            <Input
              autoFocus
              defaultValue={description}
              className="grow"
              placeholder="Enter a new description for this list..."
              sx={{ fontSize: "2rem" }}
              inputRef={inputRef2}
            />
          </ClickAwayListener>
        ) : (
          <button
            onClick={() => setEditingDescription(true)}
            className="w-full rounded-md p-2 hover:bg-white/10"
          >
            <Typography className="text-start" variant="h6">
              {description}
            </Typography>
          </button>
        )}
        </div>
      </div>
      <Divider variant="middle" sx={{ mt: 1, mb: 2 }} />
      
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-4">
            <tr>
              <td>
                <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
              </td>
            </tr>
            <div className={classes.container}>
              <div className={classes.text}>song</div>
              <div className={classes.text}>singer</div>
              <div className={classes.text}>link</div>
            </div>
          </div> 
        {songs.map((song) => (
          <div key={song.id} className="flex flex-row gap-4">
            <tr key={song.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedSongs.includes(song)}
                  onChange={() => toggleSelectSong(song)}
                />
              </td>
            </tr>
            <Song key={song.id} {...song} />
          </div>  
        ))}
      </div>
      <SongDialog
        variant="new"
        open={openNewSongDialog}
        onClose={() => setOpenNewSongDialog(false)}
        listId={id}
      />
      <Dialog open={openDelConf} onClose={() => setOpenDelConf(false)}>
        {selectedSongs[0]?(
          <>
          <DialogTitle>Delete following songs?</DialogTitle>
          <div className="flex-col gap-3  mx-auto">
              {selectedSongs.map((song)=>(
                <div key={song.id} className="flex gap-4 mx-auto">{song.title}</div>
                ))}
          </div>
          <Button onClick={handleDelete}>delete</Button>
          <Button onClick={()=>setOpenDelConf(false)}>cancel</Button>
          </>
        ):(
          <>
          <DialogTitle>Please select songs</DialogTitle>
          <Button onClick={()=>setOpenDelConf(false)}>OK</Button>
          </>
        )}
      
      </Dialog>
    </>
  );
}
