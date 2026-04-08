const MongoSingleton = require("../data/mongoDb_singleton");
const ObjectID = require("mongodb").ObjectId;

function saveAll(quotes){
    return new Promise(async (resolve, reject) => {
        const collection = await MongoSingleton.getCollection();
        const result = await collection.insertMany(quotes);
        if(result.insertedCount){
            resolve(result);
        }else{
            reject("coudn`t save quotes");
        }
    });
}

function getAll(){
    return new Promise(async (resolve, reject) => {
        const collection = await MongoSingleton.getCollection();
        const cursor = await collection.find();
        const result = await cursor.toArray();
        if(result.length > 0){
            resolve(result);
        }else{
            reject("Can`t get all quotes");
        }
    });
}

function getById(id){
    return new Promise(async (resolve, reject) => {
         const collection = await MongoSingleton.getCollection();
         const result = await collection.findOne({_id: new ObjectID(id)});
        if(result){
            resolve(result);
        }else{
            reject("Can`t get quote by id " + id);
        }
    });
}

function deleteByID(id){
    return new Promise(async(resolve, reject) => {
        const collection = await MongoSingleton.getCollection();
        const result = await collection.deleteMany({_id: new ObjectID(id)});

        if(result && result.deletedCount > 0){
            resolve(result);
        }else{
            reject("can`t delete quote by id " + id);
        }
    });
}

function updateById(id, updateFields){
    return new Promise(async (resolve, reject) => {
        const collection = await MongoSingleton.getCollection();
        const result = await collection.updateOne({
            _id: new ObjectID(id)
        },
    {
        $set: updateFields
    });
    if(result && result.matchedCount > 0){
        resolve(result);
    }else{
        reject("can`t update result by id " + id)
    }
    });
}

function insertOne(quote) {
    return new Promise(async (resolve, reject) => {
        const collection = await MongoSingleton.getCollection();
        const result =  await collection.insertOne(quote);
        if(result && result.insertedId){
            resolve(result);
        }else{
            reject("Can`t insert quote");
        }
    });
}
module.exports = {
    getAll, getById, saveAll, deleteByID, updateById, insertOne
}