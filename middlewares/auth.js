const { getUser } = require("../service/auth");

function checkForAuthentication(req, res, next) {
    //const authorizationHeaderValue = req.headers["authorization"];
    const tokenCookie = req.cookies?.token;
    req.user = null;

    // if (!authorizationHeaderValue || !authorizationHeaderValue.startsWith("Bearer"))
    //     return next();

    if (!tokenCookie)
        return next();

    // const token = authorizationHeaderValue.split("Bearer ")[1];

    const token = tokenCookie;
    const user = getUser(token);


    req.user = user;
    return next();
}

// Admin, users
function restrictTo(roles = []) {
    return function (req, res, next) {
        if (!req.user) return res.redirect('/login');

        if (!roles.includes(req.user.role)) return res.end("unauthorized");

        return next();
    }
}


// async function restrictToLoggedinUsersOnly(req, res, next) {
//     // const userUid = req.cookies?.uid;
//     const userUid = req.headers["Authorization"];     // header based authentication

//     if (!userUid) return res.redirect('/login');

//     const token = userUid.split("Bearer ")[1]; // "Bearer [41kh34ibib43344]"
//     const user = getUser(token);
//    // const user = getUser(userUid);

//     if (!user) return res.redirect('/login');
    
//     req.user = user;
//     next();
// }

// async function checkAuth(req, res, next) {
//     const userUid = req.headers["authorization"];
//     const token = userUid?.split("Bearer ")[1];
//     const user = getUser(token);
//    // const userUid = req.cookies?.uid;

//    // const user = getUser(userUid);

//     req.user = user;
//     next();
// }

module.exports = {
    checkForAuthentication,
    restrictTo
}