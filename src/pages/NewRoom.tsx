import IllustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import { FormEvent, useState } from 'react'
import { Button } from '../components/Button'
import { Link, useHistory } from 'react-router-dom'

//import { useAuth } from '../hooks/useauth'

import '../styles/auth.scss'
import { database } from '../services/firebase'
//import { useEffect } from 'react'
//import { useContext } from 'react'
//import userEvent from '@testing-library/user-event'
import { useAuth } from '../hooks/useauth'

export function NewRoom (){
   const { user } = useAuth()
   const [newRoom, setNewRoom] = useState('');
   const history = useHistory();
   
   async function handleCreateRoom(event : FormEvent){
        event.preventDefault();
        
        if (newRoom.trim() === '') {
            return;
        }

        const roomRef = database.ref('rooms');
        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id,
        });

        history.push(`/rooms/${firebaseRoom.key}`)
        
    };

    return(
        <div id="page-auth">
            <aside>
            <img src={IllustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
            <strong>Crie salas de Q&amp;A ao-vivo</strong>
            <p>Tire as suas dúvidas da sua audiência em tempo-real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask" />
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input 
                            type="text"
                            placeholder="Nome da sala"
                            onChange={event => setNewRoom(event.target.value)}
                            value = {newRoom}
                        />
                        <Button type="submit">
                            Criar sala
                        </Button>
                    </form>
                    <p>
                        Quer entrar em uma sala existente? <Link to="/">clique aqui</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}