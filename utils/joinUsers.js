const users = [];
//new user joins
const userJoin = ( id , username , room )=>{
   
    const user = { id , username , room };

    users.push(user);

    return user;
}

//get user by name
const removeUserByName = async (name , room)=>{
   
   const index = await users.findIndex((user)=> user.username === name && user.room===room);

   console.log(" Index ",index);

   if(index!==-1){
      await users.splice(index,1)[0];
   }
}

//get current user
const getCurrentUser = async (id)=>{
   return await users.find((user)=> user.id === id);
}
//remove user when he leaves
const removeUser = async (id)=>{
  
   const index = await users.findIndex( user => user.id===id );

   if(index!==-1){
       
    const user = await users.splice(index,1)[0];

    return user;
   }
}
//get All users to a particular room
const getUsersToRoom =  async (room)=>{

   const usersInRoom = await users.filter(user=>user.room===room);
   
   return usersInRoom;
}

module.exports={
    userJoin,
    getCurrentUser,
    removeUser,
    getUsersToRoom,
    removeUserByName
}