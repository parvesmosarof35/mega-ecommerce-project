import httpStatus from "http-status";
import { TErrorSources, TGenericErrorResponse } from "../interface/error";

const handelDuplicateError = (err: any): TGenericErrorResponse => {
    const match = err.message.match(/"([^"]*)"/);
    const extractedMessage = match ? match[1] : null;

    // Attempt to find the specific field that is causing the duplicate entry error
    let path = "";
    if (err.keyPattern) {
        path = Object.keys(err.keyPattern)[0];
    } else if (err.keyValue) {
        path = Object.keys(err.keyValue)[0];
    }

    const errorSources: TErrorSources = [
        {
            path: path,
            message: extractedMessage ? `${extractedMessage} is already in use` : "Duplicate entry",
        },
    ];

    const statusCode = Number(httpStatus.BAD_REQUEST);
    return {
        statusCode,
        message: extractedMessage ? `The value '${extractedMessage}' for ${path} already exists.` : "Duplicate Key Error",
        errorSources,
    };
};

export default handelDuplicateError;
