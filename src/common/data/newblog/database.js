/**
 * Created by iamchenxin on 1/28/16.
 */


class NodeQL{
  constructor(rhs){
    this.id=rhs.id;
  }
}

class Comment extends NodeQL{
  constructor(rhs){
    super(NodeQL);
    this.user=rhs.user;
    this.content=rhs.content;
    this.replyTo=rhs.replyTo;
  }
}

class Post extends NodeQL{
  constructor(rhs){
    super(NodeQL);
    this.user=rhs.user;
    this.content=rhs.content;
    this.comments=[];
  }
}

class Web extends NodeQL{
  constructor(rhs){
    super(rhs)
  }
}

class Data{
  constructor(){
    this.commentList=[];
    this.postList=[];
    this.web=new Web({id:0});
  }

  newPost(post){
    let id = this.postList.length;
    this.postList.push(new Post({
      id:id,
      user:post.user,
      content:post.content,
    }));
    return id;
  }

  comment(postID,comment){

    let newComment = new Comment({
      id:this.commentList.length,
      user:comment.user,
      content:comment.content,
      replyTo:postID.id
    });
    this.commentList.push(newComment);

    let postComments = this.postList[postID].comments;
    postComments.push(newComment.id);
    return {postID,commentID:newComment.id};
  }

  editPost(postID,newpost){
    let post = this.postList[postID];
    post.user=newpost.user;
    post.content=newpost.content;
    return postID;
  }

  getPostByID(id){
    return this.postList[id];
  }

  getPostsByIDs(ids){

  }

  searchPost(text){
    let tmp=this.postList.slice(0,2)||[];
    return tmp;
  }

  getAllPost(){
    return this.postList;
  }

  getCommentByID(id){

  }

  getCommentsByIDs(ids){

  }

  //-----------
  getWebByID(id){
    return this.web;
  }
  getWebID(){
    return this.web.id;
  }
}

var database = new Data();

export {
database
}