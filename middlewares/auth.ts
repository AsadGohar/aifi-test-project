import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import UserModel from "../models/user.model";
import { IUser } from "ts/interfaces/user.interface";

interface AuthenticatedRequest extends Request {
	user?: IUser | null;
}
export const auth = () => {
	return async (
		req: AuthenticatedRequest,
		res: Response,
		next: NextFunction
	) => {
		try {
			const token = req.headers.authorization?.split(" ")[1];
			if (!token) {
				return res
					.status(401)
					.json({ status: false, message: "Token not found" });
			}
			const decoded: any = jwt.verify(token, String(process.env.JWT_SECRET));
			req.user = await UserModel.findById(decoded.userId);
			if (!req.user) {
				return res
					.status(401)
					.json({ status: false, message: "User not found" });
			}
			next();
		} catch (error) {
			console.log(error, "err");
			return res
				.status(500)
				.json({ status: false, message: "Internal Server Error" });
		}
	};
};
