
import React, { Component, Fragment } from "react"
import { Button, Table} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from "axios";


class Conferences extends Component {
    componentDidMount() {
        const options = {
            headers: {
                "X-Auth-Token": this.props.token
            }
        }
        axios.get("http://localhost:5000/api/conference",options)
            .then(
                response => {
                    this.props.updateConferences.bind(this, response.data);
                    this.props.updateConferences(response.data);
                }
            ).catch(err => console.log(err.message));
    }

    render() {
        return (
        <Fragment>
            {this.props.isAuth?
                <div>
                    <Link to={`/addConference`}>
                        <Button variant="secondary">
                            Konferans Ekle
                        </Button>
                    </Link>
                <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Konferans</th>
                    <th>Sonuçlar</th>
                    <th>Mail Gönder</th>
                    <th>Düzenle</th>
                    <th>Sil</th>
                </tr>
                </thead>
                <tbody>
                {this.props.conferences.map(conf => (
                    <tr key={conf._id}>
                        <td width="85%">{conf.name}</td>
                        <td width="5%">
                            <Link to={`/results/${conf._id}`}>
                                <Button variant="secondary">
                                    Results
                                </Button>
                            </Link>
                        </td>
                        <td width="5%">
                            <Button
                                variant="secondary"
                                onClick={this.props.onSendEmail.bind(this,conf._id)}>
                                <i className="fas fa-envelope"></i>
                            </Button>

                        </td>
                        <td width="5%">
                            <Link to={`/edit/${conf._id}`}>
                                <Button
                                    variant="secondary"
                                    onClick={this.props.onEdit.bind(this,conf._id)}>
                                    <i className="fas fa-edit"></i>
                                </Button>
                            </Link>
                        </td>
                        <td width="5%">
                            <Button
                                variant="secondary"
                                onClick={this.props.onDelete.bind(this,conf._id)}>
                                <i className="fas fa-trash-alt"></i>

                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
                </div>:
                <div>Not authorized. You must be login to see the conferences.</div>
                    }
                </Fragment>
        )
    }
}

export default Conferences;