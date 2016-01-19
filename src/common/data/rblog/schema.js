/**
 * Created by iamchenxin on 1/18/16.
 */
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
import {database} from './database.js';

let postQuery = new GraphQLObjectType({
    name:'Post',
    fields:{
        id:{type:GraphQLInt},
        user:{type:GraphQLString},
        content:{type:GraphQLString}
    }
});

let postsQuery = new GraphQLObjectType({
    name:'Posts',
    fields:()=>({
        page:{
            type:new GraphQLList(postQuery),
            args:{
                num:{
                    type:GraphQLInt
                }
            },
            resolve:(parent,{num})=>database.getPosts(num)
        }
    })
});

let postsMutation = new GraphQLObjectType({
    name:"newPost",
    fields:{
        newpost:{
            type:GraphQLInt,
            args:{
                user:{
                    type:GraphQLString
                },
                content:{
                    type:GraphQLString
                }
            },
            resolve:(parent,{user,content})=>{
                return database.newPost(user,content);
            }
        }
    }
});

export var schema=new GraphQLSchema({
    query:postsQuery,
    mutation:postsMutation
});