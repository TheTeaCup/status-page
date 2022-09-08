import Head from "next/head";
import {withIronSessionSsr} from "iron-session/next";
import {sessionOptions} from "../../../utils/sessionSettings";
import csrf from "../../../utils/csrf";
import AdminNavbar from "../../../components/admin-nav";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import fetchJson from "../../../utils/fetchJson";
import {
    Button,
    Flex,
    FormControl,
    FormHelperText,
    FormLabel,
    Heading,
    Input,
    Stack,
    Switch,
    Text,
    useColorModeValue,
    useToast
} from "@chakra-ui/react";

export default function App_Admin_Settings({user, settings, version}) {
    const router = useRouter();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    console.log(settings)

    useEffect(() => {
        (async () => {
            let userCheck = await fetchJson('/api/auth/check');
            if (userCheck.user) {
                let uVersion = userCheck.user.version;
                if (!uVersion === version) {
                    router.push('/app/logout');
                }
            }
        })()
    }, [router, version])

    const submit = async (event) => {
        setLoading(true)
        event.preventDefault();

        let domain = event.target.domain.value;
        let userCreationEnabled = event.target.usercreation.checked;
        let maintenance = event.target.maintenance.checked;

        if (!domain) {
            setLoading(false);
            toast({
                title: 'Form Error',
                description: "You did not enter a valid email",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        } else {

            let data = {
                domain: domain,
                userCreationEnabled: userCreationEnabled,
                maintenance: maintenance
            }

            try {
                let response = await fetchJson("/api/admin/settings", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': user.token || null,
                    },
                    body: JSON.stringify(data),
                });

                if (response.error) {
                    setLoading(false);
                    toast({
                        title: 'API Error',
                        description: response.error,
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                    })
                } else {
                    setLoading(false);
                    toast({
                        title: 'Success',
                        description: 'Settings updated',
                        status: 'success',
                        duration: 9000,
                        isClosable: true,
                    })
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
                <title>Tea Status - Administration Panel</title>
                <meta property="og:title" content={'Tea Status - Administration Panel'} key="title"/>
                <meta property="og:url" content={'https://statuspage.theteacup.dev'}/>
                <meta property="og:description" content={'Custom built status page by Tea Cup'}/>
                <meta name="description" content={'Custom built status page by Tea Cup'}/>
            </Head>

            <AdminNavbar user={user}/>

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
                            Updating Site Settings
                        </Heading>
                        <Text
                            fontSize={{base: 'sm', sm: 'md'}}
                            color={useColorModeValue('gray.800', 'gray.400')}>
                            Below you can change the sites settings!
                        </Text>

                        <FormControl id="domain">
                            <FormLabel>Domain</FormLabel>
                            <Input defaultValue={settings?.domain || ''} id={'domain'} type="url"/>
                        </FormControl>

                        <FormControl id="usercreation">
                            <FormLabel>User Creation</FormLabel>
                            <Switch defaultChecked={settings?.userCreationEnabled || false} id='usercreation'
                                    size={'md'}/>
                            <FormHelperText>If checked then anyone is able to create an account.</FormHelperText>
                        </FormControl>

                        <FormControl id="maintenance">
                            <FormLabel>Maintenance</FormLabel>
                            <Switch disabled={true} isChecked={settings?.maintenance || false} id='maintenance'
                                    size={'md'}/>
                            <FormHelperText>Not Done</FormHelperText>
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

        // fetch stats
        try {
            const protocol = req.headers['x-forwarded-proto'] || 'http'
            const baseUrl = req ? `${protocol}://${req.headers.host}` : ''
            let settings = await fetch(baseUrl + "/api/admin/settings", {
                headers: {
                    'Authorization': user.token || null,
                },
            }).then(res => res.json());
            if (settings.settings) {
                settings = settings.settings
            } else settings = {}

            return {
                props: {
                    user: req.session.user, csrfToken: req.csrfToken(), settings: settings
                }
            };
        } catch (e) {
            return {
                props: {user: req.session.user, csrfToken: req.csrfToken(), settings: {}}
            };
        }
    }
}, sessionOptions)