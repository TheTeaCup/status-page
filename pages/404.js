import Head from "next/head";
import { Box, Button, Container, Heading, Stack, Text, useBreakpointValue } from '@chakra-ui/react'
import { useRouter } from 'next/router'

export default function FourOhFour() {
    const router = useRouter()

    return (
        <>
            <Head>
                <title>Tea Status - 404</title>
                <meta property="og:title" content={'Tea Status - 404'} key="title"/>
                <meta property="og:url" content={'https://statuspage.theteacup.dev'}/>
                <meta property="og:description" content={'The page you are looking for could not be found.'}/>
                <meta name="description" content={'The page you are looking for could not be found.'}/>
            </Head>

            <Box as="section" bg="bg-surface">
                <Container py={{ base: '16', md: '24' }}>
                    <Stack spacing={{ base: '8', md: '10' }}>
                        <Stack spacing={{ base: '4', md: '5' }} align="center">
                            <Heading size={useBreakpointValue({ base: 'sm', md: 'md' })}>404</Heading>
                            <Text color="muted" maxW="2xl" textAlign="center" fontSize="xl">
                                Oops! The page you tried to view does not exist
                            </Text>
                        </Stack>
                        <Stack spacing="3" direction={{ base: 'column', sm: 'row' }} justify="center">
                            <Button colorScheme='messenger' size="lg" onClick={() => router.back()}>
                                Go Back
                            </Button>
                        </Stack>
                    </Stack>
                </Container>
            </Box>

        </>
    )
}