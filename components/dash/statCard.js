import {Box, Flex, Stat, StatLabel, StatNumber, useColorModeValue,} from '@chakra-ui/react';

export default function StatsCard(props) {
    const {title, stat, icon} = props;
    return (
        <Stat
            css={{}}
            size={'sm'}
            px={{base: 2, md: 4}}
            py={'4'}
            shadow={'xl'}
            border={'1px solid'}
            borderColor={useColorModeValue('gray.800', 'gray.500')}
            rounded={'lg'}>
            <Flex justifyContent={'space-between'}>
                <Box pl={{base: 2, md: 4}}>
                    <StatLabel fontSize={'2xl'} fontWeight={'medium'}>
                        {title}
                    </StatLabel>
                    <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
                        {stat}
                    </StatNumber>
                </Box>
                <Box
                    my={'auto'}
                    color={useColorModeValue('gray.800', 'gray.200')}
                    alignContent={'center'}>
                    {icon}
                </Box>
            </Flex>
        </Stat>
    );
}
