import {Button, Flex, FormControl, Heading, Input, Stack, Text, useColorModeValue,} from '@chakra-ui/react';
import Head from "next/head";
import Link from "next/link";

export default function ForgotPasswordForm() {
    return (
        <>
            <Head>
                <title>Tea Status - Password Reset</title>
                <meta property="og:title" content={'Tea Status - Password Reset'} key="title"/>
                <meta property="og:url" content={'https://statuspage.theteacup.dev/password-reset'}/>
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
                        Forgot your password?
                    </Heading>
                    <Text
                        fontSize={{base: 'sm', sm: 'md'}}
                        color={useColorModeValue('gray.800', 'gray.400')}>
                        You&apos;ll get an email with a reset link
                    </Text>
                    <FormControl id="email">
                        <Input
                            placeholder="your-email@example.com"
                            _placeholder={{color: 'gray.500'}}
                            type="email"
                        />
                    </FormControl>

                    <br/>

                    <Stack spacing={6}>
                        <Button
                            bg={'blue.400'}
                            color={'white'}
                            _hover={{
                                bg: 'blue.500',
                            }}>
                            Request Reset
                        </Button>

                        <Link href={'/'}>
                            <Button
                                bg={'blue.400'}
                                color={'white'}
                                _hover={{
                                    bg: 'blue.500',
                                }}>
                                Know your Password?
                            </Button>
                        </Link>

                    </Stack>
                </Stack>
            </Flex>
        </>
    );
}