import Redis from "../../../utils/redis";

export default async function handler(req, res) {
    // send setup status and user creation status
    try {

        let Setup = await Redis.get('status-page-settings');
        let userCreationEnabled = false;
        let setup = false;

        if (Setup) {
            Setup = JSON.parse(Setup);
            setup = true;
            userCreationEnabled = Setup?.userCreationEnabled || false
        }

        return res.json({
            error: false, message: "OK", data: {
                setup: setup,
                userCreationEnabled: userCreationEnabled
            }
        })

    } catch (e) {
        console.log(e)
        return res.json({error: true, message: "Database Error Occurred"})
    }
}
