import HomePage from "./HomePage";
import Lists from "./Lists";

import useList from "@/hooks/useList";

export default function Page(){
  const {page,list} = useList();
  return (
    <>
      {(page==="home")?(
        <HomePage/>
      ):(
        <Lists id = {list}/>
      )}
    </>
  );
}