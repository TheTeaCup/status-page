import Head from "next/head";
import {withIronSessionSsr} from "iron-session/next";
import {sessionOptions} from "../../../../utils/sessionSettings";
import csrf from "../../../../utils/csrf";
import AdminNavbar from "../../../../components/admin-nav";
import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    SimpleGrid,
    Stack,
    Switch,
    Text,
    useColorModeValue,
    useToast,
} from '@chakra-ui/react'
import {useState} from "react";
import {useRouter} from "next/router";
import * as api from "../../../../utils/api";

export default function App_Admin_Home({user}) {
    const toast = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const submit = async (event) => {
        setLoading(true)
        event.preventDefault();
        let email = event.target.email.value;
        let name = event.target.name.value;
        let password = event.target.password.value;
        let passwordCheck = event.target.passwordCheck.value;
        let staff = event.target.staff.checked;
        let admin = event.target.admin.checked;

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
                    password: password,
                    staff: staff,
                    admin: admin
                }

                try {
                    let res = await api.newUser(user.token, data);
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
                            router.push('/app/admin/users')
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
                                   id="passwordCheck" _placeholder={{color: 'gray.500'}} type="password"/>
                        </FormControl>

                        <SimpleGrid columns={{base: 1, md: 2}} spacing={{base: 5, lg: 8}}>
                            <FormControl display='flex' alignItems='center'>
                                <FormLabel htmlFor='staff' mb='0'>
                                    Staff
                                </FormLabel>
                                <Switch id='staff'/>
                            </FormControl>
                            <FormControl display='flex' alignItems='center'>
                                <FormLabel htmlFor='admin' mb='0'>
                                    Admin
                                </FormLabel>
                                <Switch id='admin'/>
                            </FormControl>
                        </SimpleGrid>

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