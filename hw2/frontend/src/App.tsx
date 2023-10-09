import { useEffect, useState } from "react";

import { Add as AddIcon } from "@mui/icons-material";
import { Button } from "@mui/material";

import SongList from "@/components/SongList";
import HeaderBar from "@/components/HeaderBar";
import NewListDialog from "@/components/NewListDialog";
import useSongs from "@/hooks/useSongs";

import Band from "../../img/band.jpg";

function App() {
  const { lists, fetchLists, fetchSongs } = useSongs();
  const [newListDialogOpen, setNewListDialogOpen] = useState(false);

  useEffect(() => {
    fetchLists();
    fetchSongs();
  }, [fetchSongs, fetchLists]);

  return (
    <>
      <HeaderBar />
      <main className="mx-auto flex max-h-full flex-row gap-6 px-24 py-12">
        {lists.map((list) => (
          <SongList key={list.id} {...list} />
        ))}
        <div>
          <Button
            variant="contained"
            className="w-80"
            onClick={() => setNewListDialogOpen(true)}
          >
            <AddIcon className="mr-2" />
            Add a list
          </Button>
        </div>
        <NewListDialog
          open={newListDialogOpen}
          onClose={() => setNewListDialogOpen(false)}
        />
      </main>
    </>
  );
}

export default App;
