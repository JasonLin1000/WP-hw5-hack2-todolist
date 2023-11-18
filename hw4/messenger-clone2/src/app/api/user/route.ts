import { NextResponse, type NextRequest } from "next/server";

import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { usersTable } from "@/db/schema";

const IsUserSchema = z.object({
  userName: z.string().min(1).max(50),
});

type IsUserRequest = z.infer<typeof IsUserSchema>;

export async function GET(request: NextRequest) {
  const data = await request.json();

  try {
    IsUserSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { userName} = data as IsUserRequest;

  try {
    const [exist] = await db
      .select({ dummy: sql`1` })
      .from(usersTable)
      .where(
        and(
          eq(usersTable.userName, userName),
        ),
      )
      .execute();
    // The NextResponse object is a easy to use API to handle responses.
    // IMHO, it's more concise than the express API.
    return NextResponse.json({ joined: Boolean(exist) }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      // { error: "Something went wrong" },
      // { status: 500 },
      { joined: false }
    );
  }
}