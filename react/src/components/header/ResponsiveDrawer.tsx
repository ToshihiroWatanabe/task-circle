import {
  AppBar,
  Button,
  Divider,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import HomeIcon from "@material-ui/icons/Home";
import InfoIcon from "@material-ui/icons/Info";
import MenuIcon from "@material-ui/icons/Menu";
import SettingsIcon from "@material-ui/icons/Settings";
import AccountPopover from "components/header/AccountPopover";
import TimerPopover from "components/header/TimerPopover";
import React, { Fragment, memo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { DRAWER_WIDTH } from "utils/constant";

const pages = [
  { label: "ホーム", path: "/" },
  { label: "設定", path: "/settings" },
  { label: "このアプリについて", path: "/about" },
];

interface Props {
  sendMessage: any;
  isDarkModeOn: boolean;
  setIsDarkModeOn: any;
  onSyncButtonClick: any;
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  windowProps?: () => Window;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  // コンテンツがアプリバー以下であるために必要
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: DRAWER_WIDTH,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

/**
 * ドロワーのコンポーネントです。
 */
const ResponsiveDrawer = memo((props: Props) => {
  const { windowProps } = props;
  const classes = useStyles();
  const theme = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // リストの項目が押されたときの処理です。
  const handleListItemClick = () => {
    setMobileOpen(false);
  };

  /**
   * ドロワーを開閉するときの処理です。
   */
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  /**
   * ヘッダーのタイトルがクリックされたときの処理です。
   */
  const onHeaderTitleClick = () => {
    //@ts-ignore
    document.getElementsByClassName("links")[0].click();
  };

  const drawer = (
    <>
      <div className={classes.toolbar}></div>
      <Divider />
      <List>
        {pages.map((page, index) => (
          <Fragment key={index}>
            <Link
              to={page.path}
              className="links"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <ListItem
                button
                onClick={() => handleListItemClick()}
                data-num={index.toString()}
              >
                <ListItemIcon>
                  {page.label === "ホーム" ? <HomeIcon /> : ""}
                  {page.label === "設定" ? <SettingsIcon /> : ""}
                  {page.label === "このアプリについて" ? <InfoIcon /> : ""}
                </ListItemIcon>
                <ListItemText primary={page.label} />
              </ListItem>
            </Link>
          </Fragment>
        ))}
      </List>
    </>
  );

  const container =
    windowProps !== undefined ? () => windowProps().document.body : undefined;

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" onClick={onHeaderTitleClick} noWrap>
            TaskCircle
          </Typography>
          <span style={{ flexGrow: 1 }}></span>
          {useMediaQuery(theme.breakpoints.up("md")) && (
            <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
              <Button color="inherit">ホーム</Button>
            </Link>
          )}
          {useMediaQuery(theme.breakpoints.up("md")) && (
            <Link
              to="settings"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <Button color="inherit">設定</Button>
            </Link>
          )}
          {useMediaQuery(theme.breakpoints.up("md")) && (
            <Link
              to="about"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <Button color="inherit">このアプリについて</Button>
            </Link>
          )}
          {/* ポモドーロ切り替えアイコン */}
          <div style={{ display: location.pathname === "/" ? "" : "none" }}>
            <TimerPopover
              //@ts-ignore
              sendMessage={props.sendMessage}
            />
          </div>
          {/* ダークモード切り替えアイコン */}
          <Tooltip title="ダークモード切り替え">
            <IconButton
              color="inherit"
              onClick={() => {
                //@ts-ignore
                localStorage.setItem("isDarkModeOn", !props.isDarkModeOn);
                props.setIsDarkModeOn(!props.isDarkModeOn);
              }}
              style={{
                display: location.pathname === "/settings" ? "" : "none",
              }}
            >
              {props.isDarkModeOn ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
          </Tooltip>
          {/* その他のページは空白 */}
          {!["/", "/settings"].includes(location.pathname) && (
            <IconButton style={{ visibility: "hidden" }}>
              <Brightness4Icon />
            </IconButton>
          )}
          {/* アカウントボタン */}
          <AccountPopover
            //@ts-ignore
            onSyncButtonClick={props.onSyncButtonClick}
          />
        </Toolbar>
      </AppBar>
      <nav aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden lgUp implementation="css">
          <SwipeableDrawer
            container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            onOpen={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </SwipeableDrawer>
        </Hidden>
        <Hidden mdDown implementation="css"></Hidden>
      </nav>
    </div>
  );
});

export default ResponsiveDrawer;
