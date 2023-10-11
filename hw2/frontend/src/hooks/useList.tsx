import React, {
  createContext,
  useContext,
  useState,
} from "react";


type SongContextType = {
  page: string;
  list: string;
  setPage: React.Dispatch<React.SetStateAction<string>>;
  setList: React.Dispatch<React.SetStateAction<string>>;
};

// context is a way to share data between components without having to pass props down the component tree
// the default value is only used if the provider is not used
const SongContext = createContext<SongContextType>({
  page: "home",
  list: '',
  setPage: () => {},
  setList: () => {},
});

// alternatively, you can set the default value to null and throw an error if the provider is not used
// const SongContext = createContext<SongContextType | null>(null);

type SongProviderProps = {
  children: React.ReactNode;
};
// all data fetching and processing is done here, the rest of the app just consumes the data exposed by this provider
// when we run fetchLists or fetchSongs, we update the state of the provider, which causes the rest of the app to re-render accordingly
export function MyProvider({ children }: SongProviderProps) {
  const [page , setPage] = useState("home");
  const [list, setList] = useState('')

  return (
    <SongContext.Provider value={{ page, list, setPage, setList }}>
      {children}
    </SongContext.Provider>
  );
}

// this is a custom hook, the name must start with "use"
export default function useList() {
  const context = useContext(SongContext);
  // uncomment this if you use the null default value
  // if (!context) {
  //   throw new Error("useSongs must be used within a SongProvider");
  // }
  return context;
}
