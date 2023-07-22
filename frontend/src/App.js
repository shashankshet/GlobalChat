import { Box, Button, Container, HStack, Input, VStack} from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import Message from './Components/Message';
import {signOut, onAuthStateChanged, getAuth,GoogleAuthProvider, signInWithPopup} from 'firebase/auth'
import { app } from './firebase';
import {query, orderBy,  onSnapshot, getFirestore,addDoc, collection, serverTimestamp} from 'firebase/firestore'

const auth = getAuth(app)
const db = getFirestore(app)

const loginhandler = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth,provider);
}

const logouthandler = () =>{
   signOut(auth);
}

function App() {
  const q = query(collection(db,"Messages"),orderBy("createdAt","asc"))
  const [user,setUser] = useState(false);
  const [message,setMessage] = useState("");
  const [messages,setMessages] = useState([]); 
   useEffect(()=>{
    const unsubscribe=onAuthStateChanged(auth,(data)=>{
      setUser(data);
    });


   const unsubsribeForMessage = onSnapshot(q,(snap)=>{
    setMessages(
      snap.docs.map((item)=>{
        const id = item.id;
        return {id, ...item.data() };
      })
    );
 });

    return ()=>{
      unsubscribe(); 
      unsubsribeForMessage();
    }; 
   },[])

   const submithandler = async(e) =>{
    e.preventDefault();
    try {
      setMessage("");
      addDoc(collection(db,"Messages"),{
        text:message,
        uid: user.uid,
        uri:user.photoURL,
        createdAt:serverTimestamp()
  
      });
      setMessage("");
      
    } 
    catch (error) {
      alert(error);
      
    } 
  }

  return (
    <Box bg={"red.50"}>
      {
        user?(
          <Container h="100vh" bg={"white"}>
        <VStack h={"full"} paddingY={"4"}>
          <Button onClick={logouthandler} w={"full"} colorScheme={"red"}>Logout</Button>
          <VStack h={"full"} w={"full"} overflowY={"auto"}>

            {
              messages.map((item)=>(
                <Message key={item.id} user={item.uid === user.uid?"me":"other"} text={item.text} uri={item.uri}/>
              ))
            }

          </VStack>
   
        <form  onSubmit={submithandler} style={{width:"100%"}}>
        <HStack>
            <Input value={message} onChange={(e)=>setMessage(e.target.value)}/>
            <Button colorScheme={"purple"} type='submit'>Send</Button>
            </HStack>
        </form>
       
        </VStack>
      </Container>
        ): <VStack bg= {"whatsapp.100"}  justifyContent={"Center"} h={"100vh"}>
          <Button onClick={loginhandler}>Sign in with Google</Button>
        </VStack>
      }
    </Box>
  );
}

export default App;
