import { useState } from "react";
import { useRouter } from "next/navigation";



export default function useChat() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const newChat = async ({
        handle,
    }: {
        handle: string;
    }) => {
        setLoading(true);

        const res = await fetch("/api/chats", {
        method: "POST",
        body: JSON.stringify({
            handle,
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
        newChat,
        loading,
    };
}