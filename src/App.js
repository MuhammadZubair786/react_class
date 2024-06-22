import logo from './logo.svg';
import './App.css';
import Home from './Components/Home';
import StepperForm from './Components/Stepper/mainstepper';
import { Route, Routes } from 'react-router-dom';
import FirendList from './Components/Chat_Folder/List';
import RequestList from './Components/Chat_Folder/Request';
import ChatList from './Components/Chat_Folder/getChatList';
import MessageScreen from './Components/Chat_Folder/MessageScreen';
import Auth from './Components/Stepper/Form/Auth';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Auth/>}></Route>
      <Route path='/user' element={<FirendList/>}></Route>
      <Route path='/Request' element={<RequestList/>}></Route>
      <Route path='/ChatList' element={<ChatList/>}></Route>
      <Route path='/MessageScreen' element={<MessageScreen/>}></Route>
   


      </Routes>
    

  );
}

export default App;
