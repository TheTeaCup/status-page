// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
export const sessionOptions = {
    password: process.env.SESSION_PASS,
    cookieName: "statuspage-login",
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production'
    },
};