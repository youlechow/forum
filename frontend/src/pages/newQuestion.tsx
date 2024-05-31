import Layout from '@/components/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import Footer from '../components/Footer';
const NewQuestion = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null); // State for image preview
    const [titleEmpty, setTitleEmpty] = useState('');
    const [contentEmpty, setContentEmpty] = useState('');
    const router = useRouter();
    const [photoError, setPhotoError] = useState('');
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

            if (!validImageTypes.includes(file.type)) {
                setPhotoError('Invalid file type. Please select an image file (jpeg, png, gif).');
                setPhoto(null);
                setPhotoPreview(null);
                return;
            }

            setPhotoError(''); // Clear any previous photo errors
            setPhoto(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }else{
            setPhotoPreview(null);
            setPhotoError('');
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (photo) {
            formData.append('photo', photo);
        }

        try {
            const response = await fetch('http://localhost:8000/api/submitQuestions', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                },
            });


            if (response.ok) {
                const data = await response.json();
                alert('Question submitted successfully!');
                setTitle('');
                setContent('');
                setPhoto(null);
                setPhotoPreview(null); // Clear the photo preview
                router.push('/');
            } else {
                const data = await response.json();
                alert(`Error: ${data.message}`);
            }
        } catch (error: unknown) {
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
        
            <div style={{height:'85vh',overflow:'scroll'}}>
                <Form style={{ padding: '10px' }} onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', marginBottom: '10px' }}>
                        <div style={{ width: '7vh' }}>
                            <img src="https://cdn-icons-png.freepik.com/256/552/552848.png?semt=ais_hybrid" alt="" style={{ height: '6vh' }} />
                        </div>
                        <div style={{ width: 'auto', flexDirection: 'column', marginTop: '-3px' }}>
                            <div style={{ flex: '1', fontWeight: 'bold', fontSize: '15px' }}>name</div>
                        </div>
                    </div>

                    <Form.Group className="mb-3" controlId="formBasicQuestion">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="What do you want to ask?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        
                    </Form.Group>
                    {titleEmpty && <div style={{ color: 'red', marginBottom: '10px' }}>{titleEmpty}</div>}
                    <Form.Group style={{ marginBottom: '10px' }}>
                        <Form.Label>Content</Form.Label>
                        <Form.Control
                            as="textarea"
                            required
                            style={{height:'30vh'}}
                            placeholder="Content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </Form.Group>
                    {contentEmpty && <div style={{ color: 'red', marginBottom: '10px' }}>{contentEmpty}</div>}
                    <Form.Group style={{ marginBottom: '10px' }}>
                        <Form.Label>Upload Photo</Form.Label>
                        <Form.Control
                            type="file"
                            name="photo"
                            onChange={handleFileChange}
                            isInvalid={!!photoError }
                        />
                    </Form.Group>
                    {photoError && <div style={{ color: 'red', marginBottom: '10px' }}>{photoError}</div>}
                    {photoPreview && (
                        <div style={{ marginBottom: '10px' }}>
                            <img src={photoPreview} alt="Preview" style={{ maxWidth: '300px', maxHeight: '300px',border:'ridge' }} />
                        </div>
                    )}
                    <div style={{padding:'5px',marginTop:'-15px'}}> *Only allow .jpg, .jpeg, .png</div>
                    <Form.Control.Feedback type="invalid" tooltip>
                        {photoError}
                    </Form.Control.Feedback>
                    <Button variant="primary" type="submit" disabled={!!photoError}>
                        Submit
                    </Button>
                </Form>
            </div>
            <Footer/>
        </>
    );
};

export default NewQuestion;
