import pack from "../../package.json";

export default function handler(req, res) {
    res.status(200).json({
        error: false,
        message: "OK",
        version: pack.version
    })
}
