import React, { Component } from "react"
import axios from 'axios';
import ReactWordcloud from 'react-wordcloud';


class Results extends Component {

    state = {questions: []}

    componentDidMount() {
        if (this.props.token) {
            const {match: {params}} = this.props;
            const data = {
                headers: {
                    "X-Auth-Token": this.props.token
                }
            }
            axios.get(`http://localhost:5000/api/conference/${params.id}`,data)
                .then(res => {
                    this.setState({questions: res.data.questions})
                    let questys = this.state.questions;
                    this.state.questions.map((question,index) => {
                        question.answers.map((answer,ind) => {
                            questys[index].answers[ind] = {text: `${answer}`, value:1}
                        })
                    })

                    questys.map(question => {
                        for(let i=0;i<question.answers.length;i++){
                            for(let j=i+1;j<question.answers.length;j++){
                                if(question.answers[i].text === question.answers[j].text){
                                    question.answers[i].value += question.answers[j].value;
                                    question.answers[j].value = 0;
                                }
                            }
                        }
                        question.answers = question.answers.filter(answer => {
                            return answer.value !== 0;
                        })
                    })
                    this.setState({questions: questys});
                })
        }
    }

    render() {
        return (
            <div>
                {this.state.questions.map((question,index) => (
                    <div key={question._id}>
                        <p>WordCloud for Question {index+1}: {question.title}</p>
                        <ReactWordcloud words={question.answers}/>
                    </div>
                ))}
            </div>
        )
    }
}

export default Results;