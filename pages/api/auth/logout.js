import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../../utils/sessionSettings";

export default withIronSessionApiRoute(logoutRoute, sessionOptions);

async function logoutRoute(req, res) {
    req.session.destroy();
    res.json({user: null});
}