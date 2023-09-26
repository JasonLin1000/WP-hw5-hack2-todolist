export type CardData = {
  id: string;
  title: string;
  description: string;
  date: string;
  tag: string;
  mood: string;
  //list_id: string;
};
export type GetCardsResponse = CardData[];

export type GetCardResponse = CardData;

export type CreateCardPayload = Omit<CardData, "id">;

export type CreateCardResponse = Pick<CardData, "id">;

export type UpdateCardPayload = Partial<Omit<CardData, "id">>;

export type UpdateCardResponse = "OK";

export type DeleteCardResponse = "OK";