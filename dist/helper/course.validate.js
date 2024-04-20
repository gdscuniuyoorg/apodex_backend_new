"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateCourse = exports.validateCreateCourse = void 0;
const zod_1 = require("zod");
const commonSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    category: zod_1.z.string().min(1),
    objectives: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    instructor: zod_1.z.string().min(1),
    videos: zod_1.z.array(zod_1.z.string().min(1)),
    materials: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.validateCreateCourse = commonSchema.extend({});
exports.validateUpdateCourse = commonSchema.partial();
