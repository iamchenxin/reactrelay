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
    GraphQLInputObjectType,
} from 'graphql';

import {
    connectionArgs,
    connectionDefinitions,
    connectionFromArray,
    fromGlobalId,
    globalIdField,
    mutationWithClientMutationId,
    nodeDefinitions,
  offsetToCursor,
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

var testsType = new GraphQLObjectType({
   name:'Tests',
   fields:{
       postList:{
           type:postConnectionDef.connectionType,
           args:connectionArgs,
           resolve:(_this,args) => {
               let id = fromGlobalId(this.id);
               let testsData = connectionFromArray(database.getCachePostsByID(id),args);
               return testsData;
           }
       },
       id:globalIdField('Tests')
   } ,
   interfaces:[nodeInterface]
});

var testsInput = new GraphQLInputObjectType({
   name:'TestsInput',
   fields:{
       userList:{
            type:new GraphQLList(GraphQLString),
            },
       dumb:{
            type:GraphQLInt,
          }
   } 
});

let rootQuery = new GraphQLObjectType({
    name:'root',
    fields:()=>({
        posts:{
            type:postsType,
            args:{
                k:{
                    name:"k",
                    type:testsInput
                }
            },
            resolve:(_this,args)=>{
                console.dir(args);
                return {k:"hehe",id:0};
                }
        },
        tests:{
            type:testsType,
            args:{
                testsIn:{
                    type:testsInput
                }
            },
            resolve:(_this,args) => {
                var cacheID = database.cachePostsByUsers(args.testsIn.userList);
                console.log(args);
                return {
                    id:globalIdField(cacheID)
                };
            }
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
        postEdge:{
            type:postConnectionDef.edgeType,
            resolve:(payload)=> {
                return({
                    cursor:offsetToCursor(payload.postid),
                    node:database.getPost(payload.postid)
                });
            }
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