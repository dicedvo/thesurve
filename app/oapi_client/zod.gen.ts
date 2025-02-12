// This file is auto-generated by @hey-api/openapi-ts

import { z } from 'zod';

export const zXMetadata = z.object({
    total_count: z.number().int().optional(),
    filter_count: z.number().int().optional()
});

export const zItemsThesurveReports = z.object({
    id: z.number().int().optional(),
    status: z.string().optional(),
    date_created: z.union([
        z.string(),
        z.null()
    ]).optional(),
    date_updated: z.union([
        z.string(),
        z.null()
    ]).optional(),
    reporter_name: z.union([
        z.string(),
        z.null()
    ]).optional(),
    reporter_email: z.union([
        z.string(),
        z.null()
    ]).optional(),
    reported_posting: z.union([
        z.string().uuid(),
        z.object({
            id: z.string().uuid(),
            date_created: z.union([
                z.string(),
                z.null()
            ]).optional(),
            date_updated: z.union([
                z.string(),
                z.null()
            ]).optional(),
            submitter: z.union([
                z.string(),
                z.null()
            ]).optional(),
            course: z.string(),
            survey_link: z.string(),
            school: z.string(),
            submitter_email: z.union([
                z.string(),
                z.null()
            ]).optional(),
            survey_title: z.union([
                z.string(),
                z.null()
            ]).optional(),
            estimated_time: z.union([
                z.string(),
                z.null()
            ]).optional(),
            description: z.union([
                z.string(),
                z.null()
            ]).optional()
        }),
        z.null()
    ]).optional(),
    report_description: z.union([
        z.string(),
        z.null()
    ]).optional()
});

export const zItemsThesurvePostings = z.object({
    id: z.string().uuid(),
    date_created: z.union([
        z.string(),
        z.null()
    ]).optional(),
    date_updated: z.union([
        z.string(),
        z.null()
    ]).optional(),
    submitter: z.union([
        z.string(),
        z.null()
    ]).optional(),
    course: z.string(),
    survey_link: z.string(),
    school: z.string(),
    submitter_email: z.union([
        z.string(),
        z.null()
    ]).optional(),
    survey_title: z.union([
        z.string(),
        z.null()
    ]).optional(),
    estimated_time: z.union([
        z.string(),
        z.null()
    ]).optional(),
    description: z.union([
        z.string(),
        z.null()
    ]).optional()
});

export const zCreateItemsThesurveReportsResponse = z.object({
    data: z.unknown().optional()
});

export const zReadItemsThesurvePostingsResponse = z.object({
    data: z.array(zItemsThesurvePostings).optional(),
    meta: zXMetadata.optional()
});

export const zCreateItemsThesurvePostingsResponse = z.object({
    data: z.unknown().optional()
});

export const zReadSingleItemsThesurvePostingsResponse = z.object({
    data: zItemsThesurvePostings.optional()
});