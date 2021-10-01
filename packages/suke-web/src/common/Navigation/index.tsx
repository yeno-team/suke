import React from 'react';
import { Button, Form, Icon, Image, Navbar } from 'react-bulma-components';
import logo from '../../assets/logo-x2.png';
import { Icon as IconElement } from '@iconify/react';

type NavBarProps = {

}

export const Navigation = ({}: NavBarProps): JSX.Element => {
    return (
        <Navbar className="px-big" backgroundColor="dark" fixed="top"> 
            <Navbar.Brand className="mr-mid">
                <Navbar.Item>
                    <img src={logo} alt="suke logo" />
                </Navbar.Item>
            </Navbar.Brand>
            <Navbar.Menu>
                <div className="navbar-start">
                    <Navbar.Item backgroundColor="dark" className="has-text-white-bis">
                        EXPLORE
                    </Navbar.Item>
                    <Navbar.Item backgroundColor="dark" className="has-text-white-bis mr-mid">
                        THEATER
                    </Navbar.Item>
                    <Navbar.Item backgroundColor="dark">
                        <Form.Control fullwidth={true}>
                            <Form.Input placeholder="Search..."></Form.Input>
                            <Icon align="right">
                                <IconElement icon="fa-solid:search" />
                            </Icon>
                        </Form.Control>
                    </Navbar.Item>
                </div>
                <div className="navbar-end">
                    <Navbar.Item backgroundColor="dark">
                        <Icon size="medium">
                            <IconElement fontSize="21px" color="white" icon="ci:notification"></IconElement>
                        </Icon>
                    </Navbar.Item>
                    <Navbar.Item backgroundColor="dark">
                        <Button backgroundColor="blue" color="white" inverted={true} outlined={false} >Login</Button>
                    </Navbar.Item>
                </div>
            </Navbar.Menu>
        </Navbar>
    );
}
