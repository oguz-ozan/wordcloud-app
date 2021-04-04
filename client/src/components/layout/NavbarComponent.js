import React, { Component } from "react"
import {Link} from 'react-router-dom'
import {Button, Navbar, Nav} from 'react-bootstrap'

class NavbarComponent extends Component {

    guestLinks = (
        <Nav className="mr-auto">
            <Nav.Link as={Link} to="/login">Login</Nav.Link>
        </Nav>

        );

     authLinks = (
         <Nav className="mr-auto">
             <Nav.Link as={Link} to="/conferences">Conferences</Nav.Link>
             <Nav.Link>
                 <Nav.Item onClick={this.props.logout}>Logout</Nav.Item>
             </Nav.Link>
         </Nav>
    )
    render() {
        return (
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand as={Link} to="/" >WordCloud App</Navbar.Brand>
                <React.Fragment>{this.props.isAuth ? this.authLinks : this.guestLinks}</React.Fragment>
            </Navbar>
        )

    }
}

export default NavbarComponent;