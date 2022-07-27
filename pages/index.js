import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Link,
    Stack,
    Text,
    useColorModeValue, useToast,
} from '@chakra-ui/react';
import {useState} from "react";

export default function Home({installed}) {
    const toast = useToast();

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [loading, setLoading] = useState(false);

    const login = async event => {
        event.preventDefault();
        setLoading(true);
        if(!email) {
            setLoading(false);
            toast({
                title: 'Form Error',
                description: "You did not enter a valid email",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        } else if(!password) {
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
        }
    }

    return (
        <>
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
                            </Stack>
                        </Stack>
                    </Box>
                </Stack>
            </Flex>
        </>
    )
}

export async function getStaticProps() {
    // Using the variables below in the browser will return `undefined`. Next.js doesn't
    // expose environment variables unless they start with `NEXT_PUBLIC_`

    return {
        props: {
            installed: process.env.INSTALLED || null
        }
    }
}