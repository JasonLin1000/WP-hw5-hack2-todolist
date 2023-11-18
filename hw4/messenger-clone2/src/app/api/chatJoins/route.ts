import { NextResponse, type NextRequest } from "next/server";

import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { chatJoinsTable, joinsTable } from "@/db/schema";

const JoinActivityRequestSchema = z.object({
  chatId: z.number().positive(),
  userHandle: z.string().min(1).max(50),
});

type JoinActivityRequest = z.infer<typeof JoinActivityRequestSchema>;

export async function GET(request: NextRequest) {
  const data = await request.json();

  try {
    JoinActivityRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { chatId, userHandle } = data as JoinActivityRequest;

  try {
    const [exist] = await db
      .select({ dummy: sql`1` })
      .from(chatJoinsTable)
      .where(
        and(
          eq(chatJoinsTable.chatId, chatId),
          eq(chatJoinsTable.userHandle, userHandle),
        ),
      )
      .execute();
    // The NextResponse object is a easy to use API to handle responses.
    // IMHO, it's more concise than the express API.
    return NextResponse.json({ joined: Boolean(exist) }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const data = await request.json();

  try {
    JoinActivityRequestSchema.parse(data);
    
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { chatId, userHandle } = data as JoinActivityRequest;

  try {
    await db
      .insert(chatJoinsTable)
      .values({
        chatId,
        userHandle,
      })
      //.onConflictDoNothing()
      .execute();
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const data = await request.json();

  try {
    JoinActivityRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { chatId, userHandle } = data as JoinActivityRequest;

  try {
    await db
      .delete(chatJoinsTable)
      .where(
        and(
          eq(chatJoinsTable.chatId, chatId),
          eq(chatJoinsTable.userHandle, userHandle),
        ),
      )
      .execute();
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}