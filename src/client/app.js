/**
 * Created by iamchenxin on 1/18/16.
 */
import {Render} from './rblog/post.js';
import {getPosts,newPost} from './rblog/client.js';
import {Task} from '../common/scripts/task';


Task.task("blog.post",data=>{
   newPost(data.user,data.content);
});

Task.dataflow("client.getPosts",data=>{
    console.log(JSON.stringify(data) );
    Render(data);
});

getPosts(0);
