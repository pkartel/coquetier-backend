const mongoose = require('mongoose');

const coctailsSchema  = new mongoose.Schema({
    name: String,
    ingredients: Array,
    recipe: Array,
    tips: Array,
    equipment: Array,
}, { 
    collection : 'Coctails'
});

const Coctail = mongoose.model('Coctails', coctailsSchema);

module.exports = Coctail;