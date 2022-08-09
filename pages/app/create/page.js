import Navbar from "../../../components/nav";
import {
    Button,
    Code,
    Flex,
    FormControl,
    FormHelperText,
    FormLabel,
    Heading,
    Input,
    InputGroup,
    InputLeftAddon,
    ListItem,
    Stack,
    UnorderedList,
    useColorModeValue,
    useToast
} from "@chakra-ui/react";
import Head from "next/head";
import {withIronSessionSsr} from "iron-session/next";
import {sessionOptions} from "../../../utils/sessionSettings";
import csrf from "../../../utils/csrf";
import {useRouter} from "next/router";
import {useState} from "react";
import * as api from "../../../utils/api";

export default function App_Create_Page({user}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const toast = useToast();


    const onSubmit = async (event) => {
        event.preventDefault();

        let name = event.target.name.value;
        let slug = event.target.slug.value;

        name = name?.trim();
        slug = slug?.trim();

        if (!name || !slug) {
            setLoading(false);
            toast({
                title: 'Form Error',
                description: "It seems that you forgot to give a selection.",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        } else {
            if (typeof slug !== "string") {
                setLoading(false);
                toast({
                    title: 'Form Error',
                    description: "Slug -Accept string only",
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                })
            } else {
                slug = slug.toLowerCase();

                if (!slug.match(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/)) {
                    setLoading(false);
                    toast({
                        title: 'Form Error',
                        description: "Invalid Slug",
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                    })
                } else {
                    try {
                        let data = {
                            user: user.email,
                            name: name,
                            slug: slug
                        }
                        let newPage = await api.newPage(user.token, data);
                        console.log(newPage);

                        if (newPage.error) {
                            setLoading(false);
                            toast({
                                title: 'Form Error',
                                description: `${newPage?.message || 'API Error, Check Logs.'}`,
                                status: 'error',
                                duration: 9000,
                                isClosable: true,
                            });
                        } else {
                            // worked???
                            if (newPage.id) {
                                router.push('/app/pages/' + newPage.id)
                            } else router.push('/app')

                        }
                    } catch (e) {
                        console.log(e)
                        setLoading(false);
                        toast({
                            title: 'Form Error',
                            description: "Something weird happened, please contact support.",
                            status: 'error',
                            duration: 9000,
                            isClosable: true,
                        });
                    }
                }

            }
        }

    }

    return (
        <>
            <Head>
                <title>Tea Status - App Create Status Page</title>
                <meta property="og:title" content={'Tea Status - App'} key="title"/>
                <meta property="og:url" content={'https://statuspage.theteacup.dev'}/>
                <meta property="og:description" content={'Custom built status page by Tea Cup'}/>
                <meta name="description" content={'Custom built status page by Tea Cup'}/>
            </Head>

            <Navbar user={user}/>

            <form onSubmit={onSubmit}>

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
                            Page Creation Builder
                        </Heading>

                        {/* Fill Out Form */}

                        <FormControl id="name" isRequired>
                            <FormLabel>Name</FormLabel>
                            <Input
                                placeholder="Name this page"
                                _placeholder={{color: 'gray.500'}}
                                type="text"
                            />
                        </FormControl>

                        <FormControl id="slug" isRequired>
                            <FormLabel>Slug</FormLabel>
                            <InputGroup>
                                <InputLeftAddon children={'/status/'}/>
                                <Input type='text' placeholder='cool-status-page' _placeholder={{color: 'gray.500'}}/>
                            </InputGroup>
                            <FormHelperText>
                                <UnorderedList>
                                    <ListItem>Accept characters: <Code>a-z 0-9 -</Code></ListItem>
                                    <ListItem>Start or end with <Code>a-z</Code> only</ListItem>
                                    <ListItem>No consecutive dashes <Code>--</Code></ListItem>
                                </UnorderedList>
                            </FormHelperText>

                        </FormControl>
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
                                type={'submit'}
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
        return {
            props: {user: req.session.user, csrfToken: req.csrfToken()}
        };
    }
}, sessionOptions)