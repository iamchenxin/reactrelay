/**
 * Created by iamchenxin on 1/15/16.
 */
import {database} from "./database.js";

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
} from 'graphql';

let bookQuery= new GraphQLObjectType({
    name:"book",
    fields:{
        id:{type:GraphQLInt},
        author:{type:GraphQLString},
        pages:{type:GraphQLInt}
    }
});

let userQuery =new GraphQLObjectType({
    name:"user",
    fields:{
        id:{ type:GraphQLInt},
        name:{type:GraphQLString},
        gender:{type:GraphQLString},
        book:{
            type:bookQuery,
            description:"details for book",
            args: {
                bookID:{type:GraphQLInt}
            },
            resolve:(user,{bookID},info) => {
                console.log("==========================");
                console.log(user);
                console.log("***************************");
              //  console.log(info);
                return database.getBook(user.book);
            }
        }
    }
});

let userQuery2 =new GraphQLObjectType({
    name:"user",
    fields:{
        id:{ type:GraphQLInt},
        name:{type:GraphQLString},
        gender:{type:GraphQLString},
        book:{
            type:bookQuery,
            description:"details for book"
        }
    }

});

let rootQuery = new GraphQLObjectType({
    name:"root",
    fields:{
        user:{
            type:userQuery,
            args:{
                id:{
                    type:GraphQLInt
                }
            },
            resolve:(root, {id})=>database.getUser(id)
        }
    }
});

let rootMutation = new GraphQLObjectType({
    name:"Mutation",
    fields:{
        updateUser:{
            type:GraphQLString,
            args:{
                id:{
                    type:GraphQLInt
                },
                name:{
                    type:GraphQLString
                }
            },
            resolve:(parent,{id,name})=>{
                return database.updateUser(id,name);
            }
        }
    }
});

export var schema=new GraphQLSchema({
    query: rootQuery,
    mutation: rootMutation
});