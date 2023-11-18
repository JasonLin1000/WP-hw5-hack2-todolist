import { useState } from "react";
import { useRouter } from "next/navigation";

export default function useComment() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const postComment = async ({
        handle,
        content,
        replyToActivityId,
    }: {
        handle: string;
        content: string;
        replyToActivityId: number;
    }) => {
        setLoading(true);

        const res = await fetch("/api/comments", {
        method: "POST",
        body: JSON.stringify({
            handle,
            content,
            replyToActivityId,
        }),
        });
        
        if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error);
        }
        
        // router.refresh() is a Next.js function that refreshes the page without
        // reloading the page. This is useful for when we want to update the UI
        // from server components.
        router.refresh();  //重新刷新頁面, textarea清空(回到初始值)
        setLoading(false);  //避免在處理request的時候 外面又一直按tweet 最後當掉
    };

    return {
        postComment,
        loading,
    };
}
