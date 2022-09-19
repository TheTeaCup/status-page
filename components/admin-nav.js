import {
    Avatar,
    Box,
    Button,
    Flex,
    HStack,
    IconButton,
    Link,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Stack,
    useColorMode,
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react';
import {CloseIcon, HamburgerIcon, MoonIcon, SunIcon} from '@chakra-ui/icons';
import NextLink from "next/link"

const Links = [
    {
        name: 'Dashboard',
        to: '/admin'
    },
    {
        name: 'Monitors',
        to: '/admin/monitors'
    },
    {
        name: 'Pages',
        to: '/admin/pages'
    },
    {
        name: 'Users',
        to: '/admin/users'
    },
];

const NavLink = ({children}) => (
    <NextLink href={'/app' + children.to || '#'} passHref>
        <Link
            px={2}
            py={1}
            rounded={'md'}
            _hover={{
                textDecoration: 'none',
                bg: useColorModeValue('gray.200', 'gray.700'),
            }}
        >
            {children.name || 'Loading'}
        </Link>
    </NextLink>
);

export default function AdminNavbar({user}) {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const {colorMode, toggleColorMode} = useColorMode();

    return (
        <>
            <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <IconButton
                        size={'md'}
                        icon={isOpen ? <CloseIcon/> : <HamburgerIcon/>}
                        aria-label={'Open Menu'}
                        display={{md: 'none'}}
                        onClick={isOpen ? onClose : onOpen}
                    />
                    <HStack spacing={8} alignItems={'center'}>
                        <Box>Admin Panel</Box>
                        <HStack
                            as={'nav'}
                            spacing={4}
                            display={{base: 'none', md: 'flex'}}>
                            {Links.map((link) => (
                                <NavLink key={link}>{link}</NavLink>
                            ))}
                        </HStack>
                    </HStack>
                    <Flex alignItems={'center'}>
                        <Stack direction={'row'} spacing={7}>
                            <Button onClick={toggleColorMode}>
                                {colorMode === 'light' ? <MoonIcon/> : <SunIcon/>}
                            </Button>

                            <Menu>
                                <MenuButton
                                    as={Button}
                                    rounded={'full'}
                                    variant={'link'}
                                    cursor={'pointer'}
                                    minW={0}>
                                    <Avatar
                                        size={'sm'}
                                        src={user?.avatar || '/assets/unknown.png'}
                                    />
                                </MenuButton>
                                <MenuList>
                                    <NextLink href={'/app/'} passHref>
                                        <MenuItem>Home</MenuItem>
                                    </NextLink>
                                    <NextLink href={'/app/settings'} passHref>
                                        <MenuItem>Settings</MenuItem>
                                    </NextLink>
                                    <MenuDivider/>
                                    <NextLink href={'/app/admin'} passHref>
                                        <MenuItem>Admin Home</MenuItem>
                                    </NextLink>
                                    <NextLink href={'/app/admin/settings'} passHref>
                                        <MenuItem>Admin Settings</MenuItem>
                                    </NextLink>
                                    <MenuDivider/>
                                    <NextLink href={'/app/logout'} passHref>
                                        <MenuItem>Logout</MenuItem>
                                    </NextLink>
                                </MenuList>
                            </Menu>
                        </Stack>
                    </Flex>
                </Flex>

                {isOpen ? (
                    <Box pb={4} display={{md: 'none'}}>
                        <Stack as={'nav'} spacing={4}>
                            {Links.map((link) => (
                                <NavLink key={link}>{link}</NavLink>
                            ))}
                        </Stack>
                    </Box>
                ) : null}
            </Box>
        </>
    );
}