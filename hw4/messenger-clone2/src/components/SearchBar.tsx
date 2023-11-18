"use client";

import { usePathname,useRouter,useSearchParams } from "next/navigation";
import { useRef, useState} from "react";
import { Input } from "@/components/ui/input";
import NewChatDialog from "./NewChatDialog2";
import useUserInfo from "@/hooks/useUserInfo";

export default function SearchBar() {
    const { username } = useUserInfo();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [newChatDialogOpen, setNewChatDialogOpen] = useState(false);
    const router = useRouter();


    const handleSearch = () => {
        const searchContent = textareaRef.current?.value;
        
        const params = new URLSearchParams(searchParams);
        // validateUsername and validateHandle would return false if the input is
        // invalid, so we can safely use the values here and assert that they are
        // not null or undefined.
        params.set("username", username!);
        params.set("search", searchContent!);
        router.push(`${pathname}?${params.toString()}`);
        
    };

    return (   
        <>
        <div className="relative w-full">
            <Input 
                ref={textareaRef}
                placeholder="搜尋使用者..."
            />
            <button 
                type="button" onClick={handleSearch}
                className="absolute top-0 right-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
                <span className="sr-only">Search</span>
            </button>
        </div><br></br>
        <button 
            type="button" 
            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-bold rounded-lg text-lg px-4 py-1.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            onClick={() => setNewChatDialogOpen(true)}>新增</button>
        <NewChatDialog open={newChatDialogOpen} onClose={() => setNewChatDialogOpen(false)}/>
        </>
    );
}
