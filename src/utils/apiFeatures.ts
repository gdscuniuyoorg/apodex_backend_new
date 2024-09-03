import { Document, FilterQuery, Query } from 'mongoose';

export interface QueryString {
  [key: string]: string | undefined;
}

class APIFeatures<T extends Document> {
  query: Query<T[], T>;
  queryString: QueryString;

  constructor(query: Query<T[], T>, queryString: QueryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search']; // Add 'query' to excluded fields
    excludedFields.forEach((field) => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortStr = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortStr);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page || 1;
    const limit = this.queryString.limit || 20;
    const skip = (+page - 1) * +limit;
    this.query = this.query.skip(skip).limit(+limit);
    return this;
  }

  search() {
    if (this.queryString.search) {
      const searchQuery = this.queryString.search;
      const regex = new RegExp(searchQuery, 'i');
      this.query = this.query.or([
        { name: { $regex: regex } } as FilterQuery<T>,
        { 'instructor.name': { $regex: regex } },
      ]);
    }
    return this;
  }
}

export default APIFeatures;
