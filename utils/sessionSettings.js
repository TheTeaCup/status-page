// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
export const sessionOptions = {
    password: '!p67Z4owW%b@L&95984918684984894erfgergsfsdfsdfd*hWjk!VrMNCp%',
    cookieName: "statuspage-login",
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production'
    },
};