import HomePage from "./HomePage";
import Lists from "./Lists";

import uselist from "@/hooks/uselist";

export default function Page(){
  const {page,list} = uselist();
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