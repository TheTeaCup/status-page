import Navbar from "../../../components/nav";
import {Button, Flex, Heading, Radio, RadioGroup, Stack, useColorModeValue, useToast} from "@chakra-ui/react";
import Head from "next/head";
import {withIronSessionSsr} from "iron-session/next";
import {sessionOptions} from "../../../utils/sessionSettings";
import csrf from "../../../utils/csrf";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";

export default function App_Create_Home({user}) {
    const router = useRouter();
    const toast = useToast();
    const [value, setValue] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        router.prefetch('/app/create/monitor');
        router.prefetch('/app/create/page');
    })

    const onClick = () => {
        setLoading(true);
        if (value) {
            router.push('/app/create/' + value)
        } else {
            setLoading(false);
            toast({
                title: 'Form Error',
                description: "It seems that you forgot to give a selection.",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        }
    }

    return (
        <>
            <Head>
                <title>Tea Status - App Create</title>
                <meta property="og:title" content={'Tea Status - App'} key="title"/>
                <meta property="og:url" content={'https://statuspage.theteacup.dev'}/>
                <meta property="og:description" content={'Custom built status page by Tea Cup'}/>
                <meta name="description" content={'Custom built status page by Tea Cup'}/>
            </Head>

            <Navbar user={user}/>


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
                    <Heading lineHeight={1.1} fontSize={{base: '2xl', sm: '3xl'}}>
                        Adding Something New?
                    </Heading>

                    {/* selection */}
                    <RadioGroup onChange={setValue} value={value} p={6}>
                        <Stack>
                            <Radio size={'lg'} value="monitor">Monitor</Radio>
                            <Radio size={'lg'} value="page">Page</Radio>
                        </Stack>
                    </RadioGroup>

                    <Stack spacing={6} direction={['column', 'row']}>
                        <Button
                            onClick={() => router.back()}
                            bg={'red.400'}
                            color={'white'}
                            w="full"
                            _hover={{
                                bg: 'red.500',
                            }}>
                            Back
                        </Button>

                        {loading ? <Button
                            isLoading
                            bg={'blue.400'}
                            color={'white'}
                            w="full"
                            _hover={{
                                bg: 'blue.500',
                            }}>
                            Next
                        </Button> : <Button
                            onClick={onClick}
                            bg={'blue.400'}
                            color={'white'}
                            w="full"
                            _hover={{
                                bg: 'blue.500',
                            }}>
                            Next
                        </Button>}
                    </Stack>
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