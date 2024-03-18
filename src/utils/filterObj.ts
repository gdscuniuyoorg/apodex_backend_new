const filterObj = (body: any, keysToKeep: string[]) => {
  const filteredObj: any = {};

  keysToKeep.forEach((key) => {
    if (body[key] !== undefined) {
      filteredObj[key] = body[key];
    }
  });

  return filteredObj;
};

export default filterObj;

export const keysToExtract: string[] = [
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
