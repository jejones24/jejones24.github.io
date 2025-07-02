export default function Assignments () {
    function showGrade1() {
        let elem = document.getElementById("gradePanel1");
        elem.hidden = elem.hidden !== true;
    }
    function showGrade2() {
        let elem = document.getElementById("gradePanel2");
        elem.hidden = elem.hidden !== true;
    }

    function showGrade3() {
        let elem = document.getElementById("gradePanel3");
        elem.hidden = elem.hidden !== true;
    }
    return (
        <>
            <link href="src/stylesheets/grades.css" rel="stylesheet"/>
            <div className={"topnav"}>
                <a href={"/homes"}>Home</a>
                <a className={"active"} href={"/assignments"}>Assignments</a>
                <a href={"/grades"}>Grades</a>
                <a href={"/userPages"} style={{float: "right"}}>User Information</a>
            </div>
            <div style={{backgroundColor: "wheat", textAlign: "center", padding:"50px", paddingTop:"10px",
                paddingBottom: "441px"}}>
                <h1 style={{color: "#00006c", fontWeight: "bold"}}>Assignments</h1>
                <div className="dropdown">
                    <button className={"dropbtn"} id={"dropbtn1"} onClick={showGrade1}>Demo Course 1</button>
                    <div className="gradePanel" id={"gradePanel1"} hidden>
                        Assignment 1
                        Assignment 2
                        Assignment 3
                    </div>
                </div>
                <div className="dropdown">
                    <button className={"dropbtn"} id="dropbtn2" onClick={showGrade2}>Demo Course 2</button>
                    <div className="gradePanel" id={"gradePanel2"} hidden>
                        Assignment 1
                        Assignment 2
                        Assignment 3
                    </div>
                </div>
                <div className="dropdown">
                    <button className={"dropbtn"} id="dropbtn3" onClick={showGrade3}>Demo Course 3</button>
                    <div className="gradePanel" id={"gradePanel3"} hidden>
                        Assignment 1
                        Assignment 2
                        Assignment 3
                    </div>
                </div>
            </div>
        </>
    )
}