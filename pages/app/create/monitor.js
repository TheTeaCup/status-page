import Navbar from "../../../components/nav";
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Input,
    Select,
    Spacer,
    Stack,
    Textarea,
    useColorModeValue,
    useToast
} from "@chakra-ui/react";
import Head from "next/head";
import {withIronSessionSsr} from "iron-session/next";
import {sessionOptions} from "../../../utils/sessionSettings";
import csrf from "../../../utils/csrf";
import {useState} from "react";
import {useRouter} from "next/router";
import {validateJSON} from "../../../utils";
import * as api from "../../../utils/api";

export default function App_Create_Monitor({user}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    // form items
    const [type, setType] = useState('https');

    const onSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        let ready = true;

        let type = event.target.type.value;
        let name = event.target.name.value;
        let url = event.target.url.value;
        let heart = event.target.heart.value;
        let retires = event.target.retires.value;
        let method = event.target.method.value;
        let body = event.target.body.value;
        let headers = event.target.headers.value;

        if (body) {
            // validate body data
            let bodyTest = validateJSON(body);
            if (!bodyTest) {
                ready = false;
                setLoading(false);
                toast({
                    title: 'Form Error',
                    description: "Incorrect format of Body.",
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                });
            }
        }

        if (headers) {
            // validate headers data
            let headersTest = validateJSON(headers);
            if (!headersTest) {
                ready = false;
                setLoading(false);
                toast({
                    title: 'Form Error',
                    description: "Incorrect format of Headers.",
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                });
            }
        }

        if (ready) {
            if (type === 'https') {

                // continue with processing

                try {
                    let data = {
                        user: user.email,
                        type: type || 'http',
                        name: name || 'null',
                        source: url || 'http://',
                        heartBeat: heart || 60,
                        retires: retires,
                        method: method || 'GET',
                        body: body || null,
                        headers: headers || null,
                    }

                    let newMonitor = await api.newMonitor(user.token, data);
                    console.log(newMonitor);

                    if (newMonitor.error) {
                        setLoading(false);
                        toast({
                            title: 'Form Error',
                            description: `${newMonitor?.message || 'API Error, Check Logs.'}`,
                            status: 'error',
                            duration: 9000,
                            isClosable: true,
                        });
                    } else {
                        // worked???
                        if (newMonitor.id) {
                            router.push('/app/monitors/' + newMonitor.id)
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

    return (
        <>
            <Head>
                <title>Tea Status - App Create Monitor</title>
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
                        width={[
                            '90%', // 0-30em
                            '50%', // 30em-48em
                            '25%', // 48em-62em
                            '30%', // 62em+
                        ]}
                        bg={useColorModeValue('white', 'gray.700')}
                        rounded={'xl'}
                        boxShadow={'lg'}
                        p={6}
                        my={12}>
                        <Heading lineHeight={1.1} fontSize={{base: '2xl', sm: '3xl'}}>
                            Monitor Creation Builder
                        </Heading>

                        <Spacer/>
                        {/* Fill Out Form */}


                        <FormControl id="type" isRequired>
                            <FormLabel>Type</FormLabel>
                            <Select isDisabled={true} placeholder='Select option'>
                                <option selected={true} value='https'>HTTP(s)</option>
                            </Select>
                        </FormControl>

                        <FormControl id="name" isRequired>
                            <FormLabel>Name</FormLabel>
                            <Input
                                placeholder="Name this monitor"
                                _placeholder={{color: 'gray.500'}}
                                type="text"
                            />
                        </FormControl>

                        <FormControl id="url" isRequired>
                            <FormLabel>Source</FormLabel>
                            <Input
                                placeholder="example.com"
                                _placeholder={{color: 'gray.500'}}
                                type="text"
                                pattern="https?://.+"
                            />
                        </FormControl>

                        <Stack spacing={6}>
                            <HStack>

                                <Box>
                                    <FormControl id="heart">
                                        <FormLabel>Heartbeat Interval</FormLabel>
                                        <Input
                                            type="number"
                                            defaultValue={60}
                                            min={20}
                                        />
                                    </FormControl>
                                </Box>

                                <Box>
                                    <FormControl id="retires">
                                        <FormLabel>Retries</FormLabel>
                                        <Input
                                            type="number"
                                            min={0}
                                        />
                                    </FormControl>
                                </Box>

                            </HStack>
                        </Stack>

                        {type === 'https' &&
                            <>
                                <FormControl id="method">
                                    <FormLabel>Method</FormLabel>
                                    <Select placeholder='Select option'>
                                        <option selected={true} value="GET">
                                            GET
                                        </option>
                                        <option value="POST">
                                            POST
                                        </option>
                                        <option value="PUT">
                                            PUT
                                        </option>
                                        <option value="PATCH">
                                            PATCH
                                        </option>
                                        <option value="DELETE">
                                            DELETE
                                        </option>
                                        <option value="HEAD">
                                            HEAD
                                        </option>
                                        <option value="OPTIONS">
                                            OPTIONS
                                        </option>
                                    </Select>
                                </FormControl>
                            </>}

                        <FormControl id="body">
                            <FormLabel>Request Body</FormLabel>
                            <Textarea
                                placeholder={`{
    "key": "value"
}`}
                                _placeholder={{color: 'gray.500'}}
                            />
                        </FormControl>

                        <FormControl id="headers">
                            <FormLabel>Request Headers</FormLabel>
                            <Textarea
                                placeholder={`{
    "HeaderName": "HeaderValue"
}`}
                                _placeholder={{color: 'gray.500'}}
                            />
                        </FormControl>

                        <Spacer/>

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
                                bg={'blue.400'}
                                color={'white'}
                                w="full"
                                type="submit"
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