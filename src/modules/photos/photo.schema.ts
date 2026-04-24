import * as yup from "yup";

export const updatePhotoVisibilitySchema = yup.object({
    body: yup.object({
        visibility: yup
            .mixed<"public" | "private">()
            .oneOf(["public", "private"])
            .required(),
    }),
});