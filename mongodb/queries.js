
const mongoose = require('mongoose');
const Ingredient = require('./models/Ingredients');
const ingredients = require('../content/ingredients');
const Coctail = require('./models/Coctails');

const addIngredients = async () => {
    try {
        ingredients.forEach(async (ingredient) => {
            const doc = new Ingredient(ingredient);
            const res = await doc.save();
        });
    } catch(err) {
        console.error(err);
    }
}

const getIngredients = async () => {
    try {
        let collection = mongoose.connection.db.collection('Ingredients');
        let data = await collection.find({}).toArray();

        return data;
    } catch (err) {}
}

const getCoctails = async () => {
    try {
        let collection = mongoose.connection.db.collection('Coctails');
        let data = await collection.find({}).toArray();

        return data;
    } catch (err) {}
}

const findCoctail = async (name) => {
    try {
        const coctail = await Coctail.find({ 'name': name});
    } catch(err) {
        console.error(err);
    }
}

const findCoctailByInredient = async (ingredientId) => {
    try {
        const ingredient = await Ingredient.findOne({ '_id': ingredientId});
        const coctails = await ingredient.findCoctails();
        return coctails;
    } catch(err) {
        console.error(err);
    }
}


module.exports = {
    getIngredients,
    getCoctails,
    addIngredients,
    findCoctail,
    findCoctailByInredient
}