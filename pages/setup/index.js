import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    Text,
    useColorModeValue,
    useToast,
} from '@chakra-ui/react';
import Head from "next/head";
import {useEffect, useState} from "react";
import fetchJson from "../../utils/fetchJson";
import Router from "next/router";
import {withIronSessionSsr} from "iron-session/next";
import {sessionOptions} from "../../utils/sessionSettings";
import csrf from "../../utils/csrf";
import {validateEmail} from "../../utils";

export default function SetupSite({user, csrfToken}) {
    const toast = useToast();

    useEffect(() => {
        (async () => {
            let setupCheck = await fetchJson('/api/setup');
            if (setupCheck.message === 'OK') {
                await Router.push('/')
            }
        })()
    }, [])

    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [loading, setLoading] = useState(false);

    const setup = async event => {
        event.preventDefault();
        setLoading(true);
        const isValid = validateEmail(email);

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
        } else if (!username) {
            setLoading(false);
            toast({
                title: 'Form Error',
                description: "You did not enter a valid username",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        } else if (!isValid) {
            toast({
                title: 'Form Error',
                description: "You did not enter a valid email",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
            setLoading(false);
        } else {
            // api submit
            let data = {
                email: email,
                password: password,
                username: username
            }

            try {
                let response = await fetchJson("/api/setup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'CSRF-Token': csrfToken || null
                    },
                    body: JSON.stringify(data),
                });

                if (response.error) {
                    if (response.message) {
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

    return (
        <>
            <Head>
                <title>Tea Status - Setup</title>
                <meta property="og:title" content={'Tea Status - Setup'} key="title"/>
                <meta property="og:url" content={'https://statuspage.theteacup.dev'}/>
                <meta property="og:description" content={'Custom built status page by Tea Cup'}/>
                <meta name="description" content={'Custom built status page by Tea Cup'}/>
            </Head>
            <Flex
                minH={'100vh'}
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
                        Tea Status - Setup
                    </Heading>
                    <Text
                        fontSize={{base: 'sm', sm: 'md'}}
                        color={useColorModeValue('gray.800', 'gray.400')}>
                        Please provide this site with the following:
                    </Text>

                    <FormControl id="name">
                        <FormLabel>Name</FormLabel>
                        <Input
                            placeholder="John Doe"
                            onChange={(event) => setUsername(event.target.value)}
                            _placeholder={{color: 'gray.500'}}
                            type="text"
                        />
                    </FormControl>
                    <FormControl id="email">
                        <FormLabel>Email</FormLabel>
                        <Input
                            placeholder="your-email@example.com"
                            onChange={(event) => setEmail(event.target.value)}
                            _placeholder={{color: 'gray.500'}}
                            type="email"
                        />
                    </FormControl>
                    <FormControl id="password">
                        <FormLabel>Password</FormLabel>
                        <Input placeholder="SomecoolPassword!"
                               onChange={(event) => setPassword(event.target.value)}
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
                            onClick={setup}
                            _hover={{
                                bg: 'blue.500',
                            }}>
                            Submit
                        </Button>}
                    </Stack>
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
            props: {user: req.session.user, csrfToken: req.csrfToken()}
        };
    }
}, sessionOptions)