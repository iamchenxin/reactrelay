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

var postsType =new GraphQLObjectType({
    name:'Posts',
    fields:{
        postList:{
            type:postConnectionDef.connectionType,
            args:connectionArgs,
            resolve:(_this,args)=> {
                let v = connectionFromArray(database.getAll(), args);
                console.dir(v);
                return v;
            }
        },
        id:globalIdField('Posts'),
        k:{
           type:GraphQLString
        }
    },
    interfaces:[nodeInterface]
});

let rootQuery = new GraphQLObjectType({
    name:'root',
    fields:()=>({
        posts:{
            type:postsType,
            args:{
                k:{
                    name:"k",
                    type:GraphQLString
                }
            },
            resolve:(_this,args)=>{return {k:args.k,id:0}}
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
        },
        posts:{
            type:postsType,
            resolve:(payload)=>({"id":0})
        }
    },
    mutateAndGetPayload:({user,content})=>{
        let postid = database.newPost(user,content);
        return {
            postid:postid
        };
    }
});

var EditPost = mutationWithClientMutationId({
   name:'EditPost',
    inputFields:{
        user:{type:new GraphQLNonNull(GraphQLString)},
        content:{type:new GraphQLNonNull(GraphQLString)},
        id:{type:new GraphQLNonNull(GraphQLID)},
    },
    outputFields:{
        post:{
            type:postQuery,
            resolve:(payload)=>payload
        }
    },
    mutateAndGetPayload:({user,content,id})=>{
        let v = database.editPost(fromGlobalId(id).id,user,content);
        return v;
    }
});

var mutationType = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        newPost:NewPost,
        editPost:EditPost
    }
});


export var schema=new GraphQLSchema({
    query:rootQuery,
    mutation:mutationType
});