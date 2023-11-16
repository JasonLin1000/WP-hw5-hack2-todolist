export type User = {
  id: string;
  username: string;
  provider: "github" | "credentials";
};

export type Chatroom = {
  id: string;
  message: Message[];
};

export type Message = {
  id: string;
  username: string;
  text: string;
}