import {BrowserRouter,Switch,Route,Redirect} from 'react-router-dom'
import Home from './components/home';
import Logs from './components/logs';
import NavBar from './components/navbar';
import { useEffect,useState } from 'react';
import io from 'socket.io-client';
import { GlobalContext } from './globalContext';

const App = () => {
  
  const [mongoData,setMongoData] = useState([])
  const [lastGames,setLastGames] = useState([])
  const [topPlayers,setTopPlayers] = useState([])
  const [logs,setLogs] = useState([])
  const [topGames,setTopGames] = useState([])
  const [topWorkers,setTopWorkers] = useState([])

  const dataGlobalState = {
    MongoData : [mongoData,setMongoData],
    LastGames : [lastGames,setLastGames],
    TopPlayers : [topPlayers,setTopPlayers],
    Logs : [logs,setLogs],
    TopGames: [topGames,setTopGames],
    TopWorkers: [topWorkers,setTopWorkers],
  }

  useEffect(() => {

    const socket = io('http://localhost:4000');
    socket.on('connect', () => {
      console.log('Connected to server');
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    })

    socket.on('mongodbData', (mongodbData) => {
      setMongoData(mongodbData)
    })

    socket.on('logs', (logs) => {
      setLogs(logs)
    })

    socket.on('topPlayers', (topPlayers) => {
      setTopPlayers(topPlayers)
    })

    socket.on('topGames', (topGames) => {
      setTopGames(topGames)
    })

    socket.on('workers', (workers) => {
      setTopWorkers(workers)
    })

    socket.on('games', (games) => {
      setLastGames(games)
    })


  }, []);
  

return(

  <GlobalContext.Provider value={dataGlobalState}> 
  <BrowserRouter>
  <NavBar></NavBar>
  <Switch>
      <Route  exact path="/home" component={Home}/>
      <Route  exact path="/logs" component={Logs}/>
      <Redirect from="/" to="/home" />
  </Switch>
  </BrowserRouter>
  </GlobalContext.Provider>

)

}

export default App;
