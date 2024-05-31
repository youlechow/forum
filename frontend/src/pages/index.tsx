import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import styles from '../app/page.module.css';
import Layout from '../components/Layout';
import Footer from '../components/Footer';
import { Spinner } from 'react-bootstrap';

interface Item {
    id: number;
    photo: string | null;
    title: string;
    content: string;
    created_at: string;
    user: User;
    question: Question;
    likes: number;
    dislikes: number;
    photo_urls: string;
    media_url: string | null;
}

interface User {
    name: string;
    id: number;
}

interface Question {
    id: string;
}

interface Follow {
    id: string;
}

const YourComponent = () => {
    const [follow, setFollow] = useState<Item[]>([]);
    const [latest, setLatest] = useState<Item[]>([]);
    const [hot, setHot] = useState<Item[]>([]);
    const [answer, setAnswer] = useState<Item[]>([]);
    const [likeActive, setLikeActive] = useState<Record<number, boolean>>({});
    const [dislikeActive, setDislikeActive] = useState<Record<number, boolean>>({});
    const [latestPage, setLatestPage] = useState(1);
    const [followPage, setFollowPage] = useState(1);
    const [answerPage, setAnswerPage] = useState(1);
    const [hotPage, setHotPage] = useState(1);
    const [latestHasMore, setLatestHasMore] = useState(true);
    const [followHasMore, setFollowHasMore] = useState(true);
    const [answerHasMore, setAnswerHasMore] = useState(true);
    const [hotHasMore, setHotHasMore] = useState(true);
    const [activeTab, setActiveTab] = useState<string>('Latest');
    const [show, setShow] = useState(false);

    const fetchData = useCallback(async () => {
    
        let page;
            if(activeTab === 'Latest'){
                page = latestPage;
            }else if(activeTab === 'Follow'){
                page = followPage;
            }else if( activeTab === 'Answer'){
                page = answerPage;
            }else if(activeTab === 'Hot'){ 
                page = hotPage;
            }
            
            
        try {
            const response = await fetch(`http://localhost:8000/api/${activeTab}?page=${page}`);
            const jsonData = await response.json();
            switch (activeTab) {
                case 'Latest':
                    setLatest((prevData) => [...prevData, ...jsonData.data]);
                    setLatestHasMore(jsonData.current_page < jsonData.last_page);
                    break;
                case 'Follow':
                    setFollow((prevData) => [...prevData, ...jsonData.data]);
                    setFollowHasMore(jsonData.current_page < jsonData.last_page);
                    break;
                case 'Answer':
                    setAnswer((prevData) => [...prevData, ...jsonData.data]);
                    setAnswerHasMore(jsonData.current_page < jsonData.last_page);
                    break;
                case 'Hot':
                    setHot((prevData) => [...prevData, ...jsonData.data]);
                    setHotHasMore(jsonData.current_page < jsonData.last_page);
                    break;
                default:
                    return;
            }
            if(response.ok){
                setShow(false);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    },[activeTab,latestPage,followPage,answerPage,hotPage]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    useEffect(() => {
        const handleScroll = () => {
        
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight-1) {
                if(activeTab === 'Latest' && latestHasMore){
                    setShow(true);
                    setTimeout(()=>{
                        setLatestPage(prevLatestPage => prevLatestPage + 1);
                    },1000);
                }else if(activeTab === 'Answer' && answerHasMore){
                    setShow(true);
                    setTimeout(()=>{
                        setAnswerPage(prevAnswerPage => prevAnswerPage + 1);
                    },1000);
                }else if(activeTab === 'Follow' && followHasMore){
                    setShow(true);
                    setTimeout(()=>{
                        setFollowPage(prevFollowPage => prevFollowPage + 1);
                    },1000);
                }else if(activeTab === 'Hot' && hotHasMore){
                    setShow(true);
                    setTimeout(()=>{
                        setHotPage(prevHotPage => prevHotPage + 1);
                    },1000);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [activeTab, latestHasMore, followHasMore, answerHasMore, hotHasMore]);

    const handleTabSelect = (key: string | null) => {
        
        if (key) {
            setActiveTab(key);
            
        }
    };

    const like = async (itemId: number) => {
        const isActive = !likeActive[itemId];
        setLikeActive((prev) => ({ ...prev, [itemId]: isActive }));

        try {
            const response = await fetch(`http://localhost:8000/api/like/${itemId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ like: isActive }),
            });
            if (response.ok) {
                const updatedData = latest.map((item) =>
                    item.id === itemId ? { ...item, likes: item.likes} : item
                );
                setLatest(updatedData);
            } else {
                console.error('Failed to update like');
            }
        } catch (error) {
            console.error('Error updating like:', error);
        }
    };

    const dislike = async (itemId: number) => {
        const isActive = !dislikeActive[itemId];
        setDislikeActive((prev) => ({ ...prev, [itemId]: isActive }));

        try {
            await fetch(`http://localhost:8000/api/dislike/${itemId}`, {
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

    const view = async (itemId: number) => {
        try {
            await fetch(`http://localhost:8000/api/view/${itemId}`, {
                method: 'POST',
            });
        } catch (error) {
            console.error('Error updating view:', error);
        }
    };
    

    const renderItems =(items:Item[]) => {
        return items.length > 0? (
        items.map((item,index) => (
            <div key={`hot-${item.id}-${index}`}>
                <div style={{marginLeft:'5px'}}>
                    <div>
                        <Link href={`/question/${item.id}`} legacyBehavior>
                            <a onClick={()=>view(item.id)}>
                                <h4>{item.title}</h4>
                                </a>
                        </Link>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <div style={{ width: '6vh' }}>
                            <img src="https://cdn-icons-png.freepik.com/256/552/552848.png?semt=ais_hybrid" alt="" style={{ height: '5vh' }} />
                        </div>
                        <div style={{ width: 'auto', flexDirection: 'column', marginTop: '-3px' }}>
                            <div style={{ flex: '1', fontWeight: 'bold', fontSize: '15px' }}>{item.user.name}</div>
                            <div style={{ flex: '1', fontSize: '12px', marginTop: '-3px' }}>{new Date(item.created_at).toLocaleDateString()}</div>
                        </div>
                    </div>
                    {item.photo_urls.length > 0 ? (
                        <img src={item.photo_urls} alt="" style={{ maxWidth: '340px', height: 'auto' }} />
                    ) : null}
                    <div style={{ marginTop: '5px' }}>
                        <h6>{item.content}</h6>
                    </div>
                    <div style={{ height: '4vh', marginBottom: '10px' }}>
                        <div style={{ height: '100%', float: 'left', marginRight: '5px' }}>
                            <img
                                src="https://www.veryicon.com/download/png/miscellaneous/yuanql/icon-like?s=256"
                                alt=""
                                style={{ height: '100%' }}
                                onClick={() => like(item.id)}
                            /> ·{item.likes + (likeActive[item.id] ? 1 : 0)}
                        </div>
                        <div style={{ height: '100%' }}>
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/880/880613.png"
                                alt=""
                                style={{ height: '100%', marginTop: '5px' }}
                                onClick={() => dislike(item.id)}
                            /> ·{item.dislikes + (dislikeActive[item.id] ? 1 : 0)}
                        </div>
                    </div>
                </div>
                <div className={styles.newline}></div>
                
            </div>
            
        ))
    ): null
    }
    return (
        <>
        <Layout />
            {show && <Spinner variant='primary' animation="border" role="status" style={{position:'fixed',right:'50%'}}></Spinner>}
                            
            <div style={{ height: '85.5vh'}} className={styles.wordwrap}>
                <Tabs
                    defaultActiveKey="Latest"
                    id="justify-tab-example"
                    className="mb-3"
                    onSelect={handleTabSelect}
                >
                    <Tab eventKey="Follow" title="Follow" style={{ height: '77vh',overflow: !followHasMore ? 'scroll':'visible'  }}>
                        {renderItems(follow)}
                        {!followHasMore && <p>No more to load.....</p>}
                    </Tab>
                    <Tab eventKey="Latest" title="Latest" style={{ height: '77vh',overflow: !latestHasMore ? 'scroll':'visible' }}>
                        {renderItems(latest)}
                        {!latestHasMore && <p>No more to load</p>}
                    </Tab>
                    <Tab eventKey="Answer" title="Answer" style={{ height: '77vh' ,overflow: !answerHasMore ? 'scroll':'visible' }}>
                        {renderItems(answer)}
                        {!hotHasMore && <p>No more to load.....</p>}
                    </Tab>
                    <Tab eventKey="Hot" title="Hot" style={{ height: '77vh',overflow: !hotHasMore ? 'scroll':'visible' }}>
                        {renderItems(hot)}
                        {!hotHasMore && <p>No more to load.....</p>}
                    </Tab>
                        
                </Tabs>
            </div>
            <Footer/>
            
        </>
    );
};

export default YourComponent;
