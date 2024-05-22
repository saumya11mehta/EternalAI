"use client";

import { ToastContainer,Bounce } from "react-toastify";
import HomeMain from "./home/main";

export default function Home() {

  return (
    <>
        <section className="flex flex-col justify-between">
            <HomeMain/>
        </section>
        <ToastContainer 
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            transition = {Bounce}
            />
    </>
  )
}
