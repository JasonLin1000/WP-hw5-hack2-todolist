import { useState } from "react";
import { useRouter } from "next/navigation";



export default function useActivity() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const postActivity = async ({
        handle,
        content,
        startTime,
        endTime,
    }: {
        handle: string;
        content: string;
        startTime: string;
        endTime: string;
    }) => {
        setLoading(true);

        const res = await fetch("/api/activities", {
        method: "POST",
        body: JSON.stringify({
            handle,
            content,
            startTime,
            endTime
        }),
        });
        
        if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error);
        }
        const body = await res.json();

        // router.refresh() is a Next.js function that refreshes the page without
        // reloading the page. This is useful for when we want to update the UI
        // from server components.
        router.refresh();
        setLoading(false);
        return body.id;
    };

    return {
        postActivity,
        loading,
    };
}

