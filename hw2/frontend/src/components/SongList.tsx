
import DeleteIcon from "@mui/icons-material/Delete";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import useSongs from "@/hooks/useSongs";
import { deleteList} from "@/utils/client";
import useList from "@/hooks/useList";
import type { SongProps } from "./Song";

import Band from "../../../img/band.jpg";

export type SongListProps = {
  id: string;
  name: string;
  description: string;
  songs: SongProps[];
  del: boolean;
};

type ListProps = {
  id: string;
  name: string;
  description: string;
  del: boolean;
  songs: number;
};

export default function SongList({ id, name, description, del,songs }:ListProps) {
  const { fetchLists } = useSongs();
  const {setPage,setList} = useList();
  

  const handleDelete = async () => {
    try {
      await deleteList(id);
      fetchLists();
    } catch (error) {
      alert("Error: Failed to delete list");
    }
  };

  const handleClick = () =>{
    setPage("songList");
    setList(id);
  }
  return (
    <>
      <Paper className="w-80 p-6">
      <div className="flex gap-4 flex-row float-right">
              {del?(
                <IconButton color="error" onClick={handleDelete}>
                  <DeleteIcon />
                </IconButton>):(
                <></>
                )}
            </div>
        <button onClick={handleClick}>
          <img src={Band} width={250} height={250} alt="Band"/>
          <div className="flex gap-4">
            <Typography className="text-start" variant="h4">
              {name}
            </Typography>
          </div>
          <Divider variant="middle" sx={{ mt: 1, mb: 2 }} />
          <Typography className="text-start" variant="h6">
            {description}
          </Typography>
          <Typography className="text-start" variant="h6">
            Number of songs: {songs}
          </Typography>
        </button>
      </Paper>
    </>
  );
}
