import mongoose, { Schema } from "mongoose";
import { IUser } from "../ts/interfaces/user.interface";
import {
	createToken,
	createRefreshToken,
	comparePassword,
	hashPassword,
	createVerificationToken,
} from "../utils/auth";

const userSchema: Schema<IUser> = new Schema(
	{
		first_name: {
			type: String,
			maxlength: [100, "First name should not exceed 100 bytes."],
			trim: true,
			required: true,
		},
		last_name: {
			type: String,
			maxlength: [100, "Last name should not exceed 100 bytes."],
			trim: true,
			required: true,
		},
		email: {
			type: String,
			maxlength: [100, "Email should not exceed 100 bytes."],
			trim: true,
			required: true,
		},
		password: {
			type: String,
			maxlength: [80, "Password should not exceed 80 bytes."],
			trim: true,
			required: true,
		},
		is_verified: { type: Boolean, required: true, default: false },
	},
	{
		timestamps: true,
	}
);

userSchema.pre<IUser>("save", async function (next) {
	if (this.isModified("password")) {
		this.password = await hashPassword(this.password);
	}
	next();
});

userSchema.methods.comparePassword = async function (password: string) {
	return comparePassword(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
	let token = createToken(this._id);
	return token;
};

userSchema.methods.generateRefreshToken = function () {
	return createRefreshToken(this._id);
};

userSchema.methods.generateVerificationToken = async function () {
	return await createVerificationToken(this._id, this.email);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
