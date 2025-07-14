function Validation(email, password) {
    let error = {}


    email= email.trim()
    if (email === "") {
        error.email = "Email should not be empty"
    } else if (email.length < 3) {
        error.email = "Email must be at least 3 characters"
    } else if (email.length < 10) {
        error.email = "Email cannot exceed 10 characters"
    } else if (!email_pattern.test(email)) {
        error.email = "Please enter a valid Email (Letters, numbers, _)"
    } else {
        error.email = ""
    }

    if (password === "") {
        error.password = "Name should not be empty"
    } else if (password.length < 8) {
        error.password = "Password must be at least 8 characters"
    } else if (password.length < 50) {
        error.password = "Password cannot exceed 50 characters"
    } else if (!password_pattern.test(email)) {
        error.email = "Please enter a valid Email (Letters, numbers, _)"
    } else {
        error.password = ""
    }

    return error;
}

export default Validation