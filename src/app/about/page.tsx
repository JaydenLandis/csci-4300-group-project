import Image from "next/image"
import "./aboutstyle.css";

const About = () => {
  return (
    
    <div className ="p-5 bg-dark-subtle">
      <div className = "d-flex flex-row bg-white p-3 m-5 border bd-highlight rounded shadow-lg">
      
        <Image src="/assets/foundingfathers.jpg"
        alt = "Picture of AutoFlash's founders: Adrian Morales, Jayden Landis, Sam Pinho, and Jackson Barlow"
        className="d-block w-100 rounded"
        width={300}
        height={700}/>
        <h3 className="p-5 w-75 text-center">We founded AutoFlash to increase studying efficiency.
        We used Google Gemini's API to take any quizzes or tests taken and graded,
        and turn them into studyable flashcards for future quizzes. We partnered in March of 2025
        as a group to originally create a final project for our Web Development class.
        However, there is always more in the future to improve with AutoFlash!
        </h3>
      
      </div>
    </div>
  );
};

export default About;
