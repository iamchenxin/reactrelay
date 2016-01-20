/**
 * Created by iamchenxin on 1/20/16.
 */

class Pet{
    constructor(args){
        let {id,name,action} =args;
        console.log("...");
        this.id=id;
        this.name=name;
        this.action=action;
    }
}

class Catc extends Pet{
    constructor(args){
        let a = args;
        console.log(args);
        super(args);
        this.food=args.food;
    }
}

class Dog extends Pet{
    constructor(args){
        super(args);
    }
}

class Pigc extends Pet{
    constructor(args){
        super(args);
    }
}

class Data{
    constructor(){
        this.cats=[
            new Catc({
            id:0,
            name:"tom cat",
            action:"moew",
            food:"fish"
        }),
            new Catc({
            id:1,
            name:"小短猫",
            action:"苗苗",
            food:"fish"
        }),
            new Catc({
            id:2,
            name:"neko",
            action:"nay",
            food:"dog"
        })];
        this.dogs=[new Dog({
            id:1000,
            name:"小黄",
            action:"汪汪",
        }),new Dog({
            id:1001,
            name:"wolf",
            action:"wangwang",
        }),new Dog({
            id:1002,
            name:"犬只",
            action:"噗噗",
        })];
        this.pigs=[new Pigc({
            id:600,
            name:"pig1",
            action:"6666",
        }),new Pigc({
            id:601,
            name:"zhu2",
            action:"zzzz",
        })];
    }

    getPet(id){
        if(id>=1000){
            id=id-1000;
            return this.dogs[id];
        }else {
            return this.cats[id];
        }
    }

    getAll(){
        return [...this.cats,...this.dogs,...this.pigs];
    }
}

var database = new Data();

export {
    database,
Pet,Pigc,Dog,Catc
}