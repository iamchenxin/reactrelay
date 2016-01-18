/**
 * Created by iamchenxin on 1/15/16.
 */


function MinMAx(value,min,max,def){
    if(value>max||value<min){
        return def;
    }else{
        return value;
    }
}

class Data{
    constructor(bookList,userList){
        this.bookList=bookList || [{
            id: 0,
            author: "none book",
            pages: 0
        }, {
            id: 1,
            author: "jim",
            pages: 666
        }, {
            id: 2,
            author: "mick json",
            pages: 357
        }, {
            id: 3,
            author: "tom green",
            pages: 781
        }];
        this.userList=userList || [{
            id: 0,
            name: "none",
            gender: "none",
            book: 0
        }, {
            id: 1,
            name: "刘德华",
            gender: "男",
            book: 1
        }, {
            id: 1,
            name: "学友",
            gender: "男",
            book: 3
        }, {
            id: 1,
            name: "艳芳",
            gender: "女",
            book: 2
        }];
    }

    getBook(id) {
        let book = {};
        try {
            book = this.bookList[id];
        } catch (e) {
            book = {
                id: 0,
                author: "none book",
                pages: 0
            };
        }
        return book;
    }

    getUser(id) {
        id = MinMAx(id, 1, 3, 0);
        let user = this.userList[id];
        return user;
    }

    updateUser(id,name){
        id = MinMAx(id, 1, 3, 0);
        this.userList[id].name=name;
        return this.userList[id].name;
    }
}

var database=new Data();



export {database}