import Navbar from "../../../components/nav";
import {Box} from "@chakra-ui/react";
import Head from "next/head";
import {withIronSessionSsr} from "iron-session/next";
import {sessionOptions} from "../../../utils/sessionSettings";
import csrf from "../../../utils/csrf";
import {useEffect, useState} from "react";
import fetchJson from "../../../utils/fetchJson";

export default function App_Pages_Home({user}) {
    const [pages, setPages] = useState(user?.pages || []);

    useEffect(() => {
        (async () => {
            let userCheck = await fetchJson('/api/user/' + user.email, {
                "headers": {
                    "Authorization": user.token
                }
            });
            if (userCheck.user) {
                if (userCheck.user.pages) {
                    setPages(userCheck.user.pages)
                }
            }
        })()
    }, [])

    return (
        <>
            <Head>
                <title>Tea Status - App Pages List</title>
                <meta property="og:title" content={'Tea Status - App'} key="title"/>
                <meta property="og:url" content={'https://statuspage.theteacup.dev'}/>
                <meta property="og:description" content={'Custom built status page by Tea Cup'}/>
                <meta name="description" content={'Custom built status page by Tea Cup'}/>
            </Head>

            <Navbar user={user}/>


            <Box p={4}>Pages Home</Box>
            {console.log(pages)}
        </>
    )
}

export const getServerSideProps = withIronSessionSsr(async function ({req, res}) {
    const user = req.session.user;

    await csrf(req, res);

    if (user === undefined) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    } else {
        return {
            props: {user: req.session.user, csrfToken: req.csrfToken()}
        };
    }
}, sessionOptions)