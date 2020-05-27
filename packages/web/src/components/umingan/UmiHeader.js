import React, { useState, Fragment } from "react";
import {
    AppBar,
    Container,
    Divider,
    Drawer,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Toolbar,
    Typography,
} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import MenuIcon from "@material-ui/icons/Menu";
import { useCookies } from "react-cookie";

import { LogoSeries } from "../reducers/LogoSeries";
import umi_banner from "../../assets/banner_new.png";

const useStyles = makeStyles((theme) => ({
    list: {
        width: 250,
    },
    fullList: {
        width: "auto",
    },
}));

export default function UmiHeader(props) {
    const classes = useStyles();
    const [cookies, setCookie, removeCookie] = useCookies(['credentials'])
    const [state, setState] = useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const handleSignout = () => {
        console.log("props", props);
        removeCookie(["credentials"]);
        alert("Signing out!")
        props.history.push("/")
    };

    const toggleDrawer = (side, open) => (event) => {
        if (
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }
        setState({ ...state, [side]: open });
    };

    const drawerList = (side) => (
        <div
            className={classes.list}
            role="presentation"
            onClick={toggleDrawer(side, false)}
            onKeyDown={toggleDrawer(side, false)}
        >
            <List>
                {["Profile", "Notifications"].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
            <Divider />

            <List>
                {["Signout"].map((text, index) => (
                    <ListItem
                        button
                        key={text}
                        onClick={handleSignout}
                    >
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <Fragment>
            <AppBar color="inherit">
                <Grid container spacing={0} alignItems="center" alignContent="left">
                    <Grid item xs={1}>
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                edge="start"
                                aria-label="menu"
                                onClick={toggleDrawer("right", true)}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Toolbar>
                    </Grid>
                    <Grid item xs={11}>
                        <Typography>GOVPH</Typography>
                    </Grid>
                </Grid>

                <img className={classes.xs_image} style={{width: '100%'}} src={umi_banner} />
            </AppBar>
            <Drawer open={state.right} onClose={toggleDrawer("right", false)}>
                {drawerList("right")}
            </Drawer>

            {/* <Grid item xs={12} style={{paddingTop: '80px'}}>
                <img className={classes.xs_image} style={{width: '100%'}} src={umi_banner} />
            </Grid> */}
        </Fragment>
    );
}