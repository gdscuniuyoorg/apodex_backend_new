import { z } from 'zod';

const commonSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  objectives: z.string().min(1),
  description: z.string().min(1),
  instructor: z.string().min(1),
  videos: z.array(z.string().min(1)),
  materials: z.array(z.string()).optional(),
});

export const validateCreateCourse = commonSchema.extend({});

export const validateUpdateCourse = commonSchema.partial();
