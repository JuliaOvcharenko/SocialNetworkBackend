import { object, string, number, array } from "yup";

export const createPostSchema = object({
    title:     string().required(),
    content:   string().required(),
    topic:     string().optional(),
    tags:      array(string().required()).optional().default([]),
    imageUrls: array(string().required()).optional().default([]),
    links:     array(object({ url: string().required() })).optional().default([]),
});

export const updatePostSchema = createPostSchema.shape({
    title:   string().optional(),
    content: string().optional(),
});