import React from "react";

const Course = ({ course }) => {
    return (
        <>
            <Header course={course} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </>
    );
};

const Header = ({ course }) => {
    return <h1>{course.name}</h1>;
};

const Content = ({ parts }) => {
    return (
        <div>
            {parts.map((part) => (
                <p key={part.id}>
                    {part.name} {part.exercises}
                </p>
            ))}
        </div>
    );
};

const Total = ({ parts }) => {
    const totalExercises = parts.reduce((sum, part) => sum + part.exercises, 0);
    return (
        <p>
            <strong>total of {totalExercises} exercises</strong>
        </p>
    );
};

export default Course;