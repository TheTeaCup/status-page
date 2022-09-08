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
    useToast,
} from '@chakra-ui/react';
import Head from "next/head";
import {useEffect, useState} from "react";
import {CloseIcon, MoonIcon, SunIcon} from "@chakra-ui/icons";
import fetchJson from "../utils/fetchJson";
import Router, {useRouter} from "next/router";
import Link from "next/link";
import {withIronSessionSsr} from "iron-session/next";
import {sessionOptions} from "../utils/sessionSettings";
import csrf from "../utils/csrf";
import * as api from "../utils/api";

export default function CreateAccount() {
    const toast = useToast();
    const router = useRouter();
    const {colorMode, toggleColorMode} = useColorMode();
    const color = useColorModeValue('white', 'gray.700');
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

    const submit = async (event) => {
        setLoading(true)
        event.preventDefault();
        let email = event.target.email.value;
        let name = event.target.name.value;
        let password = event.target.password.value;
        let passwordCheck = event.target.passwordCheck.value;

        if (!email || !name || !password || !passwordCheck) {
            setLoading(false);
            toast({
                title: 'Form Error',
                description: "It seems that you forgot to give a selection.",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        } else {

            if (password === passwordCheck) {
                let data = {
                    email: email,
                    name: name,
                    password: password
                }

                try {
                    let res = await api.newUserPublic(data);
                    console.log(res);

                    if (res.error) {
                        setLoading(false);
                        toast({
                            title: 'Form Error',
                            description: `${res?.message || 'API Error, Check Logs.'}`,
                            status: 'error',
                            duration: 9000,
                            isClosable: true,
                        });
                    } else {
                        if (res.message === "OK") {
                            router.push('/')
                        } else {
                            toast({
                                title: 'Unknown Error',
                                description: "Something weird happened, please check logs.",
                                status: 'error',
                                duration: 9000,
                                isClosable: true,
                            });
                            setLoading(false);
                        }
                    }

                } catch (e) {
                    console.log(e)
                    toast({
                        title: 'Form Error',
                        description: "Something weird happened, please contact support.",
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                    });
                    setLoading(false);
                }

                //setLoading(false);
            } else {
                setLoading(false);
                toast({
                    title: 'Form Error',
                    description: "Passwords do not match",
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                })
            }
        }
    }

    return (
        <>
            <Head>
                <title>Tea Status - Create Account</title>
                <meta property="og:title" content={'Tea Status - Create Account'} key="title"/>
                <meta property="og:url" content={'https://statuspage.theteacup.dev/create-account'}/>
                <meta property="og:description" content={'Custom built status page by Tea Cup'}/>
                <meta name="description" content={'Custom built status page by Tea Cup'}/>
            </Head>

            <form onSubmit={submit}>
                <Flex
                    minH={'100vh'}
                    align={'center'}
                    justify={'center'}
                    bg={useColorModeValue('gray.50', 'gray.800')}>


                    {userCreation ? (

                        <>
                            <Stack spacing={8} mx={'auto'} w={'full'}
                                   maxW={'md'} py={12} px={6}>
                                <Stack align={'center'}>
                                    <Heading fontSize={'4xl'}>Create an Account</Heading>
                                    <Text fontSize={'lg'} color={'gray.600'}>
                                        {/* eslint-disable-next-line react/no-unescaped-entities */}
                                        You've gotten access to this sweet panel!
                                    </Text>
                                </Stack>

                                <Box
                                    rounded={'lg'}
                                    bg={color}
                                    boxShadow={'lg'}
                                    p={8}>
                                    <Stack spacing={4}>

                                        <FormControl id="name">
                                            <FormLabel>Name</FormLabel>
                                            <Input
                                                placeholder="John Doe"
                                                _placeholder={{color: 'gray.500'}}
                                                type="text"
                                                required
                                            />
                                        </FormControl>
                                        <FormControl id="email">
                                            <FormLabel>Email</FormLabel>
                                            <Input
                                                placeholder="your-email@example.com"
                                                _placeholder={{color: 'gray.500'}}
                                                type="email"
                                                required
                                            />
                                        </FormControl>

                                        <FormControl id="password">
                                            <FormLabel>Password</FormLabel>
                                            <Input placeholder="SomecoolPassword!" required
                                                   _placeholder={{color: 'gray.500'}} type="password"/>
                                        </FormControl>
                                        <FormControl id="passwordCheck">
                                            <FormLabel>Verify Password</FormLabel>
                                            <Input placeholder="SomecoolPassword!" required
                                                   id="passwordCheck" _placeholder={{color: 'gray.500'}}
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
                                                type={'submit'}
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
                            </Stack>
                        </>

                    ) : (
                        <>
                            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
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
                            </Stack>
                        </>
                    )}

                </Flex>
            </form>

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