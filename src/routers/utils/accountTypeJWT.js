require("dotenv").config();
const jwt = require("jsonwebtoken");
module.exports =
    /**
     * 
     * @param {import("express").Request} req 
     * @param {import("express").Response} res 
     * @param {import("express").NextFunction} next 
     */
    (req, res, next) => {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: 'Authentication failed: Missing JWT token' });
        }
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRIT);
            req.user = {
                token: token,
                id: decodedToken.id,
                type: decodedToken.accountType,
                username: decodedToken.username
            }
            next();
        } catch (err) {
            return res.status(401).json({ message: 'Authentication failed: Invalid JWT token' });
        }
    }
