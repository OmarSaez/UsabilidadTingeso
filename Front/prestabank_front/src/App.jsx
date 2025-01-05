import './App.css'
import {HashRouter as Router, Route, Routes} from 'react-router-dom'
import EnterAccount from './components/enterAccount';
import CreateAccount from './components/createAccount';
import LoginAccount from './components/loginAccount';
import Home from './components/home';
import Simulation from './components/simulation';
import ApplyForLoan from './components/applyForLoan';
import MyApplication from './components/myApplication';
import LoanEvalue from './components/loanEvalue';
import Loan from './components/loan';

function App() {
  return (
    <Router>
      <div className='container'>
        <Routes>
          <Route path='/' element={<EnterAccount/>} />
          <Route path='/create' element={<CreateAccount/>} />
          <Route path='/login' element={<LoginAccount/>} />
          <Route path='/home/:id' element={<Home/>} />
          <Route path='/simulation/:id' element={<Simulation/>} />
          <Route path='/apply-for-loan/:id' element={<ApplyForLoan/>} />
          <Route path='/my-application/:id' element={<MyApplication/>} />
          <Route path='/loan-evalue/:id' element={<LoanEvalue/>} />
          <Route path='/loan-evalue/:id/:idLoan' element={<Loan/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
