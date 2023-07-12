import { Request, Response, NextFunction } from "express";
import * as UserService from "../services/user.service";

export const create = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		let data = await UserService.userSignup(req.body);
		res.status(data?.code).send(data?.info);
	} catch (error) {
		console.error("Error while Creating User", error);
		next(error);
	}
};

export const login = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		let data = await UserService.userLogin(req.body);
		res.status(data?.code).send(data?.info);
	} catch (error) {
		console.error("Error while Creating User", error);
		next(error);
	}
};

export const getById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		let data = await UserService.getUserById(req.params.id);
		res.status(data?.code).send(data?.info);
	} catch (error) {
		console.error("Error while Fetching Users", error);
		next(error);
	}
};

export const deleteById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		let data = await UserService.deleteUserById(req.params.id);
		res.status(data?.code).send(data?.info);
	} catch (error) {
		console.error("Error while Fetching Users", error);
		next(error);
	}
};

export const updateUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const result = await UserService.updateUser(req.body);
		res.status(result.code).json(result.info);
	} catch (error) {
		console.error("Error while updating election", error);
		next(error);
	}
};

export const verifyUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const result = await UserService.verifyUser(req.params.token);
		res.status(result.code).json(result.info);
	} catch (error) {
		console.error("Error while updating election", error);
		next(error);
	}
};

export const paginatedUsers = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const result = await UserService.getPaginatedUser(
			Number(req.query.page),
			Number(req.query.count)
		);
		res.status(result.code).json(result.info);
	} catch (error) {
		console.error("Error while updating election", error);
		next(error);
	}
};
