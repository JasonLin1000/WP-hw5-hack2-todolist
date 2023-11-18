"use client";

import { useRouter } from "next/navigation";
import useUserInfo from "@/hooks/useUserInfo";

export default function ProfileButton() {
    const { username } = useUserInfo();
    const router = useRouter();

    return (   
        <div className="relative w-full">
            <span className="text-3xl font-bold">{username ?? "..."}</span>
        
            <button type="button" className="py-2 px-4 ml-20 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none
            bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 
            focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 
            dark:hover:text-white dark:hover:bg-gray-700 "
            onClick={() => router.push("/")}>切換使用者</button>
        </div>
    );
}