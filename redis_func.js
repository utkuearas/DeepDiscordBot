module.exports.delete_element = (cache,key,data_type) =>{
    return new Promise(resolve => {
        cache.hmget(data_type,key,(err,value) => {
            if(value[0].search('AAAAA') != -1){
                cache.hmset(data_type,key,value[0].split('AAAAA').slice(1).join('AAAAA'));
                resolve(value[0].split('AAAAA').slice(1));
            }else if(value[0].length != 0){
                cache.hmset(data_type,key,'');
                resolve(['']);
            }
        })
    })
}
module.exports.add_element = (cache,key,data_type,element) =>{
    return new Promise(resolve => {
        cache.hmget(data_type,key,(err,value) => {
            if(value[0] != '' && value[0] != null){cache.hmset(data_type,key,value[0]+'AAAAA'+element);resolve(value[0]+'AAAAA'+element);}
            else{
                cache.hmset(data_type,key,element);
                resolve(element);
            }
        })
    })
}
module.exports.get_data = (cache,key,data_type) =>{
    return new Promise(resolve => {
        cache.hmget(data_type,key,(err,value) =>{
            resolve(value[0]);
        })
    })
}