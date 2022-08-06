import Head from "next/head";
import {withIronSessionSsr} from "iron-session/next";
import {sessionOptions} from "../../../../utils/sessionSettings";
import csrf from "../../../../utils/csrf";
import AdminNavbar from "../../../../components/admin-nav";
import {
    Button, Flex,
    FormControl, FormLabel,
    Heading, Input,
    Stack, Text,
    useColorModeValue,
    useToast,
} from '@chakra-ui/react'
import {useEffect, useState} from "react";
import fetchJson from "../../../../utils/fetchJson";
import {useRouter} from "next/router";

export default function App_Admin_Home({user}) {
    const toast = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const submit = (event) => {
        event.preventDefault()
    }

    return (
        <>
            <Head>
                <title>Tea Status - Administration Panel</title>
                <meta property="og:title" content={'Tea Status - Administration Panel'} key="title"/>
                <meta property="og:url" content={'https://statuspage.theteacup.dev'}/>
                <meta property="og:description" content={'Custom built status page by Tea Cup'}/>
                <meta name="description" content={'Custom built status page by Tea Cup'}/>
            </Head>

            <AdminNavbar user={user}/>

            <br/>

            <form onSubmit={submit}>
                <Flex
                    align={'center'}
                    justify={'center'}
                    bg={useColorModeValue('gray.50', 'gray.800')}>
                    <Stack
                        spacing={4}
                        w={'full'}
                        maxW={'md'}
                        bg={useColorModeValue('white', 'gray.700')}
                        rounded={'xl'}
                        boxShadow={'lg'}
                        p={6}
                        my={12}>
                        <Heading lineHeight={1.1} fontSize={{base: '2xl', md: '3xl'}}>
                            New User Form
                        </Heading>
                        <Text
                            fontSize={{base: 'sm', sm: 'md'}}
                            color={useColorModeValue('gray.800', 'gray.400')}>
                            Trying to add someone new?
                        </Text>

                        <FormControl id="name">
                            <FormLabel>Name</FormLabel>
                            <Input
                                placeholder="John Doe"
                                _placeholder={{color: 'gray.500'}}
                                type="text"
                            />
                        </FormControl>
                        <FormControl id="email">
                            <FormLabel>Email</FormLabel>
                            <Input
                                placeholder="your-email@example.com"
                                _placeholder={{color: 'gray.500'}}
                                type="email"
                            />
                        </FormControl>
                        <FormControl id="password">
                            <FormLabel>Password</FormLabel>
                            <Input placeholder="SomecoolPassword!"
                                   _placeholder={{color: 'gray.500'}} type="password"/>
                        </FormControl>

                        <Stack spacing={6}>
                            {loading ? <Button
                                bg={'blue.400'}
                                color={'white'}
                                isLoading
                                _hover={{
                                    bg: 'blue.500',
                                }}>
                                Submitting
                            </Button> : <Button
                                bg={'blue.400'}
                                color={'white'}
                                type={'submit'}
                                _hover={{
                                    bg: 'blue.500',
                                }}>
                                Submit
                            </Button>}
                        </Stack>
                    </Stack>
                </Flex>

            </form>

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
        if (!user.admin) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            }
        }
        return {
            props: {user: req.session.user, csrfToken: req.csrfToken()}
        };
    }
}, sessionOptions)