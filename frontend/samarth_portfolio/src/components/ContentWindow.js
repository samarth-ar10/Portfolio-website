import React, { useState, useEffect, useRef } from 'react';
import './ContentWindow.css';
import AiTile from './AiTile';
import config from './config';

const URL = 'https://samarth-ar10.com:8000';

// Component for handling project tiles
function ProjectTile({ project, currentSlideIndex, setCurrentSlideIndex }) {
    const tileRef = useRef();

    const logEventToServer = async (eventType, data) => {
        try {
            const response = await fetch(URL + '/api/frontend_log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ event_type: eventType, data }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error logging event to server:', error);
        }
    };

    const handleNextSlide = () => {
        if (currentSlideIndex < project.slides.length - 1) {
            const newIndex = currentSlideIndex + 1;
            setCurrentSlideIndex(newIndex);
            // Log event for navigating to the next slide
            logEventToServer('navigateSlide', { action: 'Next slide', projectId: project.id, slideIndex: newIndex });
        }
    };

    const handlePreviousSlide = () => {
        if (currentSlideIndex > 0) {
            const newIndex = currentSlideIndex - 1;
            setCurrentSlideIndex(newIndex);
            // Log event for navigating to the previous slide
            logEventToServer('navigateSlide', { action: 'Previous slide', projectId: project.id, slideIndex: newIndex });
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        logEventToServer('slideViewed', {
                            action: 'Slide viewed',
                            projectId: project.id,
                            slideIndex: currentSlideIndex,
                        });
                    }
                });
            },
            { threshold: 0.5 }
        );

        if (tileRef.current) {
            observer.observe(tileRef.current);
        }

        return () => {
            if (tileRef.current) {
                observer.unobserve(tileRef.current);
            }
        };
    }, [currentSlideIndex, project.id]);

    const renderSlideContent = () => {
        const slide = project.slides[currentSlideIndex];
        console.log('Slide:', slide);
        console.log('Slide Type:', slide.slideType);
        let temp_url = slide.slideInformation;
        switch (slide.slideType) {
            case 'text':
                return <p>{slide.slideInformation}</p>;
            // return slide.slideInformation;
            case 'images':
                temp_url = URL + slide.slideInformation;
                return <img src={temp_url} alt={slide.slideDescription} className="slide-image media-content" />;
            case 'video':
                temp_url = URL + slide.slideInformation;
                return <video controls src={temp_url} className="slide-video media-content">Your browser does not support the video tag.</video>;
            case 'pdfs':
                temp_url = URL + slide.slideInformation;
                return (
                    <div className="pdf-container">
                        <embed src={temp_url} type="application/pdf" className="slide-pdf media-content" />
                        <div className="pdf-overlay" onClick={() => window.open(temp_url, '_blank')}></div>
                    </div>
                );
            case 'embeddedLink':
                temp_url = slide.slideInformation;
                // console.log('Iframe URL:', temp_url); // Log the URL to the console
                return (
                    <div className="iframe-container">
                        <iframe src={temp_url} title={slide.slideName} className="slide-embedded-link media-content"></iframe>
                        <div className="iframe-overlay" onClick={() => window.open(temp_url, '_blank')}></div>
                    </div>
                );
            default:
                return <p>Unsupported slide type</p>;
        }
    };

    return (
        <div className="project-tile-wrapper" ref={tileRef}>
            <div className="tile" id={project.id}>
                <button className="slide-nav-button left" onClick={(e) => { e.stopPropagation(); handlePreviousSlide(); }} disabled={currentSlideIndex === 0}>←</button>
                <div className="tile-content">
                    <h1>{project.slides[currentSlideIndex].slideName}</h1>
                    <div className="slide-content">
                        {renderSlideContent()}
                    </div>
                    {project.slides[currentSlideIndex].slideDescription && (
                        <div className="slide-description">
                            <p>{project.slides[currentSlideIndex].slideDescription}</p>
                        </div>
                    )}
                </div>
                <button className="slide-nav-button right" onClick={(e) => { e.stopPropagation(); handleNextSlide(); }} disabled={currentSlideIndex === project.slides.length - 1}>→</button>
            </div>
        </div>
    );
}

function ContentWindow() {
    const [projects, setProjects] = useState([]);
    const [currentSlideIndices, setCurrentSlideIndices] = useState({});

    const logEventToServer = async (eventType, data) => {
        try {
            const response = await fetch(URL + '/api/frontend_log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ event_type: eventType, data }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error logging event to server:', error);
        }
    };

    useEffect(() => {
        // Fetch presentation data from the Flask backend
        fetch(URL + '/api/presentations')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log('Fetched Data:', data); // Log the fetched data to debug JSON structure
                // Transform the fetched data into the required format for projects
                const fetchedProjects = Object.entries(data).map(([key, slides]) => {
                    if (!Array.isArray(slides) || slides.length === 0) {
                        console.warn(`Invalid or empty slides for project: ${key}`);
                        return null;
                    }
                    return {
                        id: key,
                        title: slides[0]?.['Presentation Name'] || 'Untitled Presentation',
                        presentationId: slides[0]?.['Presentation ID'] || '',
                        slides: slides.map(slide => ({
                            slideId: slide['Slide ID'],
                            slideName: slide['Slide Name'],
                            slideType: slide['Slide Type'],
                            slideInformation: slide['Slide Information'],
                            slideDescription: slide['Slide Description'],
                        }))
                    };
                }).filter(project => project !== null);
                // Sort projects by presentation ID
                fetchedProjects.sort((a, b) => a.presentationId - b.presentationId);
                setProjects(fetchedProjects);
                // Log event for projects retrieval
                logEventToServer('projectsRetrieved', { action: 'Projects retrieved successfully', projectList: fetchedProjects });
                // Initialize slide indices for each project
                const initialSlideIndices = fetchedProjects.reduce((acc, project) => {
                    acc[project.id] = 0;
                    return acc;
                }, {});
                setCurrentSlideIndices(initialSlideIndices);
            })
            .catch((error) => {
                console.error('Error fetching presentations:', error);
                alert('Error fetching presentations. Please check the console for more details.');
                // Log event for fetch error
                logEventToServer('fetchError', { action: 'Error fetching presentations', error: error.message });
            });
    }, []);

    const setCurrentSlideIndex = (projectId, index) => {
        setCurrentSlideIndices(prevIndices => ({
            ...prevIndices,
            [projectId]: index,
        }));
        // Log an event whenever the slide index is updated
        logEventToServer('slideIndexUpdated', { action: 'Slide index updated', projectId, newIndex: index });
    };

    return (
        <main className="content-window">
            <section className="ai-presentation">
                <AiTile />
            </section>
            <section className="project-tiles">
                {projects.map((project) => (
                    <ProjectTile
                        key={project.id}
                        project={project}
                        currentSlideIndex={currentSlideIndices[project.id] || 0}
                        setCurrentSlideIndex={(index) => setCurrentSlideIndex(project.id, index)}
                    />
                ))}
            </section>
        </main>
    );
}

export default ContentWindow;

// Comments for Logging:
// 1. 'navigateSlide': Logged when navigating between slides (either next or previous slide).
// 2. 'projectsRetrieved': Logged when projects are successfully retrieved from the backend.
// 3. 'fetchError': Logged when there's an error fetching presentations from the backend.
// 4. 'slideIndexUpdated': Logged when the current slide index for a project is updated.
// 5. 'slideViewed': Logged when a slide comes into the visible area (tracked
