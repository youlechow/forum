import Link from 'next/link';
import React, { useState } from 'react';
import { Button, Container, Form, InputGroup, Nav, Navbar, Offcanvas, Stack,Row,Col} from 'react-bootstrap';
import styles from '../app/page.module.css';
import { useRouter } from 'next/router';

const Layout = () => {
    const [show, setShow] = useState(false);
    const router = useRouter();
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleNavigation = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (router.pathname === '/') {
            // Reload the page if already on the target page
            router.reload();
        } else {
            // Navigate to the target page
            router.push('/');
        }
    };
    
    return (
        <>
            <Navbar bg="primary" variant="dark" expand="lg">
    <Container className="d-flex" style={{ flexWrap: 'nowrap', height:'5vh'}}> 
        
        <img src="https://www.shareicon.net/download/2015/08/31/93855_home_512x512.png" alt="" onClick={handleShow} style={{height:'8vh',}}/>
                <Offcanvas show={show} onHide={handleClose} style={{ width: '40vh', position: 'absolute' }}>
                    <Offcanvas.Header>
                        <Link href="" passHref legacyBehavior  >
                                    <Nav.Link onClick={handleClose}>
                                        <img className={styles.footerImg} src="https://static.thenounproject.com/png/636010-200.png" alt="" />
                                    </Nav.Link>
                                </Link>
                        <Offcanvas.Title style={{ paddingLeft: 70 }}>Menu</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Stack gap={4} style={{fontWeight:'bold'}}>
                            <Link href="/" passHref legacyBehavior  >
                                    <Nav.Link >
                                        Achievement
                                    </Nav.Link>
                                </Link>
                                <Link href="/" passHref legacyBehavior  >
                                    <Nav.Link >
                                        Help
                                    </Nav.Link>
                                </Link>
                                <Link href="/" passHref legacyBehavior  >
                                    <Nav.Link >
                                        Settings
                                    </Nav.Link>
                                </Link>
                                <Link href="/" passHref legacyBehavior  >
                                    <Nav.Link >
                                        Logout
                                    </Nav.Link>
                                </Link>
                            </Stack>
                    </Offcanvas.Body>
                </Offcanvas>
                <InputGroup className="flex-grow-1">
                    <Form.Control
                        placeholder="Search"
                        aria-label="Search"
                    />
                    <Button variant="outline-dark" id="button-addon2">
                        <img src="https://static.thenounproject.com/png/358016-200.png" alt="" style={{height:'3vh'}}/>
                    </Button>
                </InputGroup>
            </Container>
        </Navbar>


            
        </>
    );
};

export default Layout;
