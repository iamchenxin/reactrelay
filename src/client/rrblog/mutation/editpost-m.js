/**
 * Created by iamchenxin on 1/26/16.
 */
import React from 'react';
import Relay from 'react-relay';

class EditPostMutation extends Relay.Mutation{
  getMutation(){
    return Relay.QL`mutation{editPost}`;
  }

  getVariables(){
    console.dir(this.props);
    let {po,newpost}=this.props;
    return {
      user:newpost.user,
      content:newpost.content,
      id:po.id
    };
  }

  getConfigs(){
    return [{
      type:'FIELDS_CHANGE',
      fieldIDs:{
        post:this.props.po.id
      }
    }];
  }

  getFatQuery(){
    return Relay.QL`
    fragment on EditPostPayload{
      post{
        user
        content
      }
    }`;
  }
// relay will check po is passed in as a params name!
  static fragments= {
    po:()=>Relay.QL`
    fragment on Post{
      id
    }`
  };
}

export {
  EditPostMutation
}