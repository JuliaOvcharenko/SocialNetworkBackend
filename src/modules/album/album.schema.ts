import * as yup from "yup";

export const createAlbumSchema = yup.object({
    name:    yup.string().required("Name is required"),
    theme:   yup.string().required("Theme is required"),
    year:    yup.number().integer().required("Year is required"),
    isShown: yup.boolean().required("isShown is required"),
});

export const updateAlbumSchema = yup.object({
    name:  yup.string().optional(),
    theme: yup.string().optional(),
    year:  yup.number().integer().optional(),
});