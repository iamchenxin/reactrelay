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
    GraphQLInterfaceType,
  GraphQLInputObjectType
} from 'graphql';
import {database} from './database.js';

let postInterface = new GraphQLInterfaceType({
    name:'PostI',
    fields:{
        id:{
            type:GraphQLInt,
            description: 'The id of the character.',
        },
    },
    resolveType:resolved_obj=>{
        return postQuery;
    }
});

let postQuery = new GraphQLObjectType({
    name:'Post',
    fields:{
        id:{type:GraphQLInt},
        user:{type:GraphQLString},
        content:{type:GraphQLString}
    },
    interfaces:[postInterface]
});

var TwoName = new GraphQLInputObjectType({
    name: 'TwoName',
    fields: {
        fst: { type: new GraphQLNonNull(GraphQLString) },
        snd: { type: new GraphQLNonNull(GraphQLString) }
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
        },
        full:{
            type:new GraphQLList(postQuery),
            args:{
                data:{
                    type:TwoName
                }
            },
            resolve:(parent,{data})=>{
                console.log(data);
                return database.getPosts(0);}
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