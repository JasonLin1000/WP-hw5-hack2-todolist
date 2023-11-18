import { useState } from "react";
import { useRouter } from "next/navigation";

export default function useChatJoin() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const joinChat = async ({
        chatId,
        userHandle,
    }: {
        chatId: number;
        userHandle: string;
    }) => {
        if (loading) return;
        setLoading(true);

        const res = await fetch("/api/chatJoins", {
        method: "POST",
        body: JSON.stringify({
            chatId,
            userHandle,
        }),
        });
        if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error);
        }

        router.refresh();
        setLoading(false);
    };

    const unjoinChat = async ({
        chatId,
        userHandle,
    }: {
        chatId: number;
        userHandle: string;
    }) => {
        if (loading) return;

        setLoading(true);
        const res = await fetch("/api/chatJoins", {
        method: "DELETE",
        body: JSON.stringify({
            chatId,
            userHandle,
        }),
        });

        if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error);
        }

        router.refresh();
        setLoading(false);
    };

    return {
        joinChat,
        unjoinChat,
        loading,
    };
}