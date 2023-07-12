import bcrypt, { compare } from "bcryptjs";
import jwt from "jsonwebtoken";

export const createToken = (userId: string) => {
	const accessToken = jwt.sign({ userId }, String(process.env.JWT_SECRET), {
		expiresIn: "1d",
	});
	return accessToken;
};

export const comparePassword = (userPassword: string, dbPassword: string) => {
	return bcrypt.compare(userPassword, dbPassword);
};

export const createRefreshToken = (userId: String) => {
	const refreshToken = jwt.sign(
		{ userId },
		String(process.env.JWT_REFRESH_SECRET),
		{ expiresIn: "7d" }
	);
	return refreshToken;
};

export const hashPassword = async (password: string) => {
	const salt = await bcrypt.genSalt(10);
	password = await bcrypt.hash(password, salt);
	return password;
};

export const hashPasswordAdmin = async (password: string) => {
	const salt = await bcrypt.genSalt(10);
	let new_password = await bcrypt.hash(password, salt);
	return new_password;
};

export const verifyEmailToken = async (token: string) => {
	const decoded: any =  jwt.verify(token, String(process.env.JWT_EMAIL_CONFIRMATION_SECRET));
	if(decoded){
		return decoded
	}
	return null
};

export const createVerificationToken = async (id:string, email: string) => {
	let token = jwt.sign(
		{ id, email },
		String(process.env.JWT_EMAIL_CONFIRMATION_SECRET),
		{ expiresIn: "1d" }
	);
	return String(token);
};
