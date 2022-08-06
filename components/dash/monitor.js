import {
    Box,
    Flex, Spinner,
    Stat,
    StatLabel,
    StatNumber, Text,
    useColorModeValue,
} from '@chakra-ui/react';
import Link from "next/link";
import {useState} from "react";

export default function Monitor(props) {
    const { data } = props;
    const [status, setStatus] = useState('awaiting');
    const [loading, setLoading] = useState(true);

    const fetch = async() => {

    }

    return (
        <Link href={'/app/monitors/' + data?.id || ''}>
            <Box
                w={'50%'}
                px={{ base: 2, md: 4 }}
                py={'4'}
                shadow={'xl'}
                marginBottom={'10px'}
                border={'1px solid'}
                borderColor={useColorModeValue('gray.800', 'gray.500')}
                rounded={'lg'}>
                <Flex justifyContent={'space-between'}>
                    <Box pl={{ base: 2, md: 4 }}>
                        <Text fontSize={'2xl'} fontWeight={'medium'}>
                            {data?.name || 'Loading...'}
                        </Text>
                    </Box>
                    <Box
                        my={'auto'}
                        color={useColorModeValue('gray.800', 'gray.200')}
                        alignContent={'center'}>

                        {loading ? <Spinner as="div"
                                            h="24px"
                                            w="24px"
                                            position="relative"
                                            borderRadius="50%" /> : <></>}

                    </Box>
                </Flex>
            </Box>
        </Link>
    );
}