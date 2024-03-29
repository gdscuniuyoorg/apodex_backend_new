"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keysToExtract = void 0;
const filterObj = (body, keysToKeep) => {
    const filteredObj = {};
    keysToKeep.forEach((key) => {
        if (body[key] !== undefined) {
            filteredObj[key] = body[key];
        }
    });
    return filteredObj;
};
exports.default = filterObj;
exports.keysToExtract = [
    'bio',
    'coverPhotoUrl',
    'dateOfBirth',
    'nationality',
    'techInterests',
    'currentRole',
    'company',
    'apodexImgUrl',
    'twitterUrl',
    'portfolioUrl',
    'linkedInUrl',
    'firstName',
    'image',
    'lastName',
];
