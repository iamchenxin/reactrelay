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

import {
    connectionArgs,
    connectionDefinitions,
    connectionFromArray,
    fromGlobalId,
    globalIdField,
    mutationWithClientMutationId,
    nodeDefinitions,
} from 'graphql-relay';

import {database} from './database.js';

function getDataByGlobalId(globalId){
    let {type,id}=fromGlobalId(globalId);
    switch (type){
        case "Post":
            return database.getPost(id);
        default:
            return null;
    }
}

function fromServerTypeToGraphType(resolved_obj){
    return postQuery;
}

var {nodeFields,nodeInterface} = nodeDefinitions(
    getDataByGlobalId,
    resolved_obj=>fromServerTypeToGraphType(resolved_obj)
);

let postQuery = new GraphQLObjectType({
    name:'Post',
    fields:{
        id:globalIdField('Post'),
        user:{type:GraphQLString},
        content:{type:GraphQLString}
    },
    interfaces:[nodeInterface]
});

var postConnectionDef = connectionDefinitions( {name: 'Post', nodeType:postQuery});

let rootQuery = new GraphQLObjectType({
    name:'root',
    fields:()=>({
        posts:{
            type:postConnectionDef.connectionType,
            args:connectionArgs,
            resolve:(_this,args)=> connectionFromArray(database.getAll(), args)
        }
    })
});

var NewPost = mutationWithClientMutationId({
   name:"NewPost",
    inputFields:{
        user:{type:new GraphQLNonNull(GraphQLString)},
        content:{type:new GraphQLNonNull(GraphQLString)}
    },
    outputFields:{
        post:{
            type:postQuery,
            resolve:(payload)=>database.getPost(payload.postid)
        }
    },
    mutateAndGetPayload:({user,content})=>{
        let postid = database.newPost(user,content);
        return {
            postid:postid
        };
    }
});

var mutationType = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        newPost:NewPost
    }
});


export var schema=new GraphQLSchema({
    query:rootQuery,
    mutation:mutationType
});