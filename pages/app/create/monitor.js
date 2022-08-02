import Navbar from "../../../components/nav";
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading, HStack, Input, Select,
    Spacer,
    Stack,
    useColorModeValue,
    useToast
} from "@chakra-ui/react";
import Head from "next/head";
import {withIronSessionSsr} from "iron-session/next";
import {sessionOptions} from "../../../utils/sessionSettings";
import csrf from "../../../utils/csrf";
import {useState} from "react";
import {useRouter} from "next/router";

export default function App_Create_Monitor({user}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const onClick = () => {
        toast({
            title: 'Form Error',
            description: "Not Done",
            status: 'error',
            duration: 9000,
            isClosable: true,
        })
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

                    {/*<FormControl id="name" isRequired>
                        <FormLabel>Monitor Type</FormLabel>
                    <Select isDisabled={false} placeholder='Select option'>
                        <option value='https'>HTTP(s)</option>
                    </Select>
                    </FormControl>*/}

                    <FormControl id="name" isRequired>
                        <FormLabel>Monitor Name</FormLabel>
                        <Input
                            placeholder="Name this monitor"
                            _placeholder={{ color: 'gray.500' }}
                            type="text"
                        />
                    </FormControl>

                    {/*<Stack spacing={4}>
                        <HStack>
                            <Box>
                                <FormControl id="name" isRequired>
                                    <FormLabel>Monitor Name</FormLabel>
                                    <Input
                                        placeholder="Name this monitor"
                                        _placeholder={{ color: 'gray.500' }}
                                        type="text"
                                    />
                                </FormControl>
                            </Box>
                        </HStack>
                    </Stack>*/}



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