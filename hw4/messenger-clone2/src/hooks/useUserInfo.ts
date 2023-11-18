import { useMemo } from "react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { useRouter } from "next/navigation";


// this is a helper function to get user info in client components
export default function useUserInfo() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const searchParams = useSearchParams();
    const router = useRouter();
    const username = useMemo(() => searchParams.get("username"), [searchParams]);
    const isUser = async (userName) => {
        if (loading) return;

        setLoading(true);
        const res = await fetch(`/api/user?userName=${encodeURIComponent(userName)}`, {
        method: 'GET',
        });

        if (!res.ok) {
        // const body = await res.json();
        // throw new Error(body.error);
            return false;
        }

        const data = await res.json();
        setLoading(false);
        setError(null);

        return data.joined; // 這裡改為直接回傳是否存在的布林值
      };
    return {
        loading,
        isUser,
        username,
    };
}
