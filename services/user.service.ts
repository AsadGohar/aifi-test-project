import { isValidObjectId } from "mongoose";
import User from "../models/user.model";
import { IUser, ILogin } from "../ts/interfaces/user.interface";
import * as EmailService from "./email.service";
import { verifyEmailToken } from "../utils/auth";

export const userLogin = async (data: ILogin) => {
	const { email, password } = data;
	const user = await User.findOne({ email });
	if (!user) {
		return {
			code: 404,
			info: {
				status: false,
				message: "User not found",
			},
		};
	}
	const isPasswordMatch = await user.comparePassword(password);
	if (!isPasswordMatch) {
		return {
			code: 404,
			info: { status: false, message: "invalid credentials" },
		};
	}
	const accessToken = user.generateAccessToken();
	const refreshToken = user.generateRefreshToken();
	return {
		code: 200,
		info: {
			status: true,
			message: "User found",
			user,
			accessToken,
			refreshToken,
		},
	};
};

export const userSignup = async (data: IUser) => {
	try {
		const { first_name, last_name, email, password } = data;
		const checkEmailUser = await User.findOne({ email });
		if (!checkEmailUser) {
			let user = await User.create({
				first_name,
				last_name,
				email,
				password,
			});
			if (user) {

				const accessToken = user.generateAccessToken();
				const refreshToken = user.generateRefreshToken();
				const verificationToken = await user.generateVerificationToken();
				const verificationLink = `www.somewebsite.com/verify/${verificationToken}`;
				EmailService.sendMail(user.email, user.first_name, verificationLink);

				return {
					code: 200,
					info: {
						status: true,
						user,
						accessToken,
						refreshToken,
						message: "Created new user",
					},
				};
			} else {
				return {
					code: 401,
					info: {
						status: false,
						message: "Failed to create new user",
					},
				};
			}
		} else {
			return {
				code: 409,
				info: {
					status: false,
					message: "Email already Registered",
				},
			};
		}
	} catch (error) {
		console.log(error, "in signup");
		if (error instanceof Error) {
			return {
				code: 500,
				info: {
					status: false,
					mesage: error.message,
				},
			};
		} else {
			return {
				code: 500,
				info: {
					status: false,
					mesage: error,
				},
			};
		}
	}
};

export const getUsers = async () => {
	try {
		let users = await User.find();
		if (users.length > 0) {
			return {
				code: 200,
				info: {
					status: true,
					data: users,
					message: "Found All Users",
				},
			};
		} else {
			return {
				code: 401,
				info: {
					status: false,
					message: "The requested collection does not exist or is empty.",
				},
			};
		}
	} catch (error) {
		if (error instanceof Error) {
			return {
				code: 500,
				info: {
					status: false,
					mesage: error.message,
				},
			};
		} else {
			return {
				code: 500,
				info: {
					status: false,
					mesage: error,
				},
			};
		}
	}
};

export const getUserById = async (id: string) => {
	try {
		if (!isValidObjectId(id))
			return {
				code: 400,
				info: {
					status: false,
					message: "Invalid Object Id",
				},
			};
		const user = await User.findById(id);
		if (user) {
			return {
				code: 200,
				info: {
					status: true,
					data: user,
					message: "Found user",
				},
			};
		} else {
			return {
				code: 401,
				info: {
					status: false,
					message: "User Not Found",
				},
			};
		}
	} catch (error) {
		if (error instanceof Error) {
			return {
				code: 500,
				info: {
					status: false,
					mesage: error.message,
				},
			};
		} else {
			return {
				code: 500,
				info: {
					status: false,
					mesage: error,
				},
			};
		}
	}
};

export const deleteUserById = async (id: string) => {
	try {
		if (!isValidObjectId(id))
			return {
				code: 400,
				info: {
					status: false,
					message: "Invalid Object Id",
				},
			};
		const user = await User.findByIdAndRemove(id);
		if (user) {
			return {
				code: 200,
				info: {
					status: true,
					data: user,
					message: "User Deleted",
				},
			};
		} else {
			return {
				code: 401,
				info: {
					status: false,
					message: "User Not Found",
				},
			};
		}
	} catch (error) {
		if (error instanceof Error) {
			return {
				code: 500,
				info: {
					status: false,
					mesage: error.message,
				},
			};
		} else {
			return {
				code: 500,
				info: {
					status: false,
					mesage: error,
				},
			};
		}
	}
};

export const updateUser = async (data: any) => {
	try {
		const { id, first_name, last_name, email, password } = data;
		const user = await User.findByIdAndUpdate(
			id,
			{
				first_name,
				last_name,
				email,
				password,
			},
			{ new: true }
		);
		if (!user) {
			return {
				code: 404,
				info: { status: false, message: "User not found" },
			};
		}
		return { code: 200, info: { user } };
	} catch (error) {
		return {
			code: 500,
			info: { status: false, mesage: "Failed to update User" },
		};
	}
};

export const verifyUser = async (token: string) => {
	try {
		let decoded = await verifyEmailToken(token);
		if (decoded) {
			const { id } = decoded;
			let user = await User.findById(id);
			if (user) {
				user.is_verified = true;
				await user.save();
				return {
					code: 200,
					info: {
						status: true,
						user,
						message: "user verified",
					},
				};
			} else {
				return {
					code: 404,
					info: {
						status: false,
						user,
						message: "user not found",
					},
				};
			}
		} else {
			return {
				code: 404,
				info: {
					status: false,
					message: "verification failed",
				},
			};
		}
	} catch (error) {
		return {
			code: 500,
			info: { status: false, mesage: "Failed to verify user" },
		};
	}
};

export const getPaginatedUser = async (page: number, count: number) => {
	try {
		const pageValue = page || 0;
		const countValue = count || 10;

		const users = await User.find({})
			.skip(pageValue * countValue)
			.limit(countValue);

		if (users.length > 0) {
			return {
				code: 200,
				info: {
					status: true,
					message: "users found",
					users,
				},
			};
		} else {
			return {
				code: 404,
				info: {
					status: false,
					message: "No Users",
				},
			};
		}
	} catch (err) {
		console.error(err);
		return {
			code: 500,
			info: {
				status: false,
				message: "Internal Server Error",
			},
		};
	}
};
