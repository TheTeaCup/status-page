import {
    Box,
    Flex,
    Stat,
    StatLabel,
    StatNumber, Text,
    useColorModeValue,
} from '@chakra-ui/react';
import Link from "next/link";

export default function Monitor(props) {
    const { data } = props;
    return (
        <Link href={'/app/monitors/' + data?.id || ''}>
            <Box
                w={'50%'}
                px={{ base: 2, md: 4 }}
                py={'4'}
                shadow={'xl'}
                border={'1px solid'}
                borderColor={useColorModeValue('gray.800', 'gray.500')}
                rounded={'lg'}>
                <Flex justifyContent={'space-between'}>
                    <Box pl={{ base: 2, md: 4 }}>
                        <Text fontSize={'2xl'} fontWeight={'medium'} isTruncated>
                            {data?.name || 'Loading...'}
                        </Text>
                    </Box>
                    <Box
                        my={'auto'}
                        color={useColorModeValue('gray.800', 'gray.200')}
                        alignContent={'center'}>
                        <Box
                            as="div"
                            h="24px"
                            w="24px"
                            position="relative"
                            bgColor={'gray.400'}
                            borderRadius="50%"
                        />
                    </Box>
                </Flex>
            </Box>
        </Link>
    );
}