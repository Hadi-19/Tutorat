// import classes from './NavLinkButton.module.scss'
import { NavLink } from "react-router-dom"
import NavLinkButton from './NavLinkButton'

const Model = (props) => {
    return (
        <div style={{display:"flex", alignItems:"center"}}>
            <NavLinkButton path={`/models/${props.pubId}`}>{'Go'}</NavLinkButton>
            <p>{props.name}</p>
        </div>
    );
}

export default Model