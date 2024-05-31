import Link from "next/link";
import router from "next/router";
import { Navbar, Container, Row, Col, Nav } from "react-bootstrap";

const Footer = () => {
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
return(
<Navbar bg="primary" variant="dark" expand="lg" fixed="bottom" style={{height:'7vh'}}>
                <Container className="d-flex" style={{ flexWrap: 'nowrap', height:'5vh'}}>
                    <Container >
                                <Row >
                                <Col xs={3} md={3}>
                                    <Link href="/" passHref legacyBehavior  >
                                        <Nav.Link>
                                            <img onClick={handleNavigation} src="https://cdn-icons-png.flaticon.com/512/25/25694.png" alt="" style={{height:'6vh',marginLeft:'10px'}}/>
                                        </Nav.Link>
                                    </Link>
                                </Col>
                                <Col xs={3} md={3}>
                                    <Link href="/newQuestion" passHref legacyBehavior  >
                                        <Nav.Link>
                                            <img src="https://cdn3.iconfinder.com/data/icons/basic-user-interface-application/32/INSTAGRAM_ICON_SETS-03-512.png" alt=""style={{height:'6vh',marginLeft:'10px'}} />
                                        </Nav.Link>
                                    </Link>
                                </Col>
                                <Col xs={3} md={3}>
                                    <Link href="/" passHref legacyBehavior  >
                                        <Nav.Link>
                                            <img  src="https://static-00.iconduck.com/assets.00/notification-icon-1842x2048-xr57og4y.png" alt="" style={{height:'6vh',marginLeft:'10px'}}/>
                                        </Nav.Link>
                                    </Link>
                                </Col>
                                <Col xs={3} md={3}>
                                    <Link href="/hotTopic" passHref legacyBehavior  >
                                        <Nav.Link>
                                            <img  src="https://cdn.icon-icons.com/icons2/2578/PNG/512/trophy_icon_153952.png" alt="" style={{height:'6vh',marginLeft:'10px'}}/>
                                        </Nav.Link>
                                    </Link>
                                </Col>
                                </Row>
                    </Container>
                </Container>
            </Navbar>
            )
        }
export default Footer;