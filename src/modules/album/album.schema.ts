import * as yup from "yup";

export const createAlbumSchema = yup.object({
    name:       yup.string().required("Name is required"),
    tag:        yup.string().nullable().optional(),
    year:       yup.number().integer().nullable().optional(),
    visibility: yup.string().oneOf(["public", "private"]).required("Visibility is required"),
});

export const updateAlbumSchema = yup.object({
    name: yup.string().optional(),
    tag:  yup.string().nullable().optional(),
    year: yup.number().integer().nullable().optional(),
});

export const updateAlbumVisibilitySchema = yup.object({
    visibility: yup.string().oneOf(["public", "private"]).required("Visibility is required"),
});