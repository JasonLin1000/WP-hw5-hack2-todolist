"use client"

import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import path from "path";

type ActivityProps = {
    username?: string;
    id: number;
    content: string;
    joins: number;
    joined?: boolean;
};

// note that the Tweet component is also a server component
// all client side things are abstracted away in other components
export default function Activity({
    username,
    id,
    content,
    joins,
    joined,
}: ActivityProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const handleChat = () => {
        const params = new URLSearchParams(searchParams);
        params.set("chat_id", id.toString()!);
        // router.push(`${pathname}?${params.toString()}`);
        router.push(`${pathname}?${params.toString()}`);
        router.refresh();
        return true;
    };
    return (
        <>
        <Link
            className="w-full px-4 pt-3 transition-colors"
            href={{
            pathname: `/chats2/${id}`,
            query: {
                username,
            },
            }}
            onClick= {handleChat}       
            >
            <div className="flex flex-col">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <ul className="flex flex-col">
                <li className="w-full bg-gray-100 dark:bg-white/5 p-3 rounded-md hover:bg-gray-200">
                    <div className="flex items-center space-x-4">
                    <div className="flex-1 min-w-0">
                        <p className="text-lg font-bold text-gray-900 truncate dark:text-white">{content}</p>
                    </div>
                    {joined?(
                        <>
                        <svg className="w-6 h-6 text-green-500 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                        </svg>
                        </>
                    ):(<></>)}
                    {joins?(
                        <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">{joins}人參加</div>
                    ):(
                        <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">0人參加</div>
                    )}
                    </div>
                </li>
            </ul>
            </div> 
        </Link>
        </>
    );
}
