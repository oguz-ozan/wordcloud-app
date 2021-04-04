import React, { Fragment, Component } from 'react';
import './App.css';
import NavbarComponent from './components/layout/NavbarComponent'
import Index from './components/layout/Index'
import axios from 'axios';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import EditConference from "./components/pages/EditConference";
import Results from "./components/pages/Results";
import Conferences from "./components/pages/Conferences";
import Login from "./components/pages/Login";
import AddConference from "./components/pages/AddConference";
import Answers from "./components/pages/Answers";

class App extends Component {
    state = {
        conferences: [],
        questions: [],
        employees: [],
        token:"",
        currentConference: "",
        isAuth: false,
    }

    onDelete = (id) => {
            const data = {
                headers: {
                    "X-Auth-Token": this.state.token
                }
            }
            const URL = `http://localhost:5000/api/conference/${id}`;
            axios.delete(URL, data).then(res => {
                this.setState({
                    conferences: [...this.state.conferences.filter(conference=>
                    conference._id !== id)]
                })
            });
        }
    onEdit = (id) => {
        this.setState({currentConference: this.state.conferences.find(
            conf => conf._id === id
            )})
    }

    // Edit or Insert a Conference
    addOrUpdateConference = (conf) =>{
        const newQuestions = conf.questions.map(question => {
            return {
                answers: question.answers,
                title: question.title
            }
        })
        const newEmployees = conf.employees.map(employee => {
            return {
                email: employee.email,
                name: employee.name,
                isSent: employee.isSent
            }
        })
        const data = {
            name: conf.name,
            questions: newQuestions,
            employees: newEmployees,
        }

        axios.post("http://localhost:5000/api/conference", data, {
            headers: {
                "X-Auth-Token": this.state.token
            }})
            .then(res => {
                const cnf = this.state.conferences.filter((conf) => conf._id===res.data._id);
                // Bu Konferans yoksa, stateye ekle. (INSERT MODE)
                if(cnf.length===0){
                    this.setState({conferences: [...this.state.conferences, res.data]});
                }
            }).catch(err => {
            const errors = err.response.data.errors;
            console.log(errors)
        });
    }

    // Updates the state with the data came from API.
    updateConferences = (conf) => {
        this.setState({
            conferences: conf
        })
    }

    // Login with credentials and set Token and Auth State.
    login = (credentials) => {
        let email = credentials.email;
        let password = credentials.password;
        const body = { email, password };
        axios.post("http://localhost:5000/api/auth",body)
            .then(res => {
                this.setState({token: res.data.token, isAuth:true});
            }).catch(err => {
            const errors = err.response.data.errors;
            console.log(errors)
        });


    }
    // Logout and set Token and Auth State to null.
    logout = () => {
        this.setState({isAuth:false, token:''});
    }

    // Axios ile mail gönderme fonksiyonu.
    // Konferansın içindeki tüm userlara mail atılacak.
    // Userların isSent değerleri True olarak değiştirilecek.
    // Userlara token gönderilecek. Bu tokenle userlar giriş yaptığında
    // /answers/:confid/$token olarak yaratılacak olan API endpointten 'Answers'
    // componentine girip sorulara cevaplarını yazacaklar.
    // Bu cevaplar ise ilgili konferansın içine DBye yazılacak.

    onSendEmail = (conf) => {
        axios.get(`http://localhost:5000/api/conference/send/${conf}`,
            {
                headers: {
                    "X-Auth-Token": this.state.token
                }}).then(res=>{
            console.log(res)
        }).catch(err => {
            //const errors = err.response.data.errors;
            console.log(err);
        });
    }

    render(){
        return(
            <Router>
                <Fragment>
                    <NavbarComponent
                        isAuth={this.state.isAuth}
                        logout={this.logout}
                    />
                    <div className="container">
                        <Switch>
                            <Route path="/login" render={()=>
                            <Login
                                login={this.login}
                                isAuth={this.state.isAuth}
                            />}
                            />
                            <Route exact path="/" render={() =>
                                <Index/>}
                            />
                            <Route path="/conferences" render={() =>
                                <Conferences
                                    isAuth={this.state.isAuth}
                                    token={this.state.token}
                                    conferences={this.state.conferences}
                                    onDelete={this.onDelete}
                                    onEdit={this.onEdit}
                                    onSendEmail={this.onSendEmail}
                                    updateConferences={this.updateConferences}
                                />}
                            />
                            <Route path="/answers/:id" render={(props)=>
                             <Answers
                                 {...props}/>
                            }/>

                            <Route path="/edit/:id" render={(props) =>
                                <EditConference
                                    isAuth={this.state.isAuth}
                                    onSave={this.addOrUpdateConference}
                                    token={this.state.token}
                                    {...props}/>
                            }/>
                            <Route path="/results/:id" render={(props) =>
                            <Results
                                token={this.state.token}
                                {...props}/>
                            }/>
                            <Route path="/addConference" render={(props)=>
                            <AddConference
                                    isAuth={this.state.isAuth}
                                    onSave={this.addOrUpdateConference}
                                    {...props}
                            />
                            }/>
                        </Switch>
                    </div>
                </Fragment>
            </Router>
        )
    }
}
export default App;