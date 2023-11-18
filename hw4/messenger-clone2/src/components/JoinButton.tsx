"use client";

import { useState, useRef } from "react";
import type { EventHandler, MouseEvent } from "react";
import { Input } from "@/components/ui/input";
import useJoin from "@/hooks/useJoin";
import useComment from "@/hooks/useComment";

type JoinButtonProps = {
    initialJoins: number;
    initialJoined: boolean;
    activityId: number;
    username: string;
};

export default function LikeButton({initialJoins, initialJoined,activityId,username}: JoinButtonProps) {
    const [joined, setJoined] = useState(initialJoined);
    const [joinsCount, setJoinsCount] = useState(initialJoins);
    const { joinActivity, unjoinActivity, loading } = useJoin();
    const { postComment } = useComment();
    const InputRef = useRef<HTMLInputElement>(null);
  
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
        sendMessage();
        }
    };
    
    const sendMessage = async() => {
        const comment = InputRef.current?.value;

        if (comment.trim() !== '') {               
            try{
                await postComment({
                    handle: username,
                    content: comment,
                    replyToActivityId: activityId,
                });
            }catch (e) {
                console.error(e);
                alert("Error posting comment");
            }        
            // 清空输入框
            InputRef.current.value = '';
            return;
        }
        else{
            alert('請輸入留言');
            return;
        }
    };
   

    const handleClick: EventHandler<MouseEvent> = async (e) => {
        // since the parent node of the button is a Link, when we click on the
        // button, the Link will also be clicked, which will cause the page to
        // navigate to the tweet page, which is not what we want. So we stop the
        // event propagation and prevent the default behavior of the event.
        e.stopPropagation();
        e.preventDefault();
        if (!username) return;
        if (joined) {
            await unjoinActivity({
                activityId,
                userHandle: username,
            });
            setJoinsCount((prev) => prev - 1);
            setJoined(false);
            
        } 
        else {
            await joinActivity({
                activityId,
                userHandle: username,
            });
            setJoinsCount((prev) => prev + 1);
            setJoined(true);
        }
    };

    return (
        <>
        <div className="ml-20 flex-none">
            {joined?(
            <button className="bg-green-700 hover:bg-green-300 text-white font-bold py-2 px-4 rounded"
                onClick={handleClick} disabled={loading}>我已參加</button>
            ):(
            <button className="bg-green-100 hover:bg-green-300 text-green-700 font-bold py-2 px-4 rounded" 
                onClick={handleClick} disabled={loading}>我想參加</button>
            )}
            <span className="ml-3 text-blue-700 font-bold"> {joinsCount}人參加</span>
        </div>
        <div className="ml-20 break-words block ">    
            <Input
                placeholder={joined?(username+" 留下你的想法"):('參加活動來加入討論吧!')}
                className="break-all mt-10 w-full p-2 border border-orange-300 rounded-lg bg-gray-100 sm:text-base bg-orange-50"
                disabled = {joined?(false):(true)}
                ref={InputRef}
                onKeyPress={handleKeyPress}
            />
        </div>
        </>
    );
}
