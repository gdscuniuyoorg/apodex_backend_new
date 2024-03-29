"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync = (cb) => {
    return (req, res, next) => cb(req, res, next).catch((error) => next(error));
};
exports.default = catchAsync;
