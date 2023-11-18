"use client";

import { useRef} from "react";
import { useRouter } from "next/navigation";

import useUserInfo from "@/hooks/useUserInfo";
import useChat from "@/hooks/useChat";
import useChatJoin from "@/hooks/useChatJoin";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {validateStartEnd} from "@/lib/utils";


type NewActivityDialogProps = {
  open: boolean;
  onClose: () => void;
};



export default function NewChatDialog({ open, onClose }: NewActivityDialogProps) {
  // using a ref to get the dom element is one way to get the value of a input
  // another way is to use a state variable and update it on change, which can be found in CardDialog.tsx
    const { username } = useUserInfo();
    const userInputRef = useRef<HTMLInputElement>(null);
    const { joinChat, loading } = useChatJoin();
    const { newChat } = useChat();

    const router = useRouter();


    const handleActivity = async () => {
        const anotherUser = userInputRef.current?.value;
        const handle = username;
        // const isUserExist = await isUser(anotherUser);
        try {
            // if (isUserExist){alert("查無此人"); return;}
            if (!anotherUser){alert("請輸入名稱"); return;}
            const insertInfo = await newChat({handle:"123"});
       
            // await joinChat({
            //     chatIdId: Number(insertInfo.insertedId),
            //     userHandle: username,
            // });
            // await joinChat({
            //     chatIdId: Number(insertInfo.insertedId),
            //     userHandle: anotherUser,
            // });

            // router.push(`chats2/${insertInfo.insertedId.toString()}/?username=${username}`);
            
        } catch (e) {
            console.error(e);
            alert("error creating new chat");
            
        }
        onClose();
        return;
    };
   


    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogTitle>Add an activity</DialogTitle>
                    <Input placeholder="另一位使用者" ref={userInputRef}/>
                <DialogFooter>
                    <Button onClick={handleActivity} disabled={loading}>新增</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
