import type {
  CreateCardPayload,
  CreateCardResponse,
  GetCardsResponse,
  UpdateCardPayload,
  UpdateCardResponse,
  DeleteCardResponse,
} from "@lib/shared_types";
import axios from "axios";

import { env } from "./env";

const client = axios.create({
  baseURL: env.VITE_API_URL,
});

export function getCards() {
  return client.get<GetCardsResponse>("/cards");
}

export function createCard(input: CreateCardPayload) {
  return client.post<CreateCardResponse>("/cards", input);
}

export function updateCard(id: string, input: UpdateCardPayload) {
  return client.put<UpdateCardResponse>(`/cards/${id}`, input);
}


export function deleteCard(id: string) {
  return client.delete<DeleteCardResponse>(`/cards/${id}`);
}