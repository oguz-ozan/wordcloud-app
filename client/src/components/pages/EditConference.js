import React, { Component } from "react"
import axios from 'axios';
import { Button, Table} from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';


class EditConference extends Component {

    state = { conference: {name: '', questions: [], employees:[]}}

    componentDidMount(){
        if(this.props.token){
            const { match: {params}} = this.props;
            const data = {
                headers: {
                    "X-Auth-Token": this.props.token
                }
            }
            // Konferansı API üzerinden alıp stateyi update eder.
            axios.get(`http://localhost:5000/api/conference/${params.id}`, data)
                .then( res => {
                    this.setState({conference: res.data})
                });
        }else{
            console.log("not authorized yet.")
        }
    }

    handleChange = (event) => {
        this.setState({value: event.target.value});
    }
    handleChangeEmployeeName = (event) => {
        this.setState({value2: event.target.value});
    }
    handleChangeEmployeeEmail = (event) => {
        this.setState({value3: event.target.value});
    }

    handleAdd = () => {
        let conf = this.state.conference;
        const questionAdd = {answers: "", _id: uuidv4(), title: this.state.value};
        conf.questions = [...conf.questions, questionAdd];
        this.setState( {conference : conf, value:''
        });
    }

    handleAddEmployee = (e) => {
        e.preventDefault();
        let conf = this.state.conference;
        const employeeAdd = {isSent: false, _id: uuidv4(), name: this.state.value2,
                            email: this.state.value3};
        conf.employees = [...conf.employees, employeeAdd];
        this.setState( {conference : conf, value2:'', value3:''
        });
    }

    onDeleteQuestion = (id) => {
        let conf = this.state.conference;
        conf.questions = conf.questions.filter(question => question._id !== id);
        this.setState({conference: conf});
    }

    onDeleteEmployee = (id) => {
        let conf = this.state.conference;
        conf.employees = conf.employees.filter(employee => employee._id !== id);
        this.setState({conference: conf});
    }

    onSave = () => {
        console.log("onsave from editConf");
        this.props.history.goBack();
        this.props.onSave.bind(this, this.state.conference);
        this.props.onSave(this.state.conference);
    }

    render() {
        return (
            <React.Fragment>
                {this.props.isAuth?
                    <div>
                        Konferans: {this.state.conference.name}
                        <Table>
                            <thead>
                            <tr>
                                <th>Soru</th>
                                <th style={{width:'10%'}}>Sil</th>                            </tr>
                            </thead>
                            <tbody>
                            {this.state.conference.questions.map(question => (
                                <tr key={question._id}>
                                    <td>{question.title}</td>
                                    <td>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={this.onDeleteQuestion.bind(this,question._id)}>
                                            <i className="fas fa-trash-alt"></i>
                                        </Button>
                                    </td>
                                </tr>

                            ))}
                            </tbody>
                        </Table>
                        <div>
                            <input type="text"
                                   value={this.state.value || ''}
                                   placeholder="Soru girin"
                                   onChange={this.handleChange} />
                            <button type="button"
                                    onClick={this.handleAdd}
                                    disabled={!this.state.value}>
                                Soru Ekle
                            </button>
                        </div>

                        <Table>
                            <thead>
                            <tr>
                                <th>İsim</th>
                                <th>Email</th>
                                <th>Mail gönderildi?</th>
                                <th style={{width:'10%'}}>Sil</th>                            </tr>
                            </thead>
                            <tbody>
                            {this.state.conference.employees.map(employee => (
                                <tr key={employee._id}>
                                    <td>{employee.name}</td>
                                    <td>{employee.email}</td>
                                    <td>{employee.isSent?"Evet":"Hayır"}</td>

                                    <td><Button type="button"
                                                variant="secondary"
                                                onClick={this.onDeleteEmployee.bind(this,employee._id)}>
                                        <i className="fas fa-trash-alt"></i>
                                    </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                        <form onSubmit={this.handleAddEmployee}>
                            <input type="text"
                                   placeholder="İsim"
                                   onChange={this.handleChangeEmployeeName}
                                   value = {this.state.value2 || ''}/>
                            <input type="text"
                                   placeholder="Email"
                                   onChange={this.handleChangeEmployeeEmail}
                                   value = {this.state.value3 || ''}/>
                            <input type="submit"
                                   value="Kullanıcı Ekle"
                                   disabled={!this.state.value2 || !this.state.value3}/>

                        </form>
                        <Button variant="secondary"
                                style={{float: "right"}}
                                onClick={this.onSave}
                        >Kaydet</Button>
                    </div>
                :
                <div>Not authorized. You must login to see the conferences.</div>}
            </React.Fragment>
        )
    }
}

export default EditConference;