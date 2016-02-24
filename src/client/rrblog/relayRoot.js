/**
 * Created by iamchenxin on 1/22/16.
 */
import Relay from 'react-relay';

export class rootR extends Relay.Route {
    static queries={
        posts:()=>{return ( Relay.QL`query{
        posts(k:{userList:["tom","xiao","da"],dumb:1})
        }`);}
    };
    static routeName = 'myRoot';
}