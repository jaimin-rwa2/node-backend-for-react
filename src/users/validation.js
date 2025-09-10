const validate = (username, email, password, msg = {}) => {
    let result = true
    [result, msg] = validateUsername(username, msg, result)
    [result, msg] = validateEmail(email, msg, result)
    [result, msg] = validatePassword(password, msg, result)
    return [result, msg]
}

const validateUsername = (username, msg = {}, result = true) => {
    msg.username = [];
    if (!username) {
        result = false;
        msg.username.push("Username is required.");
        return [result, msg]
    }

    if (/^\d/.test(username)) {
        result = false;
        msg.username.push("Username cannot start with a digit.");
    }
    if (/\.\./.test(username)) {
        result = false;
        msg.username.push("Username cannot contain consecutive dots.");
    }
    if (!/^[a-zA-Z0-9._]+$/.test(username)) {
        result = false;
        msg.username.push("Username can only contain letters, numbers, dots, and underscores.");
    }
    return [result, msg]
}

const validateEmail = (email, msg = {}, result = true) => {
    msg.email = [];

    if (!email) {
        result = false;
        msg.email.push("Email is required.");
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
        result = false;
        msg.email.push("Email format is invalid.");
    }

    return [result, msg];
}

const validatePassword = (password, msg = {}, result = true) => {
    msg.password = [];

    if (!password) {
        result = false;
        msg.password.push("Password is required.");
        return [result, msg];
    }
    if (!/(?=.*[a-z])/.test(password)) {
        result = false;
        msg.password.push("Password must contain at least one lowercase letter.");
    }
    if (!/(?=.*[A-Z])/.test(password)) {
        result = false;
        msg.password.push("Password must contain at least one uppercase letter.");
    }
    if (!/(?=.*\d)/.test(password)) {
        result = false;
        msg.password.push("Password must contain at least one digit.");
    }
    if (!/(?=.*[\W_])/.test(password)) {
        result = false;
        msg.password.push("Password must contain at least one special character.");
    }
    if (password.length < 8) {
        result = false;
        msg.password.push("Password must be at least 8 characters long.");
    }
    return [result, msg];
}

module.exports = { validate, validateUsername, validatePassword, validateEmail }