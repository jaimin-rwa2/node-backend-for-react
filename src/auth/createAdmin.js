const { USER_ROLES } = require("../users/const");
const User = require("../users/model");

const createAdmin = async () => {
    try {

        const adminCount = await User.countDocuments({ role: 'admin' });

        if (adminCount > 0) {
            const adminUser = prompt("Enter admin username:");
        }
        const username = prompt("Enter admin username:");
        const password = prompt("Enter admin password:");
        const email = prompt("Enter admin email:");

        // const [result, msg] = validate(username, email, password)
        // if (!result) return res.json({ msg: msg }
        if (!username || !password || !email) {
            console.error("All fields are required.");
            return;
        }
        await User.create({ username, password, email, roles: USER_ROLES.ADMIN });
        return res.status(201).json({ msg: "User Registered." })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: "Internal Server Error",
            error: error
        })
    }
}

createAdmin();