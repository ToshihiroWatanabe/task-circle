import React, { useState, memo, Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import {
  AppBar,
  Divider,
  Drawer,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  SwipeableDrawer,
  useMediaQuery,
  Button,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import DescriptionIcon from "@material-ui/icons/Description";
import AssessmentIcon from "@material-ui/icons/Assessment";
import HomeIcon from "@material-ui/icons/Home";
import InfoIcon from "@material-ui/icons/Info";
import SettingsIcon from "@material-ui/icons/Settings";
import FilePopover from "components/header/FilePopover";
import AccountPopover from "components/header/AccountPopover";
import TimerPopover from "./TimerPopover";
import { DRAWER_WIDTH } from "utils/constant";
import AnalyticsFilePopover from "components/AnalyticsFilePopover";

const pages = [
  { label: "ホーム", path: "/" },
  // { label: "日報管理", path: "/reports" },
  // { label: "分析レポート", path: "/analytics" },
  { label: "設定", path: "/settings" },
  { label: "このアプリについて", path: "/about" },
];

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    // [theme.breakpoints.up("lg")]: {
    //   width: DRAWER_WIDTH,
    //   flexShrink: 0,
    // },
  },
  appBar: {
    // zIndex: theme.zIndex.drawer + 1,
    // [theme.breakpoints.up("lg")]: {
    //   width: `calc(100%)`,
    //   marginLeft: DRAWER_WIDTH,
    // },
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
const ResponsiveDrawer = memo((props) => {
  const { windowProps } = props;
  const classes = useStyles();
  const theme = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // リストの項目が押されたときの処理です。
  const handleListItemClick = (index) => {
    setMobileOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  /**
   * ヘッダーのタイトルがクリックされたときの処理です。
   */
  const onHeaderTitleClick = () => {
    // ページトップへ移動
    window.scrollTo(0, 0);
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
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <ListItem
                button
                onClick={() => handleListItemClick(index)}
                data-num={index.toString()}
              >
                <ListItemIcon>
                  {page.label === "ホーム" ? <HomeIcon /> : ""}
                  {/* {page.label === "日報管理" ? <DescriptionIcon /> : ""}
                  {page.label === "分析レポート" ? <AssessmentIcon /> : ""} */}
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
      <AppBar position="fixed" className={classes.appBar}>
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
          <Typography
            variant="h6"
            className={classes.title}
            onClick={onHeaderTitleClick}
            noWrap
          >
            {pages.map(
              (page, index) =>
                location.pathname === page.path && (
                  <Fragment key={index}>Task Circle</Fragment>
                )
            )}
            {location.pathname === "/login" && <>ログイン</>}
            {location.pathname === "/signup" && <>新規登録</>}
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
          <div
            style={{ visibility: location.pathname === "/" ? "" : "hidden" }}
          >
            <TimerPopover />
          </div>
          {/* 日報をインポート・エクスポートするファイルアイコン */}
          {location.pathname === "/reports" && <FilePopover />}
          {/* 分析レポートをエクスポートするファイルアイコン */}
          {/* {location.pathname === "/analytics" && <AnalyticsFilePopover />} */}
          <AccountPopover onSyncButtonClick={props.onSyncButtonClick} />
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
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
        <Hidden mdDown implementation="css">
          {/* <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer> */}
        </Hidden>
      </nav>
    </div>
  );
});

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;
