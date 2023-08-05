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
export const signUpTokenSchema = Yup.object({
    token: Yup.mixed().required("Please enter token recieved on above email")
});

const githubProfileRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/([A-Za-z0-9_-]+)/;

export const profileSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    profession: Yup.string().required('Profession is required'),
    bio: Yup.string().required('Bio is required'),
    country: Yup.string().required('Country is required'),
    githubProfile: Yup.string().matches(githubProfileRegex, "Invalid GitHub URL"),
    organization: Yup.string().required('Organization is required'),
    profilePhoto: Yup.mixed().required('Please upload a file').test(
        'File size is too large',
        (value) => {
            // console.log(value,"yup");
            return (value && value[0].size <= 5000000)
        } // 5MB
    )
});