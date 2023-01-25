require('dotenv').config();

const express = require('express');
const app = express();

// MONGODB 
const mongoose = require('mongoose');
const queries = require('./mongodb/queries');
const restore = require('./mongodb/restore-script');
const Ingredient = require('./mongodb/models/Ingredients');
const Coctail = require('./mongodb/models/Coctails');

const coctailsData = require('./content/coctails');
const ingredientsData = require('./content/ingredients');

// AIRTABLE
const Airtable = require('airtable');
const base = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID);

const cocktailsTable = base('Cocktails');
const ingredientsTable = base('Ingredients');

app.get('/ingredients', async (req, res) => {
    // const ingredients = await queries.getIngredients();

    try {
        const records = await ingredientsTable.select({sort: [{field: 'Type'}]}).all();
        const result = records.map( record => {
            const { fields, id } = record;
            return { name: fields.Name, type: fields.Type, id };
        })
        res.send(result);
    } catch(err) {
        console.error(err);
    }
});

app.get('/coctails', async (req, res) => {
    const ingredientsIds = req.query.ingredients?.split(',') || [];
    let coctails;

    if (ingredientsIds.length) {
        // coctails = await ingredients.reduce(async (acc, ingredient) => {
        //     const coctails = await queries.findCoctailByInredient(ingredient);
        //     return [...(await  acc), ...coctails];
        // }, []);

        try {
            const ingredientsRecords = await ingredientsTable.select().all();
            const ingredientsIdToNameMap = ingredientsRecords
                .reduce((acc, record) => ({
                    ...acc,
                    [record.id]: record.fields.Name
                }), {});

            const linkedCoctails = ingredientsRecords
                .filter(record => ingredientsIds.includes(record.id))
                .reduce((acc, record) => acc.concat(record.fields.Cocktails), []);
            const formula = linkedCoctails
                .reduce((acc, coctailId, ind) => `${acc}{id}="${coctailId}"${ind == linkedCoctails.length - 1 ? ')' : ', '}`,
                 'OR(');
                
            const cocktailsRecords = await cocktailsTable.select({
                fields: ['Name', 'Introduction', 'Ingredients', 'Recipe HTML', 'Suggested glassware'],
            }).all();

            const coctails = cocktailsRecords
                .filter(record => linkedCoctails.includes(record.id))
                .map(record => {
                    const { fields, id } = record;
                    fields.id = id;
                    fields.Ingredients = fields.Ingredients.map(id => ingredientsIdToNameMap[id]);
                    
                    return fields;
                })
                .map(record => {
                    return Object.keys(record).reduce((acc, key) => {
                        acc[key.toLowerCase()] = record[key];
                        return acc;
                    }, {})
                });
            
            res.send(coctails);
        } catch(err) {
            console.error(err);
        }
    } else {
        coctails = await queries.getCoctails();
    }

    res.send(coctails);
});

app.listen(3000, () => console.log('Listening on Port 3000'));

// mongoose.connect(process.env.DATABASE_URI, {
//     useUnifiedTopology: true,
//     useNewUrlParser: true
// },
//     () => { console.log('connected to database'); } 
// );

// const connection = mongoose.connection;

// connection.on('error', console.error.bind(console, 'connection error:'));
// connection.once('open', async function () {
    

//     restore(coctailsData, Coctail);
//     restore(ingredientsData, Ingredient);
// });
