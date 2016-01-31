/**
 * Created by iamchenxin on 1/28/16.
 */
import {
  GraphQLBoolean,
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
  cursorForObjectInConnection,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
  toGlobalId,
  offsetToCursor,
} from 'graphql-relay';

import {database} from './database';

var {nodeField,nodeInterface} = nodeDefinitions(
  // for root query to lookup any nodes object directly
  (clientId)=>{
    let {type,id}=fromGlobalId(clientId);
    switch (type){
      case 'Post':
        return database.getPostByID(id);
      case "Web":
        return database.getWebByID(id);
      default:
        return null;
    }
  },
  // for any type extens from node to resolve its jstype to qltype
  (resolvedObj)=>{
    let serverType=resolvedObj.constructor.name;
    switch (serverType){
      case "Post":
        return PostType;
      case "Web":
        return WebType;
      default:
        return PostType;
    }
  }

);

var CommentType = new GraphQLObjectType({
  name:'Comment',
  fields:()=>({
    id:globalIdField(),
    user:{type:GraphQLString},
    content:{type:GraphQLString},
    replyTo:{
      type:PostType,
      resolve:(commentServer)=>{
        return database.getPostByID(commentServer.replyTo);// in server replyTo just a id
      }
    }
  }),
  interfaces:[nodeInterface]
});

var {connectionType:CommentConnection,edgeType:CommentEdge} =
  connectionDefinitions({name:'Comment',nodeType:CommentType});


var PostType = new GraphQLObjectType({
  name:'Post',
  fields:{
    id:globalIdField(),
    user:{type:GraphQLString},
    content:{type:GraphQLString},
    comments:{
      type:CommentConnection,
      args:connectionArgs,
      resolve:(postServer,args)=>{
        // in server , post.comments just an id array
        let commentlist= database.getCommentsByIDs(postServer.comments);
        let rt = connectionFromArray(commentlist,args);
        return rt;
      }
    }
  },
  interfaces:[nodeInterface]
});

var {connectionType:PostConnection,edgeType:PostEdge} =
  connectionDefinitions({name:'Post',nodeType:PostType});

// There is something counter-intuitive in resolving
// the the serverType was resolved to GraphQLType, not in the type itself,
// but in its parent.
// that is to say In a GraphQLType ,your mission is resolving its children
// So ! the args! is always for its children!
// A GraphQLType ! Can Not Set What Args He want to receive!
// its because The Args! is for server to determinate return some GraphQLType data
var PostSearchType = new GraphQLObjectType({
  name:'PostSearch',
  fields:{
    postCount:{type:GraphQLInt},
    postConnection:{
      type:PostConnection,
      args:connectionArgs,
      resolve:(postSearch,args)=>{
        let postlist = database.getPostsByIDs(postSearch.postConnection);
        return  connectionFromArray(postlist,args);
      }
    }
  }
});

var WebType = new GraphQLObjectType({
  name:'Web',
  fields:{
    postSearch:{
      type:PostSearchType,
      args:{
        text:{type:GraphQLString}
      },
      resolve:(web,args)=>{
        let postlist=database.searchPost(args.text);
        let postSearchServer={
          postCount:0,
          postConnection:postlist
        };
        return postSearchServer;
      }
    },
    postAll:{
      type:PostConnection,
      args:connectionArgs,
      resolve:(web,args)=>{
        return  connectionFromArray(database.getAllPost(),args);
      }
    },
    id:globalIdField(),
  },
  interfaces:[nodeInterface],
});

var rootQuery = new GraphQLObjectType({
  name:'Query',
  fields:{
    web:{
      type:WebType,
      resolve:()=>{
        return {why:"0"};
      }
    },
    node:nodeField,
  },
});

//-----
var NewPostMutation = mutationWithClientMutationId({
  name:'NewPost',
  inputFields:{
    user:{type:new GraphQLNonNull(GraphQLString)},
    content:{type:new GraphQLNonNull(GraphQLString)}
  },
  outputFields:{
    postEdge:{
      type:PostEdge,
      resolve:(payload)=>{
        return ({
          cursor:offsetToCursor(payload.postid),
          node:database.getPostByID(payload.postid)
        })
      }
    },
    web:{
      type:WebType,
      resolve:(payload)=>(database.getWebByID(payload.webid))
    }
  },
  mutateAndGetPayload:(postin)=>{
    let postid = database.newPost(postin);
    let webid = database.getWebID();
    return {postid,webid};
  }
});

var rootMutation = new GraphQLObjectType({
  name:'Mutation',
  fields:{
    newPost:NewPostMutation
  }
});

export var schema = new GraphQLSchema({
  query:rootQuery,
  mutation:rootMutation,
});