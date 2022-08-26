import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    Text,
    useColorMode,
    useColorModeValue,
    useToast,
} from '@chakra-ui/react';
import {useEffect, useState} from "react";
import {MoonIcon, SunIcon} from "@chakra-ui/icons";
import Head from "next/head";
import fetchJson from "../utils/fetchJson";
import Router from "next/router";
import {withIronSessionSsr} from "iron-session/next";
import {sessionOptions} from "../utils/sessionSettings";
import csrf from "../utils/csrf";
import Link from "next/link";

export default function Home({user}) {
    const toast = useToast();

    const {colorMode, toggleColorMode} = useColorMode();

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userCreation, setUserCreation] = useState(false);

    const login = async event => {
        event.preventDefault();
        setLoading(true);
        if (!email) {
            setLoading(false);
            toast({
                title: 'Form Error',
                description: "You did not enter a valid email",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        } else if (!password) {
            setLoading(false);
            toast({
                title: 'Form Error',
                description: "You did not enter a valid password",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        } else {
            // api submit
            let data = {
                email: email,
                password: password
            }

            try {
                let response = await fetchJson("/api/auth", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        // 'CSRF-Token': csrfToken || null
                    },
                    body: JSON.stringify(data),
                });

                if (response.error) {
                    if (response.message === 'Needs Setup') {
                        Router.push('/setup')
                    } else if (response.message) {
                        toast({
                            title: 'API Error',
                            description: `${response.message}`,
                            status: 'error',
                            duration: 9000,
                            isClosable: true,
                        })

                        setLoading(false);
                    } else {
                        toast({
                            title: 'API Error',
                            description: `Error Occurred, Check Logs`,
                            status: 'error',
                            duration: 9000,
                            isClosable: true,
                        })
                        setLoading(false);
                    }
                } else {
                    if (response.message === "OK") {
                        Router.push('/app')
                    } else {
                        toast({
                            title: 'API Error',
                            description: `Error Occurred, Check Logs`,
                            status: 'error',
                            duration: 9000,
                            isClosable: true,
                        })
                        setLoading(false);
                    }
                }

            } catch (e) {
                toast({
                    title: 'API Error',
                    description: `Error Occurred, Check Logs`,
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                })
                setLoading(false);
            }

        }
    }

    useEffect(() => {
        (async () => {
            try {
                let settingsCheck = await fetchJson('/api/public/settings');
                if(settingsCheck.data) {
                    setUserCreation(settingsCheck.data.userCreationEnabled);
                    if(!settingsCheck.data.setup) {
                        Router.push('/setup')
                    }
                }
            } catch (e) {
                console.log(e)
            }
        })()
    })

    return (
        <>
            <Head>
                <title>Tea Status - Login</title>
                <meta property="og:title" content={'Tea Status - Login'} key="title"/>
                <meta property="og:url" content={'https://statuspage.theteacup.dev'}/>
                <meta property="og:description" content={'Custom built status page by Tea Cup'}/>
                <meta name="description" content={'Custom built status page by Tea Cup'}/>
            </Head>

            <Flex
                minH={'100vh'}
                align={'center'}
                justify={'center'}
                bg={useColorModeValue('gray.50', 'gray.800')}>
                <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                    <Stack align={'center'}>
                        <Heading fontSize={'4xl'}>Sign in to your account</Heading>
                        <Text fontSize={'lg'} color={'gray.600'}>
                            to enjoy all of our cool features✌️
                        </Text>
                    </Stack>
                    <Box
                        rounded={'lg'}
                        bg={useColorModeValue('white', 'gray.700')}
                        boxShadow={'lg'}
                        p={8}>
                        <Stack spacing={4}>
                            <FormControl id="email">
                                <FormLabel>Email address</FormLabel>
                                <Input onChange={(event) => setEmail(event.target.value)} type="email"/>
                            </FormControl>
                            <FormControl id="password">
                                <FormLabel>Password</FormLabel>
                                <Input onChange={(event) => setPassword(event.target.value)} type="password"/>
                            </FormControl>
                            <Stack spacing={10}>
                                <Stack
                                    direction={{base: 'column', sm: 'row'}}
                                    align={'start'}
                                    justify={'space-between'}>
                                    <Button onClick={toggleColorMode}>
                                        {colorMode === 'light' ? <MoonIcon/> : <SunIcon/>}
                                    </Button>
                                    <Link target={'_blank'} href={'/password-reset'} color={'blue.400'}>Forgot
                                        password?</Link>
                                </Stack>
                                {loading ? <Button
                                    bg={'blue.400'}
                                    color={'white'}
                                    isLoading
                                    _hover={{
                                        bg: 'blue.500',
                                    }}>
                                    Signing in
                                </Button> : <Button
                                    bg={'blue.400'}
                                    color={'white'}
                                    onClick={login}
                                    _hover={{
                                        bg: 'blue.500',
                                    }}>
                                    Sign in
                                </Button>}

                                {userCreation && <>
                                    <Link href={'/create-account'}>
                                        <Button
                                            bg={'blue.400'}
                                            _hover={{
                                                bg: 'blue.500',
                                            }}
                                            color={'white'}>
                                            Create an Account
                                        </Button>
                                    </Link>
                                </>}

                            </Stack>
                        </Stack>
                    </Box>
                </Stack>
            </Flex>
        </>
    )
}

export const getServerSideProps = withIronSessionSsr(async function ({req, res}) {
    const user = req.session.user;

    await csrf(req, res);

    if (user === undefined) {
        return {
            props: {
                user: null,
                csrfToken: req.csrfToken()
            },
        };
    } else {
        return {
            redirect: {
                destination: '/app',
                permanent: false,
            },
        }
    }
}, sessionOptions)