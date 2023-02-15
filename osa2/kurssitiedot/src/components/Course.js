const Part = ({part, exercises}) => {
    return (
      <p>{part} {exercises}</p>
    )
  }
  
  const Header = ({name}) => {
    return (
      <h1>{name}</h1>
    )
  }
  
  const Total = ({parts}) => {
    const total = Object.values(parts).reduce((t, {exercises}) => t + exercises, 0)
    //console.log(total)
    return (
      <b> total of {total} exercises </b>
    )
  } 
  
  const Content = ({parts}) => {
    return (
      <div>
        {
          parts.map(part => 
            <Part key={part.id} part={part.name} exercises={part.exercises} />
          )}
      </div>
    )
  }
  
  const Course = ({course}) => {
    return (
      <div>
        <Header name={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    )
  }

export default Course