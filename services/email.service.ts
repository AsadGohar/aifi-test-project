import nodemailer from "nodemailer";

const mailTransporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.NODEMAILER_EMAIL,
		pass: process.env.NODEMAILER_PASSWORD,
	},
});

const signupVerificationEmailDetails = (
	name: string,
	email: string,
	link: string
) => {
	return {
		from: '"Aifi 👻" <gandalfthegrey9t@gmail.com>',
		to: email,
		subject: "Verify Your Email",
		text: `Hi ${name} , To activate your user account, please verify your email address by clicking ${link} `,
	};
};

export const sendMail = async (
	email: string,
	name: string = "",
	link: string = ""
) => {
	let mailData = signupVerificationEmailDetails(name, email, link);

	mailTransporter.sendMail(mailData, function (err, data) {
		if (err) {
			console.log("Error Occurs", err);
		} else {
			console.log("Email sent successfully");
		}
	});
};
