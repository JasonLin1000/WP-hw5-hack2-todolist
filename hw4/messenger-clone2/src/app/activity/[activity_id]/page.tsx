import Link from "next/link";
import { redirect } from "next/navigation";
import { eq, and } from "drizzle-orm";
import {ChevronsLeft} from "lucide-react";
import { db } from "@/db";
import { joinsTable, activitiesTable, commentsTable } from "@/db/schema";
import JoinButton from "@/components/JoinButton";

type ActivityPageProps = {
  params: {
    // this came from the file name: [tweet_id].tsx
    activity_id: string;
  };
  searchParams: {
    // this came from the query string: ?username=madmaxieee
    username?: string;
  };
};

// these two fields are always available in the props object of a page component
export default async function ActivityPage({
    params: { activity_id },
    searchParams: { username },
    }: ActivityPageProps) {


    const errorRedirect = () => {
        const params = new URLSearchParams();
        username && params.set("username", username);
        redirect(`/?${params.toString()}`);
    };

    const activity_id_num = parseInt(activity_id);
    if (isNaN(activity_id_num)) {
        alert('error');
        errorRedirect();
    }
    //get database
    const [activityData] = await db
        .select({
            id: activitiesTable.id,
            content: activitiesTable.content,
            userHandle: activitiesTable.userHandle,
            startTime: activitiesTable.startTime,
            endTime: activitiesTable.endTime,
        })
        .from(activitiesTable)
        .where(eq(activitiesTable.id, activity_id_num))
        .execute();
    
    if (!activityData) {
        alert('stop');
        errorRedirect();
    }
    const joins = await db
        .select({
        id: joinsTable.id,
        })
        .from(joinsTable)
        .where(eq(joinsTable.activityId, activity_id_num))
        .execute();

    const numjoins = joins.length;
    const [joined] = await db
        .select({
            id: joinsTable.id,
        })
        .from(joinsTable)
        .where(
        and(
            eq(joinsTable.activityId, activity_id_num),
            eq(joinsTable.userHandle, username ?? ""),
        ),
        )
        .execute();

    const activity = {
        id: activityData.id,
        content: activityData.content,
        startTime: activityData.startTime,
        endTime: activityData.endTime,
        username: activityData.userHandle,
        joins: numjoins,
        joined: Boolean(joined),
    };

    const replies = await db
        .select({
            id: commentsTable.id,
            content: commentsTable.content,
            userHandle: commentsTable.userHandle,
        })
        .from(commentsTable)
        .where(
            eq(commentsTable.replyToActivityId, activity_id_num),
        )
        .execute();

    return (
        <>
        <div className="flex w-full flex-col mt-5">
            <div className="mb-2 flex items-center gap-5">
                <div className="flex-none w-14 h-20">
                <Link href={{ pathname: "/", query: { username } }}>
                    <ChevronsLeft size={50}/>
                </Link>
                </div>
                <div className="grow h-20 bg-gray-100 dark:bg-white/5 p-3 rounded-md">
                    <p className="text-2xl font-bold text-blue-500 truncate dark:text-white">{activity.content}</p>
                    <p className="text-sm pt-3 font-bold text--700 truncate dark:text-white">From {activity.startTime} to {activity.endTime}</p>
                </div>
            </div>
            <JoinButton
                username={username}
                initialJoined={activity.joined}
                initialJoins = {activity.joins}
                activityId={activity.id}
            />
           
            {replies.map((reply) => (
                <div key = {reply.id} className="grow ml-16 mt-4 bg-gray-100 dark:bg-white/5 p-3 rounded-md">
                    <p className="text-base text-gray-900 truncate dark:text-white">
                        {reply.userHandle}: {reply.content}
                    </p>
                </div>
            ))}
        </div>
        </>
    );
}
