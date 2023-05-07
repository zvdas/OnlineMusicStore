const advancedResults = (model, populate) => async (req, res, next) => {
    let query;
    
    // copy req.query
    const reqQuery = { ...req.query };
    
    // fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    
    // loop over removeFields and remove them from reqQuery
    // removeFields.forEach(param => delete reqQuery[param]);
    removeFields.map(param => delete reqQuery[param]);
    
    // create query string
    let queryStr = JSON.stringify(req.query);
    
    // create query operators ($gt, $gte, etc...)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    // finding resource
    query = model.find(JSON.parse(queryStr));
    
    // populate
    if(populate) {
        query.populate(populate);
    }
    
    // select fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }
    
    // sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        // default sort by createdAt field if no sort specified
        query = query.sort('-createdAt');
    }
    
    // pagination
    // parse the page number from query (which is a string) to a number of base 10
    // if no page number is specified, set default as 1
    const page = parseInt(req.query.page, 10) || 1;
    // if no limit is specified, set default as 1 resource per page
    const limit = parseInt(req.query.limit, 10) || 1;
    // skip some resources (start index from)
    const startIndex = (page - 1) * limit;
    // end index at
    const endIndex = page * limit;
    // total resources
    const total = await model.countDocuments();
    
    query = query.skip(startIndex).limit(limit);
    
    // executing query
    const results = await query;
    
    // pagination result
    const pagination = {};
    
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1
        }
    }
    
    pagination.curr = {
        page
    }
    
    if (endIndex < total) {
        pagination.next = {
            page: page + 1
        }
    }
    
    res.advancedResults = {
        success: true, 
        count: results.length, 
        pagination,
        total,
        limit,
        data: results
    }
    
    next();
}

module.exports = advancedResults;