import logoImg from '../assets/images/logo.svg'

import { useParams } from 'react-router-dom'
import { Button } from '../components/Button'
import{RoomCode} from '../components/RoomCode'

import '../styles/room.scss'
import { FormEvent, useState } from 'react'
import { useAuth } from '../hooks/useauth'
import { database } from '../services/firebase'
import { useEffect } from 'react'


type FirebaseQuestions = Record<string, {
    author:{ 
        name:string;
        avatar:string;
    }
    content:string;
    isAnswered:boolean;
    isHightLighted:boolean;
}> 

type Question = {
    id:string;
    author:{
        name:string;
        avatar:string;
    }
    content:string;
    isAnswered:boolean;
    isHightLighted:boolean;
}


type RoomParams = {
    id:string;
}

export function Room(){
    const {user} = useAuth();
    const parms = useParams<RoomParams>();
    const roomId = parms.id;
    const [newQuestion, setNewQuestion] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [title, setTitle] = useState('');


    useEffect(()=>{
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.on('value',room => {
            const databaseRoom = room.val();
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

            const parsedQuestions = Object.entries(firebaseQuestions).map(([key,value]) => {
                return{
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHightLighted: value.isHightLighted,
                    isAnswered: value.isAnswered
                }
            }) 
            setQuestions(parsedQuestions);
            setTitle(databaseRoom.title);
        })

    },[roomId]);

    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault();
        
        if (newQuestion.trim() === '') {
            return;
        }

        if (!user) {
            throw new Error("you must be logged in");
        }

        const question = {
            content: newQuestion,
            author:{
                name: user.name,
                avatar:user.avatar,

            },
            isHightLighted:false,
            isAnswered:false
        };  

    await database.ref(`rooms/${roomId}/questions`).push(question);
    
    setNewQuestion('');
}

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="letmeask" />
                    <div>
                        <RoomCode code={roomId}/>
                    </div>
                </div>
            </header>
            <main>
                  <div className="room-title">
                        <h1>Sala {title}</h1>
                        {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                    </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea
                        placeholder="O que voc?? quer perguntar?"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />
                    <div className="form-footer">
                        { user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>Para enviar sua pergunta, <button>fa??a seu login</button>.</span>
                        )}
                        <Button type="submit" disabled={!user}>Enviar pergunta</Button>
                    </div>
                </form>


            </main>
        </div>
    );
}


