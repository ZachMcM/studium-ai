import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Home | Study AI"
}

export default function Home() {
  return (
    <div className='flex flex-col'>
      <main className="p-10 flex-1 mx-auto max-w-5xl flex flex-col space-y-32 pt-24">
        <div className='flex flex-col space-y-4 items-center text-center'>
          <div className='rounded-full border text-xs font-medium px-6 py-1.5'>v1.0.0 Live Now</div>
          <h1 className='font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl'>Helping Students Study Better Using AI</h1>
          <p className='leading-normal text-muted-foreground sm:text-xl sm:leading-8 font-medium max-w-[42rem]'>We harnesses the power of artificial intelligence to revolutionize the way students study and excel in their academic pursuits.</p>
        </div>
      </main>
    </div>
  )
}
