/**
 * Created by iamchenxin on 1/20/16.
 */
import {database,Pet,Pigc,Dog,Catc} from "./database.js";

import {
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLInterfaceType
} from 'graphql';

var Petit = new GraphQLInterfaceType({
    name:'Pet',
    fields:{
        id:{
            type:GraphQLInt
        },
        name:{
            type:GraphQLString
        }
    },
    resolveType:resolved_obj=>{
        console.dir( resolved_obj.constructor.name);
        let jstype= resolved_obj.constructor.name;
        switch (jstype){
            case 'Catc':
                return catType;
            case 'Dog':
                return dogType;
            case 'Pigc':
                return pigType
        }
    }
});

var dogType = new GraphQLObjectType({
    name:'Dog',
    fields:{
        id:{type:GraphQLInt},
        name:{type:GraphQLString},
        action:{type:GraphQLString}
    },
    interfaces:[Petit]
});

var catType = new GraphQLObjectType({
    name:'Cat',
    fields:{
        id:{type:GraphQLInt},
        name:{type:GraphQLString},
        action:{type:GraphQLString},
        food:{type:GraphQLString},
    },
    interfaces:[Petit]
});

var pigType = new GraphQLObjectType({
    name:'Pigc',
    fields:{
        id:{type:GraphQLInt},
        name:{type:GraphQLString},
        action:{type:GraphQLString},
        food:{type:GraphQLString},
    }
});

var PetsQuery = new GraphQLObjectType({
    name:'Pets',
    fields:{
        list:{
            type:Petit,
            args:{
                id:{type:GraphQLInt}
            },
            resolve:(_this,{id})=>database.getPet(id)
        },
        all:{
            type:new GraphQLList(Petit),
            resolve:(_this)=>{
                return database.getAll();
            }
        }
    }
});

export var schema = new GraphQLSchema({
    query:PetsQuery
});