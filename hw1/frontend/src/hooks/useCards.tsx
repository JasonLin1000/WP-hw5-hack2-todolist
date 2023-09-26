import { createContext, useCallback, useContext, useState,} from "react";

import type { GetCardsResponse} from "@lib/shared_types";

import type { CardProps } from "@/components/Card";
import { getCards } from "@/utils/client";

type CardContextType = {
  lists: CardProps[];
  fetchCards: () => Promise<void>;
};

const CardContext = createContext<CardContextType>({
  lists: [],
  fetchCards: async () => {},
});

type CardProviderProps = {
  children: React.ReactNode;
};

// all data fetching and processing is done here, the rest of the app just consumes the data exposed by this provider
// when we run fetchLists or fetchCards, we update the state of the provider, which causes the rest of the app to re-render accordingly
export function CardProvider({ children }: CardProviderProps) {
  const [rawCards, setRawCards] = useState<GetCardsResponse>([]);

  const fetchCards = useCallback(async () => {
    try {
      const { data } = await getCards();
      setRawCards(data);
    } catch (error) {
      alert("Error: failed to fetch cards");
    }
  }, []);

  const lists = rawCards;
  return (
    <CardContext.Provider
      value={{
        lists,
        fetchCards,
      }}
    >
      {children}
    </CardContext.Provider>
  );
}

export default function useCards() {
  return useContext(CardContext);
}
