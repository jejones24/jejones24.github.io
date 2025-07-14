export default function HomeS() {
    return (
        <>
            <head>
                <meta charSet="UTF-8"/>
                <title>Home</title>
                <link rel="icon" type="image/svg+xml" href="../../assets/gac-icon.png"/>
                <link href="src/stylesheets/home.css" rel="stylesheet"/>
                <link href="src/stylesheets/index.css" rel="stylesheet"/>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
                      integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
                      crossOrigin="anonymous"/>
            </head>
            <body style={{background: "wheat"}}>
            <div className={"topnav"}>
                <a className={"active"} href={"/homes"}>Home</a>
                <a href={"/assignments"}>Assignments</a>
                <a href={"/grades"}>Grades</a>
                <a href={"/userPages"} style={{float: "right"}}>User Information</a>
            </div>
            <div className="row">
                <div className="column1" style={{paddingBottom:"10px"}}>
                    <div className="institutionLogo">
                        <img src="../../assets/gac-icon.png" alt="Gustavus Adolphus College logo" width={"200"} height={"200"}/>
                        <b>Gustavus AI Lab (GACAI)</b>
                    </div>
                    <div className="institutionInfo">
                        This is where information about the institution using the app will go. Since this is only a
                        demo, it will have information about the group creating it, the Gustavus AI Lab, also known
                        as GACAI (or GAIL). This app intends to ease many of the pains of creating curriculum and
                        tracking student progress. With an AI assistant, this process becomes much easier. This place
                        could also be a possible place to put an abbreviated user profile, depending on how the
                        development of this app continues. This part of the project is for the student side of things.
                    </div>
                </div>
                <div className="column2">
                    <p style={{fontSize:"40px", marginTop: "10px"}}><b>User&#39;s Courses</b></p>
                    <a className="classCard">Demo Course 1<br/>1111111</a>
                    <a className="classCard">Demo Course 2<br/>2222222</a>
                    <a className="classCard">Demo Course 3<br/>3333333</a>
                </div>
            </div>
            </body>
        </>
    );
}