import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import type { GetCardsResponse} from "@lib/shared_types";

import type { CardProps } from "@/components/Card";
import { getCards, getLists } from "@/utils/client";

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
  //const [rawLists, setRawLists] = useState<GetListsResponse>([]);
  const [rawCards, setRawCards] = useState<GetCardsResponse>([]);

  // const fetchLists = useCallback(async () => {
  //   try {
  //     const { data } = await getLists();
  //     setRawLists(data);
  //   } catch (error) {
  //     alert("Error: failed to fetch lists");
  //   }
  // }, []);

  const fetchCards = useCallback(async () => {
    try {
      const { data } = await getCards();
      setRawCards(data);
    } catch (error) {
      alert("Error: failed to fetch cards");
    }
  }, []);

  const lists = rawCards;
  // const lists = useMemo(() => {
  //   // you can do functional-ish programming in JS too
  //   const listMap = rawLists.reduce(
  //     (acc, list) => {
  //       acc[list.id] = { ...list, cards: [] };
  //       return acc;
  //     },
  //     {} as Record<string, CardListProps>,
  //   );
  //   // or you can do for loops
  //   for (const card of rawCards) {
  //     listMap[card.list_id].cards.push({
  //       ...card,
  //       listId: card.list_id,
  //     });
  //   }
  //   return Object.values(listMap);
  // }, [rawCards, rawLists]);

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
