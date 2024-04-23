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
  'dateOfBirth',
  'location',
  'techInterests',
  'currentRole',
  'company',
  'twitterUrl',
  'portfolioUrl',
  'linkedInUrl',
  'firstName',
  'image',
  'lastName',
  'displayPhoto',
];
