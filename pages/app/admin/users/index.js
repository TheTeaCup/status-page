import Head from "next/head";
import {withIronSessionSsr} from "iron-session/next";
import {sessionOptions} from "../../../../utils/sessionSettings";
import csrf from "../../../../utils/csrf";
import AdminNavbar from "../../../../components/admin-nav";
import {
    Badge,
    Button,
    Center,
    chakra,
    Skeleton,
    Table,
    TableContainer,
    Tbody,
    Td,
    Tfoot,
    Th,
    Thead,
    Tr,
    useToast,
} from '@chakra-ui/react'
import {AddIcon, EditIcon} from "@chakra-ui/icons";
import {useEffect, useState} from "react";
import fetchJson from "../../../../utils/fetchJson";
import {v4 as uuidv4} from 'uuid';
import {useRouter} from "next/router";
import Link from "next/link";

export default function App_Admin_Home({user}) {
    const [users, setUsers] = useState([]);
    const toast = useToast();
    const router = useRouter();

    useEffect(() => {
        (async () => {
            let fetchAllUsers = await fetchJson('/api/admin/users', {
                headers: {
                    'Authorization': user.token || null,
                },
            });

            if (fetchAllUsers.error) {
                toast({
                    title: 'API Error',
                    description: `${fetchAllUsers.message || 'Unknown Error'}`,
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                })
            } else {
                if (fetchAllUsers.users) {
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
    }, [user.token])

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
                    onClick={() => router.push('/app/admin/users/new')}
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
                                <Th>Last Seen</Th>
                                <Th>Edit</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {users.length === 0 ? (
                                <>
                                    <SkeletonRow width="75px"/>
                                    <SkeletonRow width="125px"/>
                                    <SkeletonRow width="50px"/>
                                    <SkeletonRow width="100px"/>
                                    <SkeletonRow width="75px"/>
                                </>
                            ) : (
                                <>
                                    {users && users.map(user => {
                                        let lastSeen = user?.lastSeen;
                                        if (lastSeen) {
                                            const rawDate = new Date(lastSeen)
                                            lastSeen = new Intl.DateTimeFormat("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "2-digit",
                                            }).format(rawDate);
                                        }
                                        return (
                                            <Tr key={uuidv4()}>
                                                <Td>{user?.username || "Loading"}</Td>
                                                <Td>{user?.staff &&
                                                    <Badge colorScheme='green'>Staff</Badge>} {user?.admin &&
                                                    <Badge colorScheme='purple'>Admin</Badge>}</Td>
                                                <Td>{lastSeen || "N/A"}</Td>
                                                <Td>
                                                    <Link href={'/app/admin/users/' + user.id}>
                                                        <Button>
                                                            <EditIcon/>
                                                        </Button>
                                                    </Link>
                                                </Td>
                                            </Tr>
                                        )
                                    })}
                                </>
                            )}
                        </Tbody>
                        <Tfoot>
                            <Tr>
                                <Th>Name</Th>
                                <Th>Permissions</Th>
                                <Th>Last Seen</Th>
                                <Th>Edit</Th>
                            </Tr>
                        </Tfoot>
                    </Table>
                </TableContainer>
            </Center>
        </>
    )
}


const SkeletonRow = ({width}) => (
    <Tr key={uuidv4()}>
        <Td>
            <Skeleton height="10px" w={width} my={4}/>
        </Td>
        <Td>
            <Skeleton height="10px" w={width} my={4}/>
        </Td>
        <Td>
            <Skeleton height="10px" w={width} my={4}/>
        </Td>
        <Td>
            <Skeleton height="10px" w={width} my={4}/>
        </Td>
    </Tr>
)

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