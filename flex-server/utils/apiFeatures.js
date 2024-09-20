class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
        this.isAnd = true
        this.parsedQuery = {}

    }

    filter() {
        const queryObj = { ...this.queryString };

        console.log(queryObj);

        // Text search
        if (queryObj.textSearch) {
            this.query = this.query.find({ $text: { $search: queryObj.textSearch } });
            return this;
        }

        if (queryObj.isAnd === 'false') {
            this.isAnd = false;
        }

        const excludedFields = ['page', 'sort', 'limit', 'fields', 'isAnd', 'textSearch', 'regexText'];
        excludedFields.forEach(el => delete queryObj[el]);

        // Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt|eq|ne|in|regex|elemMatch)\b/g, match => `$${match}`); // => {gt: 5} -> {$gt:5}
        const queryArray = Object.entries(JSON.parse(queryStr)).map(([key, value]) => ({ [key]: value }));

        if (queryArray.length) {
            // $and/$or/$nor must be a nonempty array
            const filterArray = this.isAnd ? { $and: queryArray } : { $or: queryArray }
            this.parsedQuery = filterArray;
            this.query = this.query.find(filterArray);
        } else {
            // Parameter "filter" to find() must be an object
            this.parsedQuery = JSON.parse(queryStr);
            this.query = this.query.find(JSON.parse(queryStr));
        }

        return this;
    }

    // Sorting => req.query.sort=-name for descending and req.query.sort=name for ascending
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    // Field Limiting  => req.query.fields=name,price,quantity
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
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 50;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);

        return this;
    }

    listSearch(fieldId) {
        const queryObj = { ...this.queryString };

        if (queryObj.regexText) {
            let filters = {}
            filters[fieldId] = { $regex: queryObj.regexText, $options: 'i' }

            this.query = this.query.find(filters);
        }
        return this;
    }

    populate(popOptions) {
        if (popOptions)
            this.query = this.query.populate(popOptions);

        return this;
    }
}
module.exports = APIFeatures;