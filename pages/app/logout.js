import Navbar from "../../components/nav";
import Head from "next/head";
import {withIronSessionSsr} from "iron-session/next";
import {sessionOptions} from "../../utils/sessionSettings";
import csrf from "../../utils/csrf";
import {useEffect} from "react";
import Router from 'next/router'

export default function App_Logout({user}) {
    useEffect(() => {
        async function load() {
            if (user) {
                let res = await fetch(`/api/auth/logout`, {method: "GET"}).then(res => res.json());
                //console.log(res)
                if (!res.user) {
                    Router.push("/?success=logged_out")
                } else Router.push("/")
            } else {
                Router.push("/")
            }
        }

        load()
    }, [user])

    return (
        <>
            <Head>
                <title>Tea Status - App</title>
                <meta property="og:title" content={'Tea Status - App'} key="title"/>
                <meta property="og:url" content={'https://statuspage.theteacup.dev'}/>
                <meta property="og:description" content={'Custom built status page by Tea Cup'}/>
                <meta name="description" content={'Custom built status page by Tea Cup'}/>
            </Head>

            <Navbar user={user}/>


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