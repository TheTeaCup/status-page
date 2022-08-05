import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../../utils/sessionSettings";

export default withIronSessionApiRoute(loginRoute, sessionOptions);

async function loginRoute(req, res) {
    if (req.session.user) {
        // in a real world application you might read the user id from the session and then do a database request
        // to get more information on the user if needed
        res.json({
            user: req.session.user,
        });
    } else {
        res.json({
            user: null
        });
    }
}