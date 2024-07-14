export const uhidGen=(num)=>{
    const rem =5-(''+num).length
    if(rem>0)
        return '0'.repeat(rem)+num;
    return num;
}