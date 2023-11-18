import { eq, sql, like } from "drizzle-orm";
import NameDialog from "@/components/NameDialog";
import Activity from "@/components/Activity";

import { db } from "@/db";
import { joinsTable, activitiesTable, usersTable } from "@/db/schema";
import ProfileButton from "@/components/ProfileButton";
import SearchBar from "@/components/SearchBar";

type HomePageProps = {
  searchParams: {
    username?: string;
    search?: string;
  };
};

export default async function Home({searchParams: { username , search }}: HomePageProps) {
  // read the username and handle from the query params and insert the user if needed.
  
  if (username) {
    await db
      .insert(usersTable)
      .values({
        userName: username,
      })
   
      // If the user already exists
      .onConflictDoNothing({  target: usersTable.userName })
      .execute();
  }

  const joinsSubquery = db.$with("joins_count").as(
    db
      .select({
        activityId: joinsTable.activityId,
        joins: sql<number | null>`count(*)`.mapWith(Number).as("joins"),
      })
      .from(joinsTable)
      .groupBy(joinsTable.activityId),
  );


  const joinedSubquery = db.$with("joined").as(
    db
      .select({
        activityId: joinsTable.activityId,
        joined: sql<number>`1`.mapWith(Boolean).as("joined"),
      })
      .from(joinsTable)
      .where(eq(joinsTable.userHandle, username ?? "")),
  );

  let searchname = '%%';
  if(search)
    searchname = '%'+search+'%';
  
  const activities = await db
    .with(joinsSubquery, joinedSubquery)
    .select({
      id: activitiesTable.id,
      content: activitiesTable.content,
      username: usersTable.userName,
      //handle: usersTable.handle,
      joins: joinsSubquery.joins,
      joined: joinedSubquery.joined,
    })
    .from(activitiesTable)

    .innerJoin(usersTable, eq(activitiesTable.userHandle, usersTable.userName))
    .leftJoin(joinsSubquery, eq(activitiesTable.id, joinsSubquery.activityId))
    .leftJoin(joinedSubquery, eq(activitiesTable.id, joinedSubquery.activityId))
    .where(like(activitiesTable.content, searchname)  )
    .execute();

  return (
    <>
      <div className="flex h-screen w-full flex-col pt-2">
      
        <div className="inline w-full px-4 py-5 pt-3">
          <ProfileButton />
        </div>
        <div className="relative">
          <SearchBar />   
        </div>
        
        {activities.map((activity) => (
          <Activity
            key={activity.id}
            id={activity.id}
            username={username}
            content={activity.content}
            joins={activity.joins}
            joined={activity.joined}
          />
        ))}
      </div>
      <NameDialog />
    </>
  );
}
