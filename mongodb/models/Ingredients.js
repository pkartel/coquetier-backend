const mongoose = require('mongoose');

const ingredientsSchema = new mongoose.Schema({
    name: String,
    type: String,
    flavour: String,
    sugar: Boolean,
    coctails: Array,
}, { 
    collection : 'Ingredients',
    methods: {
        findCoctails() {
            return mongoose.model('Coctails').find({ "ingredients.name": this.name }).lean();
        }
    }
});

const Ingredient = mongoose.model('Ingredient', ingredientsSchema);

module.exports = Ingredient;