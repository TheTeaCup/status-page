import Head from 'next/head';
import ServicesSection from "@/components/services";

export default function Home() {
    return (
        <>
            <Head>
                <title>Status - Hunter Wilson</title>
            </Head>

            <div className='h-full w-full'>
                <div
                    className="mt-20 absolute inset-0 bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
                <div className="w-full h-40 absolute bg-light-purple">
                    <div
                        className="mt-5 md:pl-80 md:pr-80 sm:w-full h-full bg-purple-500">
                        <center>
                            <h1 className={"text-xl text-gray-200"}>
                                Status for my Personal Projects
                            </h1>
                        </center>
                    </div>
                </div>
                <div className='mt-20 w-full absolute overflow-scroll'>
                    <ServicesSection />
                </div>
            </div>

        </>
    )
}
