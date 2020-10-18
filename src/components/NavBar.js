import React from 'react';
import squarelogowhite from '../images/squarelogowhite.png';
import '../css/navbar.css';
import '../css/bootstrap.min.css'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';


class NavBar extends React.Component {

  constructor(props){
    super(props);
}


  render(){
    return (
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand href="#home">
            <img
              alt=""
              src={squarelogowhite}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            Titan Analytics
          </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ml-auto">

            <Nav.Link href="/">Home</Nav.Link>

            <NavDropdown title="Data" id="collasible-nav-dropdown">
              <NavDropdown.Item href="/uploaddata">Upload Data</NavDropdown.Item>
              <NavDropdown.Item href="/managedata">Manage Data</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/instructionguide">Instruction Guide</NavDropdown.Item>
              <NavDropdown.Item href="/contactus">Contact Us</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Reports" id="collasible-nav-dropdown">
              <NavDropdown.Item href="/browsereports">Browse Reports</NavDropdown.Item>
              <NavDropdown.Item href="/createreport">Create Report</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/instructionguide">Instruction Guide</NavDropdown.Item>
              <NavDropdown.Item href="/contactus">Contact Us</NavDropdown.Item>
            </NavDropdown>

            <Nav.Link href="/account">Account</Nav.Link>

            <Nav.Link href="/contactus">Contact Us</Nav.Link>

            <Nav.Link href="/signout">Sign Out</Nav.Link>
          </Nav>

        </Navbar.Collapse>
      </Navbar>
  );
  }
}

export default NavBar;
