import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";
import { db } from "@/db";
import { commentsTable } from "@/db/schema";

// zod is a library that helps us validate data at runtime
// it's useful for validating data coming from the client,
// since typescript only validates data at compile time.
// zod's schema syntax is pretty intuitive,
// read more about zod here: https://zod.dev/
const postCommentRequestSchema = z.object({
  handle: z.string().min(1).max(50),
  content: z.string().min(1).max(280),
  replyToActivityId: z.number(),
});

// you can use z.infer to get the typescript type from a zod schema
type PostCommentRequest = z.infer<typeof postCommentRequestSchema>;


export async function POST(request: NextRequest) {
  const data = await request.json();

  try {
    postCommentRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { handle, content, replyToActivityId } = data as PostCommentRequest;
  try {
    
    await db
      .insert(commentsTable)
      .values({
        userHandle: handle,
        content,
        replyToActivityId,
      })
      .execute();
  } catch (error) {
    // The NextResponse object is a easy to use API to handle responses.
    // IMHO, it's more concise than the express API.
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}
