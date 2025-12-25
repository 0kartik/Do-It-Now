import { Link } from "react-router-dom"

export default function Header() {
    return(
        <nav>
            <Link to='/'> Home </Link>
            <Link to='/Today'> Today </Link>
            <Link to='/Stats'> Stats </Link>
            <Link to='/Settings'> Settings </Link>
        </nav>
    )
}