export default function UserPage() {
    return (
        <>
            <head>
                <meta charSet="UTF-8"/>
                <title>User Info</title>
                <link rel="icon" type="image/svg+xml" href="../../assets/gac-icon.png"/>
                <link href="src/stylesheets/index.css" rel="stylesheet"/>
                <link href="src/stylesheets/home.css" rel="stylesheet"/>
                <link href={"https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"} rel="stylesheet"
                      integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
                      crossOrigin="anonymous"/>
            </head>
            <body style={{backgroundColor: "wheat", textAlign: "center", paddingBottom: "115px"}}>
            <div className="topnav">
                <a href="/home">Home</a>
                <a className="active" style={{float: "right"}}>User Information</a>
            </div>
            <div>
                <img style={{padding: "16px", display: "inline"}} src={"../../assets/gac-icon.png"} alt={"Gustavus Adolphus College logo"} width={"250"} height={"250"}/>
                <p style={{fontSize: "50px", display: "inline"}}><b>User Name</b></p>
                <a className={"newCourse"} href={"/home"}>Courses</a>
                <a className={"newCourse"} href={"/settings"}>Settings</a>
                <a className={"newCourse"} style={{backgroundColor: "red"}} href={"/"}>Log Out</a>
            </div>
            </body>
        </>
    )
}