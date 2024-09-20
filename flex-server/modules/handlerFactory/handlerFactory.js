const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const APIFeatures = require('../../utils/apiFeatures');


exports.deleteOne = Model =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);

        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }

        res.status(204).json({
            isSuccess: true,
            document: null
        });
    });

exports.updateOne = Model =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            __user: req.user ? "Flex User" : "System Generate or Unknown"
        });

        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }

        res.status(200).json({
            isSuccess: true,
            document: doc

        });
    });

exports.createOne = Model =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.create(req.body);

        res.status(201).json({
            isSuccess: true,
            document: doc
        });
    });

exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
        isSuccess: true,
        document: doc
    });
});

exports.getAll = (Model, popOptions) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.find().populate(popOptions);

        // SEND RESPONSE
        res.status(200).json({
            isSuccess: true,
            results: doc.length,
            documents: doc
        });
    });

exports.getCount = Model => catchAsync(async (req, res, next) => {

    // To allow for nested GET reviews on tour (hack)
    const totalCount = await Model.countDocuments();
    // SEND RESPONSE
    res.status(200).json({
        isSuccess: true,
        status: "success",
        totalCount: totalCount
    });
});

exports.getList = Model => catchAsync(async (req, res, next) => {

    const queryObj = { ...req.query };
    let fields = "id name";

    if (queryObj.fields) {
        fields = queryObj.fields.split(',').join(' ');
    }

    // To allow for nested GET reviews on tour (hack)
    const documents = await Model.find().select(fields);
    // SEND RESPONSE
    res.status(200).json({
        isSuccess: true,
        status: "success",
        documents: documents
    });
});

exports.findAll = (Model, popOptions) => catchAsync(async (req, res, next) => {
    let totalCount = 0;
    // To allow for nested GET reviews on tour (hack)

    const features = new APIFeatures(Model.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate()
        .populate(popOptions)

    const docs = await features.query.lean();


    if (req.query.textSearch) {
        totalCount = await Model.find({ $text: { $search: req.query.textSearch } }).countDocuments();
    } else {
        totalCount = await Model.find(features.parsedQuery).countDocuments();
    }

    // SEND RESPONSE
    res.status(200).json({
        isSuccess: true,
        status: "success",
        totalCount: totalCount,
        documents: docs
    });
});

exports.listSearch = (Model) => catchAsync(async (req, res, next) => {
    let totalCount = 0;
    let fieldId = req.params.fieldId || "name";

    const features = new APIFeatures(Model.find(), req.query)
        .filter()
        .listSearch(fieldId)
        .sort()
        .limitFields()
        .paginate();

    const docs = await features.query.lean();

    if (req.query.regexText) {
        let filters = {}
        filters[fieldId] = { $regex: req.query.regexText, $options: 'i' }
        totalCount = await Model.find(filters).countDocuments();
    } else {
        totalCount = await Model.find(features.parsedQuery).countDocuments();
    }

    // SEND RESPONSE
    res.status(200).json({
        isSuccess: true,
        status: "success",
        totalCount: totalCount,
        documents: docs
    });
});
