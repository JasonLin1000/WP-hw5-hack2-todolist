import { useEffect, useState } from "react";

import { Add as AddIcon } from "@mui/icons-material";
import { Button } from "@mui/material";

import AppBar from "@mui/material/AppBar";
import SongList from "@/components/SongList";
import HeaderBar from "@/components/HeaderBar";
import NewListDialog from "@/components/NewListDialog";
import useSongs from "@/hooks/useSongs";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";

export default function HomePage(){
  const { lists, fetchLists} = useSongs();
  const [newListDialogOpen, setNewListDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  useEffect(() => {
    fetchLists();
  }, [fetchLists,deleting]);
  return(
    <>
      <HeaderBar />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h3" component="div" sx={{ flexGrow: 1 }} justifyContent="center" align="center">
            My Playlists
          </Typography>
            <div className="flex gap-4 flex-row float-right">
              <Button
                variant="contained"
                className="w-40"
                
                onClick={() => setNewListDialogOpen(true)}
              >
                <AddIcon className="mr-2" />
                Add a list
              </Button>
              { deleting ?(
                <Button
                variant="contained"
                className="w-40 gap-6"
                
                onClick={() => {setDeleting(false);}}
              >
                Done
              </Button>
              ):(
                <Button
                variant="contained"
                className="w-40 gap-6"
                
                onClick={() => {setDeleting(true);}}
              >
                Delete
              </Button>
              )}
            </div>
          </Toolbar>
        </AppBar>
      <main className="mx-auto flex max-h-full flex-row gap-6 px-24 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {lists.map((list) => (
            <div className="p-4">
              <SongList id={list.id} name = {list.name} description = {list.description} del={deleting} songs={list.songs.length}/>
            </div>
          ))}
        </div>
        <NewListDialog
          open={newListDialogOpen}
          onClose={() => setNewListDialogOpen(false)}
        />
      </main>
    </>
  )
}