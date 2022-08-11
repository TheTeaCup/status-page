import {
    Box,
    Flex, Spinner,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import Link from "next/link";
import {useEffect, useRef, useState} from "react";
import * as api from "../../utils/api";

export default function Monitor(props) {
    const { data, auth } = props;
    const [monitor, setMonitor] = useState(data || null)
    const [status, setStatus] = useState('awaiting');
    const [loading, setLoading] = useState(true);
    const interval = useRef(null);

    const fetch = async() => {
        let res = await api.getMonitor(`${data.id || '1'}`, auth);
        console.log(res);
        if(res.error) {
            setLoading(true);
            console.log(res.message);
        }
        if(res.message === "OK") {
            setMonitor(res.monitor)
        }
    }

    useEffect(() => {

        fetch().then(() => {
            interval.current = setInterval(() => fetch(), 30000);
        });

        return () => {
            interval.current && clearInterval(interval.current);
        };
    }, []);

    return (
        <Link href={'/app/monitors/' + monitor?.id || ''}>
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
                            {monitor?.name || 'Loading...'}
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