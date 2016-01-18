/**
 * Created by iamchenxin on 1/18/16.
 */

function MakeMinMax(def){
    return function(value,min,max){
        if(value>max||value<min){
            return def;
        }else {
            return value;
        }
    }
}

var MinMax0=MakeMinMax(0);

export {
MinMax0,
MakeMinMax
}