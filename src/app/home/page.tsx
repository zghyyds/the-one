"use client";
import Image from "next/image";
import { ReactIcon } from '@/components/icon';
import {Button, ButtonGroup} from "@nextui-org/button";
import { BiSearch } from "react-icons/bi";
import { useEffect } from "react";
import { getTickers } from "@/api";

export default function Home() {

   useEffect(()=>{
      const getTickersApi = async()=>{
         console.log(123123);
         
         let res = await getTickers()
         console.log(res,'pppp');
      }
      getTickersApi()
   },[])


   return <div className="flex justify-center items-center bg-[url('/bg.png')]" style={{height:"600px", backgroundImage:"url('/bg.png')", 
   backgroundPosition: "center",  justifyContent: "center", alignItems: "center", flex: 1,display:"flex"}}>
      <div className="h-[262px] flex-col items-center justify-center flex rounded-full border-1 border-[rgba(255,255,255,.1)]" style={{ width: "1160px",  }}>
         <Image
            src={"/title.svg"}
            width={964}
            height={192}
            alt=""
         ></Image>
         <div className="relative flex items-center justify-center w-[3/4]" style={{position:"relative",width:"70%"}}>
            <input
               type="text"
               placeholder="Type Your Message"
               // style={{position:"relative",width:"70%"}}
               className="border-[#7676E0] border-1 w-full text-center px-6 py-4 text-lg text-black bg-white from-gray-800 to-gray-900 rounded-full outline-none placeholder-[#8181E5] "
            />
            <Button  className="absolute rounded-full flex justify-center items-center" style={{width:"56px",height:"56px",backgroundColor:"#8181E5",right:5}}>
               <ReactIcon icon={BiSearch} style={{ fontSize: '24px'}}></ReactIcon>
            </Button>
         </div>
      </div>
   </div>
}  