import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Spinner,
    Stack,
    Text,
    useColorMode,
    useColorModeValue,
} from '@chakra-ui/react';
import Head from "next/head";
import {useEffect, useState} from "react";
import {CloseIcon, MoonIcon, SunIcon} from "@chakra-ui/icons";
import fetchJson from "../utils/fetchJson";
import Router from "next/router";
import Link from "next/link";
import {withIronSessionSsr} from "iron-session/next";
import {sessionOptions} from "../utils/sessionSettings";
import csrf from "../utils/csrf";

export default function CreateAccount() {
    const {colorMode, toggleColorMode} = useColorMode();
    const color = useColorModeValue('white', 'gray.700');
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [passwordVerify, setPasswordVerify] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userCreation, setUserCreation] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                let settingsCheck = await fetchJson('/api/public/settings');
                setLoading(false)
                if (settingsCheck.data) {
                    setUserCreation(settingsCheck.data.userCreationEnabled);
                    setLoading(false)
                    if (!settingsCheck.data.setup) {
                        Router.push('/setup')
                    }
                }
            } catch (e) {
                setLoading(false)
                console.log(e)
            }
        })()
    })

    return (
        <>
            <Head>
                <title>Tea Status - Create Account</title>
                <meta property="og:title" content={'Tea Status - Create Account'} key="title"/>
                <meta property="og:url" content={'https://statuspage.theteacup.dev/create-account'}/>
                <meta property="og:description" content={'Custom built status page by Tea Cup'}/>
                <meta name="description" content={'Custom built status page by Tea Cup'}/>
            </Head>

            <Flex
                minH={'100vh'}
                align={'center'}
                justify={'center'}
                bg={useColorModeValue('gray.50', 'gray.800')}>
                <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>

                    {userCreation ? (

                        <>
                            <Stack align={'center'}>
                                <Heading fontSize={'4xl'}>Create an Account</Heading>
                                <Text fontSize={'lg'} color={'gray.600'}>
                                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                                    You've gotten access to this sweet panel!
                                </Text>
                            </Stack>

                            <Stack align={'center'}>
                                <Heading fontSize={'4xl'}>This is not done</Heading>
                            </Stack>

                            <Box
                                rounded={'lg'}
                                bg={color}
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
                                    <FormControl id="password-ver">
                                        <FormLabel>Retype Password</FormLabel>
                                        <Input onChange={(event) => setPasswordVerify(event.target.value)}
                                               type="password"/>
                                    </FormControl>
                                    <Stack spacing={10}>
                                        <Stack
                                            direction={{base: 'column', sm: 'row'}}
                                            align={'start'}
                                            justify={'space-between'}>
                                            <Button onClick={toggleColorMode}>
                                                {colorMode === 'light' ? <MoonIcon/> : <SunIcon/>}
                                            </Button>
                                        </Stack>
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

                                            _hover={{
                                                bg: 'blue.500',
                                            }}>
                                            Submit
                                        </Button>}

                                        <Link href={'/'}>
                                            <Button
                                                bg={'blue.400'}
                                                color={'white'}
                                                _hover={{
                                                    bg: 'blue.500',
                                                }}>
                                                Have an Account
                                            </Button>
                                        </Link>

                                    </Stack>
                                </Stack>
                            </Box>
                        </>

                    ) : (
                        <>
                            {loading ? (
                                <Spinner size='xl'/>
                            ) : (
                                <>
                                    <Box textAlign="center" py={10} px={6}>
                                        <Box display="inline-block">
                                            <Flex
                                                flexDirection="column"
                                                justifyContent="center"
                                                alignItems="center"
                                                bg={'red.500'}
                                                rounded={'50px'}
                                                w={'55px'}
                                                h={'55px'}
                                                textAlign="center">
                                                <CloseIcon boxSize={'20px'} color={'white'}/>
                                            </Flex>
                                        </Box>
                                        <Heading as="h2" size="xl" mt={6} mb={2}>
                                            This page is not open
                                        </Heading>
                                        <Text color={'gray.500'}>
                                            If you would like to create an account then please contact this sites
                                            administrator.
                                        </Text>
                                        <br/>
                                        <Link href={'/'}>
                                            <Button
                                                bg={'blue.400'}
                                                color={'white'}
                                                _hover={{
                                                    bg: 'blue.500',
                                                }}>
                                                Go Back
                                            </Button>
                                        </Link>
                                    </Box>
                                </>
                            )}
                        </>
                    )}

                </Stack>
            </Flex>

        </>
    );
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