const mongoose = require('mongoose');

const restore = (data, model) => {
    data.forEach(async (dataItem) => {
        try {
            const searchResult = await model.findOneAndUpdate({ 'name': dataItem.name }, dataItem ).lean();
            if (!searchResult) {
                const doc = await new model(dataItem);
                doc.save();
            }
        } catch(err) {
            console.error(err);
        }
    });
};

module.exports = restore;

