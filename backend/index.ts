import * as express from 'express';
import * as cors from 'cors';
import { json } from "body-parser";
import { rtdb, dbFirebase } from './db';
const app = express();
const port = 3000;

app.use(cors());
app.use(json())

const collectionUserRef = dbFirebase.collection('users');
const collectionRoomsRef = dbFirebase.collection('rooms');

app.get('/inicio', (req, res) => {
    res.json("Hola inicio");
});


app.post('/signup', (req, res) => {
    const { nombre, email } = req.body;

    if (!nombre || !email) {
        return res.status(400).json({
            success: false,
            email: "Faltan datos requeridos: 'nombre' y 'message' son obligatorios.",
        });
    }
    collectionUserRef.where("email", "==", email).get().then(searchResponse => {
        if (searchResponse.empty) {
            collectionUserRef.add({
                nombre: nombre,
                email: email
            }).then(documentReference => {
                res.status(201).json({
                    success: true,
                    message: "Usuario creado exitosamente",
                    id: documentReference.id,
                });
            });
        } else {
            res.status(400).send(`Usuario ya existente ${searchResponse.docs[0].id}`)
        }

    })
});

app.post('/auth', (req,res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({
            ok: false,
            email: "Faltan datos requeridos: 'email' obligatorio.",
        });
    }
    collectionUserRef.where("email", "==", email).get().then(searchResponse => {
        if (searchResponse.empty) {
            res.status(400).json({
                ok : false,
                message : `Usuario no existe, registrate`
            })
        } else {
            res.status(200).json({
                ok: true,
                message: "Usuario encontrado",
                id: searchResponse.docs[0].id,
            });
        }

    })
});

app.post('/rooms', (req, res) =>{
    const salaIdAmigable = Math.floor(Math.random() * 99999);
    const salaIdComplicada = crypto.randomUUID();
    const { userId } = req.body
    
    collectionUserRef.doc(userId).get().then( docSnap => {
        if(docSnap.exists){
            rtdb.ref("rooms/"+ salaIdComplicada).set({
                messages : [],
                owner : userId
            });
            collectionRoomsRef.doc(salaIdAmigable.toString()).set({
                roomId : salaIdComplicada
            });
            //HAGO REFERENCIA AL ROOM QUE QUIERO CREAR DE LA RTDB
            const chatroomRef = rtdb.ref("/rooms/"+ salaIdComplicada)
            chatroomRef.set({
                type: "chatrooms"
            })
            res.json({idAmigable : salaIdAmigable.toString() ,idComplicada : salaIdComplicada})
        }else{
            res.send('Usuario no existente')
        }
    })
});

app.get('/rooms/:id', (req, res) =>{
    const { id } = req.params
    console.log(id);
    collectionRoomsRef.doc(id).get().then( docSnap => {
        console.log(docSnap.data().roomId);
        res.json({
            ok : true,
            roomId: docSnap.data().roomId
        })
    })
});


app.post("/rooms/:id", function (req, res){
    const { id } = req.params
    const chatroomRef = rtdb.ref(`/rooms/${id}/messages`);
    chatroomRef.push({
        nombre : req.body.nombre,
        message: req.body.message
    }, function(){
        res.json("Todo ok")
    })
    
})



app.listen(port, () => {
    console.log(`The serv is in port ${port}`);
})