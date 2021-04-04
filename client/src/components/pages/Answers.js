import React, { Component } from "react"
import axios from 'axios';
class Answers extends Component {

    state = {conference:{}, employee:'', questions:[],answeredQuestions:[], values:[], isCompleted:false};
    componentDidMount() {

        const conferenceId = this.props.match.params.id.substring(0,24);
        const employeeName = this.props.match.params.id.substring(24);
        console.log("conf id is: " + conferenceId);
        console.log("emp name is: " + employeeName);
        axios.get(`http://localhost:5000/api/answers/${this.props.match.params.id}`)
            .then((res)=> {
                if(res.data){
                    this.setState({isCompleted: true});
                }
            }).catch(err => {
            //const errors = err.response.data.errors;
            console.log(err)
        });

        axios.get(`http://localhost:5000/api/conference/${conferenceId}`)
            .then((response) => {
                let answered = [];
                console.log(response.data);
                this.setState({conference: response.data,
                                    employee: response.data.employees
                                        .find((emp) => {
                                            return emp.name.replace(/ /g,'') === employeeName;
                                        }),
                                    questions: response.data.questions});
                for(let i=0;i<this.state.questions.length;i++){
                    answered[i] = false;
                }
                this.setState({answeredQuestions: answered});

            }).catch(err => {
            //const errors = err.response.data.errors;
            console.log(err)
        });
    }

    componentWillUnmount() {
        if(this.state.isCompleted){
            axios.post(`http://localhost:5000/api/answers/${this.props.match.params.id}`,
                {data: this.state.conference})
                .then(res=>{
                    console.log(res);
                }).catch(err => {
                //const errors = err.response.data.errors;
                console.log(err);
            });
        }
    }

    handleAdd = (index) =>{
        console.log("handle add");
        let answer = this.state.values[index];
        let newQuestions = this.state.questions;
        newQuestions[index].answers.push(answer);
        let valys = this.state.values;
        valys[index] = "";
        let answered = this.state.answeredQuestions;
        answered[index] = true;
        let isCompleted = this.state.answeredQuestions.filter(question => {
            return question === false;
        });
        if(isCompleted.length===0){
            this.setState({isCompleted:true});
        }
        this.setState({questions: newQuestions,
                            values:valys,
                            answeredQuestions: answered });
    }

    handleChange = (index,event) =>{
        console.log("event is" + event.target.value);
        console.log("index is" + index);
        this.setState({currentQuestion:index});
        let valys = this.state.values;
        valys[index] = event.target.value;
        this.setState({values: valys});
}

    getStyle = (index)=> {
        if(this.state.answeredQuestions[index] === true){
            return({display: 'none'})
        }
    }

    render() {
        return (
            <React.Fragment>
                Hoşgeldiniz, Sn. {this.state.employee.name}
                <br/>
                Konferans ismi: {this.state.conference.name}
                {this.state.isCompleted?
                    <div>
                        Sorular bitti ya da daha önceden tüm soruları yanıtladınız.
                    </div>:
                    <div>
                            <br/>
                            Sorular:
                            <ul>
                                {this.state.questions.map((question,index) =>(
                                    <li key={question._id}  style={this.getStyle(index)}>
                                        <div>
                                            <label>
                                                {question.title}
                                            </label>
                                            <input type="text"
                                                   value={this.state.values[index] || ''}
                                                   placeholder="virgül(,) ile ayırarak girin"
                                                   onChange={this.handleChange.bind(this,index)} />
                                            <button type="button"
                                                    onClick={this.handleAdd.bind(this,index)}
                                            >
                                                Ekle
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                    </div>
                }
            </React.Fragment>
        )
    }
}

export default Answers;


