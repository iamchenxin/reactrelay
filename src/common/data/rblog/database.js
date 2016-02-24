/**
 * Created by iamchenxin on 1/18/16.
 */
import {MinMax0,MakeMinMax} from '../../scripts/util.js';



class Data{
    constructor(){
        let samplePost={
            id:0,
            user:"test",
            content:"i am content",
            commit:0
        };

        this.postList=[];
        this.testsCache_postList=[];
    }

    clipValue(v){
        if(v<=0||v>this.postList.length){
            v=this.postList.length;
        }
        return v;
    }

    getPosts(num){
        let clipNum=this.clipValue(num);
        return this.postList.slice(0,clipNum);
    }

    getAll(){
        return this.postList;
    }

    getPost(id){
        return this.postList[id];
    }

    newPost(user,content){
        let id=this.postList.length;
        this.postList.push({
            id:id,
            user:user,
            content:content,
            commit:0
        });
        console.dir('newPost get data');
        console.log(content);
        return id;
    }

    editPost(id,user,content){
        this.postList[id].user=user;
        this.postList[id].content=content;
        return this.postList[id];
    }
    
    cachePostsByUsers(userList){
        var userSet = new Set(userList);
        
        var cacheRt = this.postList.filter(post =>{
            return userSet.has(post.user);
        });
        
        this.testsCache_postList.push(cacheRt);
        return this.testsCache_postList.length - 1;
    }
    
    getCachePostsByID(id){
        return this.testsCache_postList[id];
    }

}

var database = new Data();

export {
database
}