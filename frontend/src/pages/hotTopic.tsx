    import Header from '../components/Layout';
    import Footer from '../components/Footer';
    import 'bootstrap/dist/css/bootstrap.min.css';
    import { useEffect, useState } from 'react';
import { Stack } from 'react-bootstrap';


    const HotTopic = () => {
    const [topic, setTopicIds] = useState<[]>([]);

    useEffect(() => {
        const fetchTopicData = async () => {
        try {
            const topicResponse = await fetch('http://localhost:8000/api/topic');
            if (!topicResponse.ok) {
            throw new Error('Network response was not ok');
            }
            const topicData = await topicResponse.json();
            setTopicIds(topicData);
        } catch (error) {
            console.error('Error fetching topics:', error);
        }
        };

        fetchTopicData();
    }, []);

    return (
        <>
        <Header />
        <div style={{marginLeft:'5px',height:'85.5vh',overflow:'scroll'}}>
        <h2>Hot Topics</h2>
        <Stack gap={10}>
        {topic.map((topics, index) => (
                <div className="p-2" key={index}>{index+1}. {topics}</div>
        ))}
        </Stack>
        </div>
        <Footer />
        </>
    );
    }

    export default HotTopic;
