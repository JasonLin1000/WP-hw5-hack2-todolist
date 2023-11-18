import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import {chatsTable } from "@/db/schema";
const postActivityRequestSchema = z.object({
  handle: z.string().min(1).max(50),
});

// you can use z.infer to get the typescript type from a zod schema
type PostActivityRequest = z.infer<typeof postActivityRequestSchema>;
export async function POST(request: NextRequest) {
  const data = await request.json();

  try {
    // parse will throw an error if the data doesn't match the schema
    postActivityRequestSchema.parse(data);
  } catch (error) {
    // in case of an error, we return a 400 response
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { handle} = data as PostActivityRequest;

  try {
    const insertID = await db
      .insert(chatsTable)
      .values({
        userHandle: handle,
      })
      .returning({ insertedId: chatsTable.id })
      .execute();

      return NextResponse.json(
        {id: insertID[0]},
        { status: 200 },
      );
  } catch (error) {
    // The NextResponse object is a easy to use API to handle responses.
    // IMHO, it's more concise than the express API.
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  //return new NextResponse("OK", { status: 200 });
  
}
