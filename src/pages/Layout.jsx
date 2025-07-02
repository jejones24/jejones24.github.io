import { Outlet, Link } from "react-router-dom";

const Layout = () => {
    return (
        <>
            <nav>
                <ul>
                    <li>
                        <Link to={"/home"}>Home</Link>
                    </li>
                    <li>
                        <Link to={"/curriculum"}>Curriculum</Link>
                    </li>
                    <li>
                        <Link to={"/studentProgress"}>Student Progress</Link>
                    </li>
                    <li>
                        <Link to={"/userPage"}>User Page</Link>
                    </li>
                </ul>
            </nav>
            <Outlet />
        </>
    )
}

export default Layout;