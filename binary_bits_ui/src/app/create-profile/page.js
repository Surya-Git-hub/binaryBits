"use client"

import React from 'react'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/app/helpers/supa"
import { profileSchema } from "@/app/helpers/yupSchemas"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form";



const imageMimeType = /image\/(png|jpg|jpeg)/i;

export default function CreateProfile() {
    const router = useRouter();
    const [file, setFile] = useState(null);
    const [fileDataURL, setFileDataURL] = useState(null);

    const handleClick = async (fdata) => {
        try {
            const filename = `${uuidv4()}-${file.name}`;
            // console.log("storing the image", fdata);
            const { data, error } = await supabase.storage
                .from("ProfilePics")
                .upload(filename, file, {
                    cacheControl: "3600",
                    upsert: false,
                });
            // console.log(data, "supa");
            const imgData = await supabase
                .storage
                .from("ProfilePics")
                .getPublicUrl(data.path)

            fdata.profilePhoto = imgData.data.publicUrl;

            const api = axios.create({
                baseURL: 'http://localhost:5000',
                withCredentials: true,
            });
            const res = await api.post('http://localhost:5000/api/user/profile', fdata)

            if (res.status == 201) {
                router.push('/')
            } else {
                router.push('/create-profile');
                console.log("Something went wrong");
            }

        } catch (error) {
            console.error('Error:', error);
        }
    }

    const changeHandler = (e) => {
        const file = e.target.files[0];
        if (!file.type.match(imageMimeType)) {
            alert("Image mime type is not valid");
            return;
        }
        setFile(file);
    }

    useEffect(() => {
        let fileReader, isCancel = false;
        if (file) {
            fileReader = new FileReader();
            fileReader.onload = (e) => {
                const { result } = e.target;
                if (result && !isCancel) {
                    setFileDataURL(result)
                }
            }
            fileReader.readAsDataURL(file);
        }
        return () => {
            isCancel = true;
            if (fileReader && fileReader.readyState === 1) {
                fileReader.abort();
            }
        }

    }, [file]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(profileSchema),
    })

    const onSubmit = (data) => {
        handleClick(data);
    }

    return (
        <div className="mx-auto w-full max-w-7xl bg-slate-100 py-2">
            <div className="mx-auto my-4 max-w-2xl md:my-6">
                <div className="overflow-hidden rounded-xl bg-white p-4 shadow">
                    <h3 className="text-lg font-bold font-large text-gray-900 text-center lg:px-8">Provide Personal Info</h3>
                    <div className="flex flex-row items-center space-x-2 m-5 justify-center">
                        {fileDataURL ?
                            <img
                                className="inline-block h-28 w-28 rounded-full"
                                src={fileDataURL}
                                alt="Dan_Abromov"
                            /> : <img
                                className="inline-block h-28 w-28 rounded-full"
                                src="https://overreacted.io/static/profile-pic-c715447ce38098828758e525a1128b87.jpg"
                                alt="Dan_Abromov"
                            />}

                    </div>
                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mt-6 gap-6 space-y-4 md:grid md:space-y-0">
                            <div className="w-full">
                                <label
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    htmlFor="name"
                                >
                                    Name
                                </label>
                                <input
                                    className="flex h-10 w-full rounded-md border border-black/30 bg-transparent px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                    type="name"
                                    placeholder="Enter your Name"
                                    id="name"
                                    {...register("name")}
                                >

                                </input>
                                <p className="text-red-600 ">{errors.name?.message}</p>

                            </div>
                            <div className="w-full">
                                <label
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    htmlFor="profession"
                                >
                                    Profession
                                </label>
                                <input
                                    className="flex h-10 w-full rounded-md border border-black/30 bg-transparent px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                    type="profession"
                                    placeholder="Enter your profession"
                                    id="profession"
                                    {...register("profession")}
                                ></input>
                                <p className="text-red-600 ">{errors.profession?.message}</p>
                            </div>
                            <div className="col-span-2 grid">
                                <div className="w-full">
                                    <label
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        htmlFor="bio"
                                    >
                                        Bio
                                    </label>
                                    <textarea
                                        className="flex h-40 w-full rounded-md border border-black/30 bg-transparent px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                        type="text"
                                        placeholder="Tell us about yourself"
                                        id="bio"
                                        {...register("bio")}
                                    ></textarea>
                                    <p className="text-red-600 ">{errors.bio?.message}</p>
                                </div>
                            </div>
                            <div className="w-full">
                                <label
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    htmlFor="Country"
                                >
                                    Country
                                </label>
                                <input
                                    className="flex h-10 w-full rounded-md border border-black/30 bg-transparent px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                    type="text"
                                    placeholder="Enter your Country"
                                    id="Country"
                                    {...register("country")}
                                ></input>
                                <p className="text-red-600 ">{errors.country?.message}</p>
                            </div>
                            <div className="w-full">
                                <label
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    htmlFor="githubProfile"
                                >
                                    Github Profile
                                </label>
                                <input
                                    className="flex h-10 w-full rounded-md border border-black/30 bg-transparent px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                    type="text"
                                    placeholder="Enter your Github Profile"
                                    id="githubProfile"
                                    {...register("githubProfile")}
                                ></input>
                                <p className="text-red-600 ">{errors.githubProfile?.message}</p>
                            </div>
                            <div className='col-span-2 grid'>
                                <div className="w-full">
                                    <label
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        htmlFor="Organization"
                                    >
                                        Organization
                                    </label>
                                    <input
                                        className="flex h-10 w-full rounded-md border border-black/30 bg-transparent px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                        type="text"
                                        placeholder="Enter your Organization"
                                        id="Organization"
                                        {...register("organization")}
                                    ></input>
                                    <p className="text-red-600 ">{errors.organization?.message}</p>
                                </div>
                            </div>
                            <div className='col-span-2 grid'>
                                <div className="w-full">
                                    <label
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        htmlFor="file"
                                    >
                                        Upload Profile Picture
                                    </label>
                                    <div className="flex items-center justify-center w-full">
                                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload profile pic</span> or drag and drop profile pic</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                            </div>
                                            <input id="dropzone-file" type="file" accept="image/*" className="hidden" {...register("profilePhoto", { onChange: changeHandler })} />
                                        </label>
                                    </div>
                                    <p className="text-red-600 ">{errors.file?.message}</p>
                                </div>
                            </div>
                            <div className="col-span-2 grid">
                                <button
                                    type="submit"
                                    className="w-full rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
