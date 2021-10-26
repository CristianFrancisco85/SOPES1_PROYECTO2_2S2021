import {BrowserRouter,Switch,Route,Redirect} from 'react-router-dom'
import Home from './components/home';
import NavBar from './components/navbar';


const App = () => {

return(

  <BrowserRouter>
  <NavBar></NavBar>
  <Switch>
      <Route  exact path="/home" component={Home}/>
      <Route  exact path="/about" component={Home}/>
      <Redirect from="/" to="/home" />
  </Switch>
  </BrowserRouter>

)

}

export default App;
