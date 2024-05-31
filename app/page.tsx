"use client";

import ToastProvider from "@/lib/react-toastify/ToastProvider";
import HomeMain from "@/app/home/main";

export default function Home() {

  return (
    <>
      <ToastProvider>
        <section className="flex flex-col justify-between">
            <HomeMain/>
        </section>
      </ToastProvider>
    </>
  )
}
