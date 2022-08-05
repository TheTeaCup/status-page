import Head from "next/head";
import {withIronSessionSsr} from "iron-session/next";
import {sessionOptions} from "../../../utils/sessionSettings";
import csrf from "../../../utils/csrf";
import AdminNavbar from "../../../components/admin-nav";
import {
    Box,
    Button,
    Center,
    chakra, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer,
    Table,
    TableContainer,
    Tbody,
    Td,
    Tfoot,
    Th,
    Thead,
    Tr, useDisclosure,
    useToast,
} from '@chakra-ui/react'
import {AddIcon, EditIcon} from "@chakra-ui/icons";
import {useEffect, useState} from "react";
import fetchJson from "../../../utils/fetchJson";
import {v4 as uuidv4} from 'uuid';

export default function App_Admin_Home({user}) {
    const [users, setUsers] = useState([]);
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        (async () => {
            let fetchAllUsers = await fetchJson('/api/admin/users', {
                headers: {
                    'Authorization': user.token || null,
                },
            });
            if(fetchAllUsers.error) {
                toast({
                    title: 'API Error',
                    description: `${fetchAllUsers.message || 'Unknown Error'}`,
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                })
            } else {
                if(fetchAllUsers.users) {
                    setUsers(fetchAllUsers.users)
                } else {
                    toast({
                        title: 'API Error',
                        description: "No users were detected...",
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                    })
                }
            }
        })()
    }, [])

    return (
        <>
            <Head>
                <title>Tea Status - Administration Panel</title>
                <meta property="og:title" content={'Tea Status - Administration Panel'} key="title"/>
                <meta property="og:url" content={'https://statuspage.theteacup.dev'}/>
                <meta property="og:description" content={'Custom built status page by Tea Cup'}/>
                <meta name="description" content={'Custom built status page by Tea Cup'}/>
            </Head>

            <AdminNavbar user={user}/>

            <br/>

            <chakra.h1
                textAlign={'center'}
                fontSize={'4xl'}
                py={.5}
                fontWeight={'bold'}>
                All Users
            </chakra.h1>

            <Center>

                <Button
                    variant={'solid'}
                    colorScheme={'teal'}
                    size={'sm'}
                    mr={4}
                    onClick={onOpen}
                    display={{base: 'none', md: 'flex'}}
                    leftIcon={<AddIcon/>}>
                    New User
                </Button>
            </Center>

            <br/>

            <Center>
                <TableContainer width={'90%'} centerContent>
                    <Table variant='simple'>
                        <Thead>
                            <Tr>
                                <Th>Name</Th>
                                <Th>Permissions</Th>
                                <Th>Edit</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {users && users.map(user => {
                                return (
                                    <Tr key={uuidv4()}>
                                        <Td>Testing User</Td>
                                        <Td>test</Td>
                                        <Td><Button>
                                            <EditIcon/>
                                        </Button></Td>
                                    </Tr>
                                )
                            })}
                        </Tbody>
                        <Tfoot>
                            <Tr>
                                <Th>Name</Th>
                                <Th>Permissions</Th>
                                <Th>Edit</Th>
                            </Tr>
                        </Tfoot>
                    </Table>
                </TableContainer>
            </Center>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Sit nulla est ex deserunt exercitation anim occaecat. Nostrud ullamco deserunt aute id consequat veniam incididunt duis in sint irure nisi. Mollit officia cillum Lorem ullamco minim nostrud elit officia tempor esse quis.
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button variant='ghost'>Secondary Action</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

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
        if (!user.admin) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            }
        }
        return {
            props: {user: req.session.user, csrfToken: req.csrfToken()}
        };
    }
}, sessionOptions)