"use client";

import { useRef} from "react";
import { useRouter } from "next/navigation";

import useUserInfo from "@/hooks/useUserInfo";
import useActivity from "@/hooks/useActivity";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import useJoin from "@/hooks/useJoin";
import {validateStartEnd} from "@/lib/utils";


type NewActivityDialogProps = {
  open: boolean;
  onClose: () => void;
};



export default function NewChatDialog({ open, onClose }: NewActivityDialogProps) {
  // using a ref to get the dom element is one way to get the value of a input
  // another way is to use a state variable and update it on change, which can be found in CardDialog.tsx
    const { username } = useUserInfo();
    const titleInputRef = useRef<HTMLInputElement>(null);
    const startTimeInputRef = useRef<HTMLInputElement>(null);
    const endTimeInputRef = useRef<HTMLInputElement>(null);
    const { postActivity, loading } = useActivity();
    const { joinActivity } = useJoin();

    const router = useRouter();


    const handleActivity = async () => {
        const content = titleInputRef.current?.value;
        const startTime = startTimeInputRef.current?.value;
        const endTime = endTimeInputRef.current?.value;
        const handle = username;
        

        try {
            if (!content){alert("請輸入標題"); return;}
            if (!username){alert("使用者名稱有誤"); return;}
            if (!startTime){alert("請輸入活動開始時間"); return;}
            if (!endTime){alert("請輸入活動結束時間"); return;}
            
            const validateResult = validateStartEnd(startTime , endTime );
            if (validateResult!=true){
                alert(validateResult);
                return;
            }


            const insertInfo = await postActivity({handle,content,startTime,endTime});
       
            await joinActivity({
              activityId: Number(insertInfo.insertedId),
              userHandle: username,
            });

            router.push(`activity/${insertInfo.insertedId.toString()}/?username=${username}`);
            
        } catch (e) {
            console.error(e);
            alert("Error posting tweet");
            
        }
        onClose();
        return;
    };
   


    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogTitle>Add an activity</DialogTitle>
                    <Input placeholder="標題" ref={titleInputRef}/>
                    <Label htmlFor="name" className="text-left">From</Label>
                    <Input placeholder="YYYY-MM-DD HH" ref={startTimeInputRef}/>
                    <Label htmlFor="name" className="text-left">To</Label>
                    <Input placeholder="YYYY-MM-DD HH" ref={endTimeInputRef}/>
                <DialogFooter>
                    <Button onClick={handleActivity} disabled={loading}>新增</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
