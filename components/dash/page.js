import {
    Box, Code,
    Flex, Text,
    useColorModeValue,
} from '@chakra-ui/react';
import Link from "next/link";
import {useState} from "react";

export default function Page(props) {
    const { data } = props;

    return (
        <Link href={'/app/pages/' + data?.id || ''}>
            <Box
                w={'20%'}

                py={'4'}
                shadow={'xl'}
                marginBottom={'10px'}
                border={'1px solid'}
                borderColor={useColorModeValue('gray.800', 'gray.500')}
                rounded={'lg'}>
                <Flex justifyContent={'center'}>
                        <Text fontSize={'2xl'} fontWeight={'medium'}>
                            {data?.name || 'Loading...'}
                        </Text>
                </Flex>
            </Box>
        </Link>
    );
}