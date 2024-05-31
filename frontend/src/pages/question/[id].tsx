import styles from '@/app/page.module.css';
import Layout from '@/components/Layout'; // Make sure this path is correct
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/router';
import { useEffect, useState, FormEvent } from 'react';
import { InputGroup, Form, Button, Accordion,useAccordionButton, CardBody, Card, Collapse, ToggleButton  } from 'react-bootstrap';
import Footer from '../../components/Footer';
interface User {
    name: string;
    id: number;
}

interface Comment {
    id: number;
    content: string;
    user: User;
    created_at: string;
    likes: number;
    dislikes: number;
}

interface Answer {
    id: number;
    content: string;
    user: User;
    created_at: string;
    likes: number;
    dislikes: number;
    comments: Comment[];
}

interface Question {
    id: number;
    title: string;
    likes: number;
    dislikes: number;
    content: string;
    user: User;
    created_at: string;
    answers: Answer[]; // Include answers in the question interface
    photo_urls:string;
}

const QuestionDetail = () => {
    const [question, setQuestion] = useState<Question | null>(null);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const router = useRouter();
    const { id } = router.query;
    const [likeActive, setLikeActive] = useState<Record<number, boolean>>({});
    const [dislikeActive, setDislikeActive] = useState<Record<number, boolean>>({});
    const [content, setContent] = useState('');
    const [Commentcontent, setCommentContent] = useState('');
    const [contentEmpty, setContentEmpty] = useState('');
    const [openAnswerId, setOpenAnswerId] = useState<number | null>(null);
    const toggleCollapse = (answerId: number) => {
        setOpenAnswerId((prevOpenAnswerId) => (prevOpenAnswerId === answerId ? null : answerId));
    };
    const fetchQuestionData = async () => {
        if (id) {
            try {
                const questionResponse = await fetch(`http://localhost:8000/api/question/${id}`);
                if (!questionResponse.ok) {
                    throw new Error('Failed to fetch question');
                }

                const data = await questionResponse.json();
                setQuestion(data); // Assuming this contains answers array
                setAnswers(data.answers); // Set answers directly from the question data
            } catch (error) {
                console.error('Error fetching question:', error);
            }
        }
    };

    useEffect(() => {
        fetchQuestionData();
    }, [id]);

    if (!question) {
        return <Layout />;
    }

    const updateLikes = (itemId: number, isActive: boolean, type: string) => {
        let updatedData;
        switch (type) {
            case 'question':
                updatedData = {
                    ...question,
                    likes: question.likes + (isActive ? 1 : -1)
                };
                setQuestion(updatedData);
                break;
            case 'answer':
                updatedData = answers.map(answer =>
                    answer.id === itemId
                        ? { ...answer, likes: answer.likes + (isActive ? 1 : -1) }
                        : answer
                );
                setAnswers(updatedData);
                break;
            case 'comment':
                updatedData = answers.map(answer => ({
                    ...answer,
                    comments: answer.comments.map(comment =>
                        comment.id === itemId
                            ? { ...comment, likes: comment.likes + (isActive ? 1 : -1) }
                            : comment
                    )
                }));
                setAnswers(updatedData);
                break;
            default:
                break;
        }
    };

    const likeItem = async (itemId: number, type: string) => {
        const isActive = !likeActive[itemId];
        setLikeActive((prev) => ({ ...prev, [itemId]: isActive }));
    
        try {
            let response;
            
            if (type === 'question') {
                response = await fetch(`http://localhost:8000/api/like/${itemId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ like: isActive }),
                });
            } else if (type === 'answer') {
                response = await fetch(`http://localhost:8000/api/answerlike/${itemId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ like: isActive }),
                });
            } else if (type === 'comment') {
                response = await fetch(`http://localhost:8000/api/commentlike/${itemId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ like: isActive }),
                });
            }
    
        } catch (error) {
            console.error('Error updating like:', error);
        }
    };
    

    const dislikeItem = async (itemId: number, type: string) => {
        const isActive = !dislikeActive[itemId];
        setDislikeActive((prev) => ({ ...prev, [itemId]: isActive }));

        const endpointMap = {
            question: 'dislike',
            answer: 'answerdislike',
            comment: 'commentdislike'
        };

        try {
            const response = await fetch(`http://localhost:8000/api/dislike/${itemId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ dislike: isActive }),
            });

        } catch (error) {
            console.error('Error updating dislike:', error);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!content) {
            setContentEmpty('Content required.');
            return;
        }

        setContentEmpty('');

        const formData = new FormData();
        formData.append('content', content);
        formData.append('parent_id', question.id.toString()); // Convert number to string

        try {
            const response = await fetch('http://localhost:8000/api/submitAnswer', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setContent('');
                fetchQuestionData();
            } else {
                const data = await response.json();
                alert(`Error: ${data.message}`);
            }
        } catch (error: unknown) {
            console.error('Error:', error);
            if (error instanceof Error) {
                alert(`Error: ${error.message}`);
            } else {
                alert('An unexpected error occurred');
            }
        }
    };
    
    const handleCommentSubmit = async (e: FormEvent,answerID:number) => {
        e.preventDefault();

        if (!Commentcontent) {
            setContentEmpty('Content required.');
            return;
        }

        setContentEmpty('');

        const formData = new FormData();
        formData.append('content', Commentcontent);
        formData.append('parent_id', answerID.toString()); // Convert number to string

        try {
            const response = await fetch('http://localhost:8000/api/submitComment', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                },
            });


            if (response.ok) {
                const data = await response.json();
                setCommentContent('');
                fetchQuestionData();
            } else {
                const data = await response.json();
                alert(`Error: ${data.message}`);
            }
        } catch (error: unknown) {
            console.error('Error:', error);
            if (error instanceof Error) {
                alert(`Error: ${error.message}`);
            } else {
                alert('An unexpected error occurred');
            }
        }
    };

    return (
        <>
        <Layout />
            <div className={styles.wordwrap} style={{}}>
                <div style={{height:'78.5vh',overflow:'scroll'}}>
                <h1>{question.title}</h1>
                <div style={{ display: 'flex' }}>
                    <div style={{ width: '6vh' }}>
                        <img src="https://cdn-icons-png.freepik.com/256/552/552848.png" alt="" style={{ height: '5vh' }} />
                    </div>
                    <div style={{ width: 'auto', flexDirection: 'column', marginTop: '-3px' }}>
                        <div style={{ flex: '1', fontWeight: 'bold', fontSize: '15px' }}>{question.user.name}</div>
                        <div style={{ flex: '1', fontSize: '12px', marginTop: '-3px' }}>{new Date(question.created_at).toLocaleDateString()}</div>
                    </div>
                </div>
                <h4>{question.content}</h4>
                {question.photo_urls.length>0 ?(
                                        <img src={question.photo_urls} alt={''} style={{ maxWidth: '100%', height: 'auto',padding:'10px' }} />
                                    
                                    ):null}
                <div style={{ height: '4vh', marginBottom: '10px' }}>
                    <div style={{ height: '100%', float: 'left', marginRight: '5px' }}>
                        <img
                            src="https://www.veryicon.com/download/png/miscellaneous/yuanql/icon-like?s=256"
                            alt=""
                            style={{ height: '100%' }}
                            onClick={() => likeItem(question.id, 'question')}
                        /> <div style={{ float: 'right', padding: '3px', color: 'gray' }}>·{question.likes + (likeActive[question.id] ? 1 : 0)}</div>
                    </div>
                    <div style={{ height: '100%' }}>
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/880/880613.png"
                            alt=""
                            style={{ height: '100%', marginTop: '5px', float: 'left' }}
                            onClick={() => dislikeItem(question.id, 'question')}
                        /> <div style={{ float: 'left', color: 'gray', padding: '3px' }}>·{question.dislikes + (dislikeActive[question.id] ? 1 : 0)}</div>
                    </div>
                </div>
                <div className={styles.newline}></div>

                <h2>Answers</h2>
                {answers.length > 0 ? (
                    answers.map((answer) => (
                        <div key={answer.id} style={{ marginBottom: '1  0px' }}>
                            <div style={{ display: 'flex' }}>
                                <div style={{ width: '6vh' }}>
                                    <img src="https://cdn-icons-png.freepik.com/256/552/552848.png" alt="" style={{ height: '5vh' }} />
                                </div>
                                <div style={{ width: 'auto', display: 'flex', flexDirection: 'column', marginTop: '-3px', marginLeft: '6px' }}>
                                    <div style={{ display: 'flex', width: '100%' }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '15px', float: 'left' }}>
                                            {answer.user.name}
                                        </div>
                                        <div style={{ color: 'gray', padding: '2px', float: 'right', fontSize: '13px' }}>
                                            ·{new Date(answer.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div style={{ flex: '1', fontSize: '15px', marginTop: '-3px' }}>{answer.content}</div>
                                    <div style={{ height: '4vh', marginBottom: '10px' }}>
                                        <div style={{ height: '100%', float: 'left',alignItems:'center'}}>
                                            <img
                                                src="https://www.veryicon.com/download/png/miscellaneous/yuanql/icon-like?s=256"
                                                alt=""
                                                style={{ height: '100%' }}
                                                onClick={() => likeItem(answer.id, 'answer')}
                                            /> 
                                            <div style={{ float: 'right', color: 'gray',padding:'6px' }}>·{answer.likes + (likeActive[answer.id] ? 1 : 0)}</div>
                                        </div>
                                        <div style={{float:'left',height:'1vh'}}>
                                        <Button
                                            onClick={() => toggleCollapse(answer.id)}
                                            aria-controls={`collapse-${answer.id}`}
                                            aria-expanded={openAnswerId === answer.id}
                                            variant='white'
                                            style={{height:'5vh',width:'5vh',padding:0}}
                                        >
                                            <img src="https://icons.veryicon.com/png/o/hardware/jackdizhu_pc/comment-25.png" style={{float:'left',height:'5vh'}} alt="" />
                                        </Button>
                                        
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div >
                                {answer.comments.length > 0 ? (
                                    answer.comments.map((comment) => (
                                        <div key={comment.id} style={{ marginLeft: '6vh', marginBottom: '10px' }}>
                                            <div style={{ display: 'flex' }}>
                                                <div style={{ width: '5vh', marginRight: '5px' }}>
                                                    <img src="https://cdn-icons-png.freepik.com/256/552/552848.png" alt="" style={{ height: '4vh' }} />
                                                </div>
                                                <div style={{ width: 'auto', display: 'flex', flexDirection: 'column', marginTop: '-3px' }}>
                                                    <div style={{ display: 'flex', width: '100%' }}>
                                                        <div style={{ fontWeight: 'bold', fontSize: '14px', float: 'left' }}>
                                                            {comment.user.name}
                                                        </div>
                                                        <div style={{ color: 'gray', padding: '2px', float: 'right', fontSize: '12px' }}>
                                                            ·{new Date(comment.created_at).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    <div style={{ flex: '1', fontSize: '14px', marginTop: '-3px' }}>{comment.content}</div>
                                                    <div style={{ height: '4vh', marginBottom: '10px' }}>
                                                        <div style={{ height: '100%', float: 'left', marginRight: '5px' }}>
                                                            <img
                                                                src="https://www.veryicon.com/download/png/miscellaneous/yuanql/icon-like?s=256"
                                                                alt=""
                                                                style={{ height: '100%' }}
                                                                onClick={() => likeItem(comment.id, 'comment')}
                                                            /> <div style={{ float: 'right', padding: '3px', color: 'gray' }}>·{comment.likes + (likeActive[comment.id] ? 1 : 0)}</div>
                                                        </div>
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))

                                ) : (
                                    ''
                                )}
                                <Collapse in={openAnswerId === answer.id } >
                                <div >
                                    <div style={{display:'flex'}}>
                                    <img src="https://cdn-icons-png.freepik.com/256/552/552848.png" alt="" style={{ height: '5vh',marginLeft:'6vh',marginBottom:'5px' }} />
                                    <InputGroup className="" style={{marginLeft:'5px',marginRight:'5px'}}>
                                        <Form.Control
                                            placeholder="Add an comment"
                                            aria-label="Username"
                                            aria-describedby="basic-addon1"
                                            value={Commentcontent}
                                            style={{borderRadius:'20px',marginRight:'5px'}}
                                            onChange={(e) => setCommentContent(e.target.value)} // Add this line to update the content state
                                        />
                                        <Button onClick={(e) => handleCommentSubmit(e,answer.id)} type="submit" style={{borderRadius:'20px'}}>
                                            submit
                                        </Button>
                                    </InputGroup>
                                    </div>
                                </div>
                            </Collapse>
                            </div>
                            
                            <div className={styles.newline} style={{ marginTop:'10px',marginBottom:'10px' }}></div>
                        </div>
                    ))
                ) : (
                    <h6>No answers yet.</h6>
                )}
                </div>
                <div style={{ position: 'fixed', bottom: '7vh', width: '100%', height: '7vh',flex:'1' }}>
                    <InputGroup  style={{ width: '100%', height: '90%' }}>
                        <img src="https://cdn-icons-png.freepik.com/256/552/552848.png" alt="" style={{ height: '100%',padding:'5px' }} />
                        <Form.Control
                            placeholder="Add an answer"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            value={content}
                            style={{borderRadius:'20px'}}
                            onChange={(e) => setContent(e.target.value)} // Add this line to update the content state
                        />
                        <Button onClick={handleSubmit} type="submit" style={{marginLeft:'10px',borderRadius:'20px'}}>
                            submit
                        </Button>
                    </InputGroup>
                </div>
                
            </div>
                <Footer/>
        </>
    );
};

export default QuestionDetail;
