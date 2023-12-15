// TODO: 4. Call the signOut() function when the button is clicked
// hint: You may want to change the first line of this file
"use client";
import { signOut } from "next-auth/react";
import { publicEnv } from "@/lib/env/public";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();
  const out = ()=>{
    signOut({callbackUrl: publicEnv.NEXT_PUBLIC_BASE_URL});
    router.push("/");
  };
  return <Button variant={"outline"} onClick={out}>Sign Out</Button>;
}
// TODO: 4. end
