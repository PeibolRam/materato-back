const jwt = require('jsonwebtoken');

const { User } = require('./../models/user')
const secret = process.env.SECRET;

let auth = (req, res, next) => {

    let headerToken = req.headers['authorization'];

    if(!headerToken) {
        res.json({ 
            isAuth: false,
            error: true,
            message: "Missing Token",
            isMissingToken: true
         });
        return;
    }

    const token = headerToken.replace('Bearer ', '');

    jwt.verify(token, secret, async (error, user) => {
        if(error) {
            res.json({ 
                isAuth: false,
                error: true,
                message: "Invalid token", 
                isInvalidToken: true 
            });
        } else {
            User.findByToken(token, (err, user)=> {
                if(err ) {
                    res.json({ 
                        isAuth: false,
                        error: true,
                        message: "Invalid token",
                        isInvalidToken: true
                     });
                } else {
                    req.user = user;
                    req.token = token;
                    next();
                }
            });
        }
    });

    // User.findByToken(headerToken, (err, user)=> { 
    //     if(err) throw err
    //     if(!user) return res.json({
    //         isAuth: false,
    //         error: true
    //     })
    //     req.headerToken = headerToken;
    //     req.user = user;
    //     next()
    // })

}





module.exports = { auth }