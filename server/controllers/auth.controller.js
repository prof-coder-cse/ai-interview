// frontend se data layenge
// user create karayenge
// token create karayenge aur cookie me store kra denge and uski id ban jayegi

import gentoken from "../config/token.js";
import User from "../models/user.model.js";

export const googleAuth = async (req, res) => {
  try {
    const { name, email } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
      });
    }

    let token = await gentoken(user._id);
    res.cookie("token", token, {
  http: true,          // ❌ WRONG
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `google auth error` });
  }
};

export const logOut = async (req, res) => {
  try {
    await res.clearCookie("token");
    return res.status(200).json({ message: "Logout success" });
  } catch (error) {
    return res.status(500).json({ message: `log out error` });
  }
};
