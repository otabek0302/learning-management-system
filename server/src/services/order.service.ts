import sendMail from "../utils/sendMail";
import ErrorHandler from "../utils/ErrorHandler";

export const sendOrderSuccessEmail = async (data: any, email: string) => {
    try {
        if (email) {
            sendMail({
                email,
                subject: "Order Success",
                template: "order-success.ejs",
                data
            })
        }
    } catch (error: any) {
        return new ErrorHandler(error.message, 500);
    }
}