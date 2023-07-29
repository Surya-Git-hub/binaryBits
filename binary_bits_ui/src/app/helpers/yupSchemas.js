import * as Yup from "yup";

export const signUpSchema = Yup.object({
    name: Yup.string().min(2).max(25).required("Please enter your name"),
    email: Yup.string().email().matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Emails always have domain in the end").required("Please enter your email"),
    password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters long')
        .matches(/[a-z]/, 'Password must contain at least 1 lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least 1 special character'),
    confirm_password: Yup.string()
        .required('Confirm Password is required')
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
});

export const signInSchema = Yup.object({
    email: Yup.string().email().matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Emails always have domain in the end").required("Please enter your email"),
    password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters long')
        .matches(/[a-z]/, 'Password must contain at least 1 lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least 1 special character'),
});

export const signUpEmailSchema = Yup.object({
    email: Yup.string().email().matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Emails always have domain in the end").required("Please enter your email")
});
