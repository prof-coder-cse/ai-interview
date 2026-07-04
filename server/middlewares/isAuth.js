// token me se user ki ID find karni hai jo logged in hai

import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    let { token } = req.cookies;
    if (!token) {
      return res.status(400).json({ message: "user does not have token" });
    }

    // agar token milta hai to verify karna ahai jwt se

    const verifyToken = jwt.verify(token, process.env.JWT_SECRETKEY);
    if (!verifyToken) {
      return res
        .status(400)
        .json({ message: "user does not have valid token" });
    }
    req.userId = verifyToken.userId;
    next();
  } catch (error) {
    return res.status(500).json({ message: "is auth errro" });
  }
};

export default isAuth;
