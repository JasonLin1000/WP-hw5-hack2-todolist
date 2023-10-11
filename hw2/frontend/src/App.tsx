import { useEffect} from "react";
import useSongs from "@/hooks/useSongs";
import Page from "./components/Page";

function App() {
  const {fetchLists, fetchSongs } = useSongs();

  useEffect(() => {
    fetchLists();
    fetchSongs();
  }, [fetchSongs, fetchLists]);

  return (
    <>
      <Page/>
    </>
  );
}

export default App;
