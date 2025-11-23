import bcrypt from "bcryptjs"

const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10)
}
// bcrypt.compare(plainText, hashed)
const compassPassword = async (password: string, loginPassword: string) => {
    return await bcrypt.compare(password, loginPassword);
}

export {
    hashPassword,
    compassPassword
}