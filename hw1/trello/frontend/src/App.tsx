import { useEffect, useState } from "react";

import { Add as AddIcon } from "@mui/icons-material";
import { Button } from "@mui/material";

import CardList from "@/components/CardList";
import HeaderBar from "@/components/HeaderBar";
import Card from "@/components/Card";
import type { CardProps } from "@/components/Card";
import CardDialog from "@/components/CardDialog";
import useCards from "@/hooks/useCards";

function App() {
  const { lists, fetchCards } = useCards();
  // const [newListDialogOpen, setNewListDialogOpen] = useState(false);
  const [newCardDialogOpen, setNewCardDialogOpen] = useState(false);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  return (
    <>
      <HeaderBar />
      <main className="mx-auto flex max-h-full flex-row gap-6 px-24 py-12">
        {/* {lists.map((list) => (
          <CardList key={list.id} {...list} />
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
        { */
        // <NewListDialog
        //   open={newListDialogOpen}
        //   onClose={() => setNewListDialogOpen(false)}
        // />
        }

        <div className="flex flex-col gap-4">
          {lists.map((card) => (
            <Card key={card.id} {...card} />
          ))}
        </div>
        <CardDialog
          variant="new"
          open={newCardDialogOpen}
          onClose={() => setNewCardDialogOpen(false)}
          // listId={id}
        />
      </main>
    </>
  );
}

export default App;
