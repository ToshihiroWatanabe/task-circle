import React, { useState, memo, Fragment, useContext } from "react";
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
} from "@material-ui/core";

import MenuIcon from "@material-ui/icons/Menu";
import DescriptionIcon from "@material-ui/icons/Description";
import AssessmentIcon from "@material-ui/icons/Assessment";
import InfoIcon from "@material-ui/icons/Info";
import FilePopover from "./FilePopover";
import AccountPopover from "./AccountPopover";
import SettingsIcon from "@material-ui/icons/Settings";
import PortraitIcon from "@material-ui/icons/Portrait";
import { Context } from "../contexts/Context";

/** ドロワーの横幅 */
const DRAWER_WIDTH = "15rem";

const pages = [
  { label: "日報管理", path: "/" },
  { label: "分析レポート", path: "/analytics" },
  { label: "ポートフォリオ", path: "/portfolio" },
  { label: "設定", path: "/settings" },
  { label: "このアプリについて", path: "/about" },
];

/** Material-UIのスタイル */
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("lg")]: {
      width: DRAWER_WIDTH,
      flexShrink: 0,
    },
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    [theme.breakpoints.up("lg")]: {
      width: `calc(100%)`,
      marginLeft: DRAWER_WIDTH,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("lg")]: {
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
  const { window } = props;
  const location = useLocation();
  /** Material-UIのスタイル */
  const classes = useStyles();
  /** Material-UIのテーマ */
  const theme = useTheme();
  const [state, setState] = useContext(Context);
  const [mobileOpen, setMobileOpen] = useState(false);

  // リストの項目が押されたときの処理です。
  const handleListItemClick = (index) => {
    setMobileOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        {pages.map(
          (page, index) =>
            (state.userId !== "" || page.label !== "ポートフォリオ") && (
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
                      {page.label === "日報管理" ? <DescriptionIcon /> : ""}
                      {page.label === "分析レポート" ? <AssessmentIcon /> : ""}
                      {page.label === "ポートフォリオ" ? <PortraitIcon /> : ""}
                      {page.label === "設定" ? <SettingsIcon /> : ""}
                      {page.label === "このアプリについて" ? <InfoIcon /> : ""}
                    </ListItemIcon>
                    <ListItemText primary={page.label} />
                  </ListItem>
                </Link>
              </Fragment>
            )
        )}
      </List>
    </>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

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
            onClick={props.onHeaderTitleClick}
            noWrap
          >
            {pages.map(
              (page, index) =>
                location.pathname === page.path && (
                  <Fragment key={index}>{page.label}</Fragment>
                )
            )}
            {location.pathname === "/login" && <>ログイン</>}
            {location.pathname === "/signup" && <>新規登録</>}
          </Typography>
          <span style={{ flexGrow: 1 }}></span>
          {/* データ移行のファイルアイコン */}
          <FilePopover
            importReportsFromJson={props.importReportsFromJson}
            onExportReportsToTxtButtonClick={
              props.onExportReportsToTxtButtonClick
            }
            onExportReportsToJsonButtonClick={
              props.onExportReportsToJsonButtonClick
            }
          />
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
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
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
