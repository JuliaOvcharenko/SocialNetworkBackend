import * as yup from "yup";

export const loginSchema = yup.object({
    email: yup
        .string()
        .email("Email must be correct. Please, enter the right version")
        .required("field is required"),
    password: yup
        .string()
        .min(8, "Minimal lenght is 8 symbols. Please, enter the right one.")
        .max(250)
        .required("field is required"),
});

export const registerSchema = yup.object({
    email: yup
        .string()
        .email("Email must be correct. Please, enter the right version")
        .required("field is required"),
    password: yup
        .string()
        .min(8, "Minimal lenght is 8 symbols. Please, enter the right one.")
        .max(250)
        .required("field is required"),
});
