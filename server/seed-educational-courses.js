const db = require('./config/db');

const educationalCourses = [
    {
        title: 'Python Programming Masterclass',
        category: 'Programming',
        description: 'Learn Python from scratch to advanced concepts. Master data structures, OOP, web development with Django, and real-world projects.',
        thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80',
        instructor_id: 1,
        sections: [
            {
                title: 'Python Basics',
                order_number: 1,
                lessons: [
                    {
                        title: 'Introduction to Python',
                        video_url: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
                        video_type: 'youtube',
                        duration: '4:26:52',
                        order_number: 1,
                        description: 'Complete Python beginner tutorial covering all fundamentals'
                    },
                    {
                        title: 'Variables and Data Types',
                        video_url: 'https://www.youtube.com/watch?v=khKv-8q7YmY',
                        video_type: 'youtube',
                        duration: '22:17',
                        order_number: 2,
                        description: 'Understanding Python variables, strings, numbers, and booleans'
                    },
                    {
                        title: 'Control Flow and Loops',
                        video_url: 'https://www.youtube.com/watch?v=Z4A3S4PjGcU',
                        video_type: 'youtube',
                        duration: '28:45',
                        order_number: 3,
                        description: 'If statements, for loops, while loops, and logical operators'
                    }
                ]
            },
            {
                title: 'Functions and Modules',
                order_number: 2,
                lessons: [
                    {
                        title: 'Creating Functions',
                        video_url: 'https://www.youtube.com/watch?v=9Os0o3wzS_I',
                        video_type: 'youtube',
                        duration: '18:30',
                        order_number: 1,
                        description: 'Defining functions, parameters, return values, and scope'
                    },
                    {
                        title: 'Modules and Packages',
                        video_url: 'https://www.youtube.com/watch?v=1RuMJ53CKds',
                        video_type: 'youtube',
                        duration: '15:42',
                        order_number: 2,
                        description: 'Importing modules, creating packages, and using pip'
                    }
                ]
            },
            {
                title: 'Object-Oriented Programming',
                order_number: 3,
                lessons: [
                    {
                        title: 'Classes and Objects',
                        video_url: 'https://www.youtube.com/watch?v=JeznW_7DlB0',
                        video_type: 'youtube',
                        duration: '32:15',
                        order_number: 1,
                        description: 'Understanding OOP principles in Python'
                    },
                    {
                        title: 'Inheritance and Polymorphism',
                        video_url: 'https://www.youtube.com/watch?v=Cn7AkDb4pIU',
                        video_type: 'youtube',
                        duration: '24:08',
                        order_number: 2,
                        description: 'Advanced OOP concepts and design patterns'
                    }
                ]
            }
        ]
    },
    {
        title: 'Web Development Bootcamp 2024',
        category: 'Web Development',
        description: 'Complete full-stack web development course covering HTML, CSS, JavaScript, React, Node.js, and MongoDB.',
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
        instructor_id: 1,
        sections: [
            {
                title: 'HTML5 Fundamentals',
                order_number: 1,
                lessons: [
                    {
                        title: 'HTML Basics and Structure',
                        video_url: 'https://www.youtube.com/watch?v=pQN-pnXPaVg',
                        video_type: 'youtube',
                        duration: '1:09:33',
                        order_number: 1,
                        description: 'Complete HTML tutorial for beginners'
                    },
                    {
                        title: 'Forms and Input Elements',
                        video_url: 'https://www.youtube.com/watch?v=fNcJuPIZ2WE',
                        video_type: 'youtube',
                        duration: '45:20',
                        order_number: 2,
                        description: 'Creating forms, inputs, validation, and accessibility'
                    }
                ]
            },
            {
                title: 'CSS3 Styling',
                order_number: 2,
                lessons: [
                    {
                        title: 'CSS Fundamentals',
                        video_url: 'https://www.youtube.com/watch?v=1PnVor36_40',
                        video_type: 'youtube',
                        duration: '1:25:10',
                        order_number: 1,
                        description: 'Selectors, properties, box model, and layouts'
                    },
                    {
                        title: 'Flexbox and Grid',
                        video_url: 'https://www.youtube.com/watch?v=t6CBLfXdk9o',
                        video_type: 'youtube',
                        duration: '38:45',
                        order_number: 2,
                        description: 'Modern CSS layout techniques'
                    },
                    {
                        title: 'Responsive Design',
                        video_url: 'https://www.youtube.com/watch?v=srvUrASNj0s',
                        video_type: 'youtube',
                        duration: '42:18',
                        order_number: 3,
                        description: 'Media queries, mobile-first design, and breakpoints'
                    }
                ]
            },
            {
                title: 'JavaScript Essentials',
                order_number: 3,
                lessons: [
                    {
                        title: 'JavaScript Basics',
                        video_url: 'https://www.youtube.com/watch?v=PkZNo7MFNFg',
                        video_type: 'youtube',
                        duration: '3:26:42',
                        order_number: 1,
                        description: 'Complete JavaScript tutorial from zero to hero'
                    },
                    {
                        title: 'DOM Manipulation',
                        video_url: 'https://www.youtube.com/watch?v=5fb2aPlgoys',
                        video_type: 'youtube',
                        duration: '35:22',
                        order_number: 2,
                        description: 'Selecting elements, events, and dynamic content'
                    },
                    {
                        title: 'Async JavaScript',
                        video_url: 'https://www.youtube.com/watch?v=PoRJizFvM7s',
                        video_type: 'youtube',
                        duration: '28:33',
                        order_number: 3,
                        description: 'Promises, async/await, fetch API, and AJAX'
                    }
                ]
            }
        ]
    },
    {
        title: 'Data Science and Machine Learning',
        category: 'Data Science',
        description: 'Master data analysis, visualization, machine learning algorithms, and deep learning with Python.',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
        instructor_id: 1,
        sections: [
            {
                title: 'Data Analysis with Pandas',
                order_number: 1,
                lessons: [
                    {
                        title: 'Introduction to Pandas',
                        video_url: 'https://www.youtube.com/watch?v=vmEHCJofslg',
                        video_type: 'youtube',
                        duration: '1:10:20',
                        order_number: 1,
                        description: 'DataFrames, Series, and basic operations'
                    },
                    {
                        title: 'Data Cleaning and Preprocessing',
                        video_url: 'https://www.youtube.com/watch?v=iaZQF8SLHJs',
                        video_type: 'youtube',
                        duration: '45:30',
                        order_number: 2,
                        description: 'Handling missing data, duplicates, and transformations'
                    }
                ]
            },
            {
                title: 'Data Visualization',
                order_number: 2,
                lessons: [
                    {
                        title: 'Matplotlib and Seaborn',
                        video_url: 'https://www.youtube.com/watch?v=0P7QNZIQmG4',
                        video_type: 'youtube',
                        duration: '52:15',
                        order_number: 1,
                        description: 'Creating charts, plots, and statistical visualizations'
                    },
                    {
                        title: 'Interactive Dashboards',
                        video_url: 'https://www.youtube.com/watch?v=JwSS70SZdyM',
                        video_type: 'youtube',
                        duration: '38:40',
                        order_number: 2,
                        description: 'Building dashboards with Plotly and Dash'
                    }
                ]
            },
            {
                title: 'Machine Learning Fundamentals',
                order_number: 3,
                lessons: [
                    {
                        title: 'ML Introduction and Scikit-Learn',
                        video_url: 'https://www.youtube.com/watch?v=7eh4d6sabA0',
                        video_type: 'youtube',
                        duration: '1:15:30',
                        order_number: 1,
                        description: 'Supervised vs unsupervised learning, model training'
                    },
                    {
                        title: 'Regression and Classification',
                        video_url: 'https://www.youtube.com/watch?v=ukzFI9rgwfU',
                        video_type: 'youtube',
                        duration: '48:22',
                        order_number: 2,
                        description: 'Linear regression, logistic regression, and evaluation metrics'
                    }
                ]
            }
        ]
    },
    {
        title: 'React.js - The Complete Guide',
        category: 'Web Development',
        description: 'Master React 18+ with Hooks, Redux Toolkit, Next.js, and build production-ready applications.',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
        instructor_id: 1,
        sections: [
            {
                title: 'React Fundamentals',
                order_number: 1,
                lessons: [
                    {
                        title: 'React Basics and JSX',
                        video_url: 'https://www.youtube.com/watch?v=Ke90Tje7VS0',
                        video_type: 'youtube',
                        duration: '2:25:30',
                        order_number: 1,
                        description: 'Components, props, JSX syntax, and rendering'
                    },
                    {
                        title: 'State and Props',
                        video_url: 'https://www.youtube.com/watch?v=4ORZ1GmjaMc',
                        video_type: 'youtube',
                        duration: '32:15',
                        order_number: 2,
                        description: 'Understanding component state and data flow'
                    },
                    {
                        title: 'React Hooks Deep Dive',
                        video_url: 'https://www.youtube.com/watch?v=TNhaISOUy6Q',
                        video_type: 'youtube',
                        duration: '48:45',
                        order_number: 3,
                        description: 'useState, useEffect, useContext, and custom hooks'
                    }
                ]
            },
            {
                title: 'Advanced React Patterns',
                order_number: 2,
                lessons: [
                    {
                        title: 'Context API and State Management',
                        video_url: 'https://www.youtube.com/watch?v=35lXWvCuM8o',
                        video_type: 'youtube',
                        duration: '38:20',
                        order_number: 1,
                        description: 'Global state management without Redux'
                    },
                    {
                        title: 'React Router v6',
                        video_url: 'https://www.youtube.com/watch?v=Ul3y1LXxzdU',
                        video_type: 'youtube',
                        duration: '42:10',
                        order_number: 2,
                        description: 'Routing, navigation, and protected routes'
                    },
                    {
                        title: 'Performance Optimization',
                        video_url: 'https://www.youtube.com/watch?v=tJzG7LEa5cM',
                        video_type: 'youtube',
                        duration: '28:35',
                        order_number: 3,
                        description: 'useMemo, useCallback, React.memo, and lazy loading'
                    }
                ]
            },
            {
                title: 'Redux Toolkit',
                order_number: 3,
                lessons: [
                    {
                        title: 'Redux Fundamentals',
                        video_url: 'https://www.youtube.com/watch?v=9boMnm5X9ak',
                        video_type: 'youtube',
                        duration: '1:05:40',
                        order_number: 1,
                        description: 'Store, actions, reducers, and Redux Toolkit setup'
                    },
                    {
                        title: 'Async Logic with Redux Thunk',
                        video_url: 'https://www.youtube.com/watch?v=9lCmbthgtB8',
                        video_type: 'youtube',
                        duration: '35:22',
                        order_number: 2,
                        description: 'API calls, loading states, and error handling'
                    }
                ]
            }
        ]
    },
    {
        title: 'UI/UX Design Masterclass',
        category: 'Design',
        description: 'Learn to design beautiful interfaces, user experiences, prototyping with Figma, and design systems.',
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
        instructor_id: 1,
        sections: [
            {
                title: 'Design Fundamentals',
                order_number: 1,
                lessons: [
                    {
                        title: 'Introduction to UI/UX Design',
                        video_url: 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU',
                        video_type: 'youtube',
                        duration: '45:20',
                        order_number: 1,
                        description: 'Design principles, user-centered design, and design thinking'
                    },
                    {
                        title: 'Color Theory and Typography',
                        video_url: 'https://www.youtube.com/watch?v=QkCVrNoqcBU',
                        video_type: 'youtube',
                        duration: '38:15',
                        order_number: 2,
                        description: 'Color psychology, palettes, fonts, and hierarchy'
                    },
                    {
                        title: 'Layout and Composition',
                        video_url: 'https://www.youtube.com/watch?v=a5KYlHNzQCY',
                        video_type: 'youtube',
                        duration: '32:40',
                        order_number: 3,
                        description: 'Grid systems, spacing, balance, and visual flow'
                    }
                ]
            },
            {
                title: 'Figma Mastery',
                order_number: 2,
                lessons: [
                    {
                        title: 'Figma Basics',
                        video_url: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8',
                        video_type: 'youtube',
                        duration: '1:12:30',
                        order_number: 1,
                        description: 'Interface, tools, frames, and components'
                    },
                    {
                        title: 'Auto Layout and Constraints',
                        video_url: 'https://www.youtube.com/watch?v=PNJxeD29ZTg',
                        video_type: 'youtube',
                        duration: '28:50',
                        order_number: 2,
                        description: 'Responsive design and dynamic layouts in Figma'
                    },
                    {
                        title: 'Prototyping and Animations',
                        video_url: 'https://www.youtube.com/watch?v=PeGfX7W1mJk',
                        video_type: 'youtube',
                        duration: '35:15',
                        order_number: 3,
                        description: 'Interactive prototypes, transitions, and micro-interactions'
                    }
                ]
            },
            {
                title: 'Design Systems',
                order_number: 3,
                lessons: [
                    {
                        title: 'Building Design Systems',
                        video_url: 'https://www.youtube.com/watch?v=EK-pHkc5EL4',
                        video_type: 'youtube',
                        duration: '42:25',
                        order_number: 1,
                        description: 'Components, variants, styles, and documentation'
                    },
                    {
                        title: 'User Research and Testing',
                        video_url: 'https://www.youtube.com/watch?v=8q1uF5y1d6k',
                        video_type: 'youtube',
                        duration: '38:30',
                        order_number: 2,
                        description: 'User personas, journey maps, and usability testing'
                    }
                ]
            }
        ]
    }
];

async function seedEducationalCourses() {
    try {
        console.log('Starting to seed educational courses...');
        
        for (const courseData of educationalCourses) {
            const { sections, ...courseInfo } = courseData;
            
            const [courseResult] = await db.execute(
                'INSERT INTO courses (title, description, category, thumbnail, instructor_id) VALUES (?, ?, ?, ?, ?)',
                [courseInfo.title, courseInfo.description, courseInfo.category, courseInfo.thumbnail, courseInfo.instructor_id]
            );
            
            const courseId = courseResult.insertId;
            console.log(`Created course: ${courseInfo.title} (ID: ${courseId})`);
            
            for (const sectionData of sections) {
                const { lessons, ...sectionInfo } = sectionData;
                
                const [sectionResult] = await db.execute(
                    'INSERT INTO sections (course_id, title, order_number) VALUES (?, ?, ?)',
                    [courseId, sectionInfo.title, sectionInfo.order_number]
                );
                
                const sectionId = sectionResult.insertId;
                
                for (const lessonData of lessons) {
                    await db.execute(
                        `INSERT INTO lessons (section_id, title, video_url, video_type, duration, order_number, description) 
                         VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [
                            sectionId,
                            lessonData.title,
                            lessonData.video_url,
                            lessonData.video_type,
                            lessonData.duration,
                            lessonData.order_number,
                            lessonData.description
                        ]
                    );
                }
                console.log(`  Added section: ${sectionInfo.title} with ${lessons.length} lessons`);
            }
        }
        
        console.log('\n✅ Successfully seeded 5 educational courses!');
        console.log('Courses added:');
        educationalCourses.forEach((c, i) => console.log(`  ${i + 1}. ${c.title}`));
        
    } catch (err) {
        console.error('Error seeding courses:', err);
    } finally {
        process.exit(0);
    }
}

seedEducationalCourses();
