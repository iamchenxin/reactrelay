/**
 * Created by iamchenxin on 1/15/16.
 */
import gHttp from 'express-graphql';
import express from 'express';

import webpack from 'webpack';
import path from 'path';
//import {mySchema} from '../common/data/schema.js';
import {schema} from '../common/data/schema.js';
var mySchema=schema;

function run(port){
    let server=express();

    server.use('/',express.static(path.resolve(__dirname,"../app")));
    server.use('/graphql',gHttp({
        schema:mySchema,
        graphiql:true,
        pretty:true
    }));
    server.listen(port,()=>{
        console.log(`listen at ${port}`);
    });
}

run(5000);