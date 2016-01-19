/**
 * Created by iamchenxin on 1/18/16.
 */
function getHash(){
   // console.dir(window.location);
    let hash=window.location.hash||"#";
    console.log(`hash = [${hash}]`)
    return hash.substring(1);
}

export {
getHash
}