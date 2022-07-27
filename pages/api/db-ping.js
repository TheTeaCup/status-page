import Redis from "../../utils/redis"

export default async function dbPing(req, res) {
    try {
        let Test = await Redis.info();
        if (Test) {
            return res.json({error: false, message: "OK"})
        } else {
            return res.json({error: true, message: "Database Error Occurred"})
        }
    } catch (e) {
        console.log(e)
        return res.json({error: true, message: "Database Error Occurred"})
    }
}