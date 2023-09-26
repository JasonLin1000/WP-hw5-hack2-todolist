import { useEffect} from "react";

import HeaderBar from "@/components/HeaderBar";
import Card from "@/components/Card";
import useCards from "@/hooks/useCards";
import Grid from "@mui/material/Grid";

function App() {
  const { lists, fetchCards } = useCards();
  // const [newListDialogOpen, setNewListDialogOpen] = useState(false);
  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  return (
    <>
      <HeaderBar />
      <main className="mx-auto flex max-h-full flex-row gap-6 px-24 py-12">
        <Grid container rowSpacing={5} justifyContent="flex-start" alignItems="center" 
        columnSpacing={{ xs: 3, sm: 2, md: 2 }}>
          {lists.map((card) => (
            <Grid item xs={4}>
              <Card key={card.id} {...card} />
            </Grid>
          ))}
        </Grid>
      </main>
    </>
  );
}

export default App;
