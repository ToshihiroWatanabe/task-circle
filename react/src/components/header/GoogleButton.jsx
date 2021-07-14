import { useTheme } from "@material-ui/core";
import "components/header/GoogleButton.css";
import SimpleSnackbar from "components/SimpleSnackbar";
import { SettingsContext } from "contexts/SettingsContext";
import { StateContext } from "contexts/StateContext";
import { TodoListsContext } from "contexts/TodoListsContext";
import React, { memo, useContext, useState } from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import AuthService from "services/auth.service";
import SettingService from "services/setting.service";
import TodoListService from "services/todoList.service";
import { maskEmail } from "utils/string";

/**
 * クライアントID
 */
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

/**
 * Googleでログイン/ログアウトするボタンのコンポーネントです。
 */
const GoogleButton = memo((props) => {
  const theme = useTheme();
  const [state, setState] = useContext(StateContext);
  const [todoLists, setTodoLists] = useContext(TodoListsContext);
  const [settings, setSettings] = useContext(SettingsContext);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMassage] = useState("");

  /**
   * ログイン時の処理です。
   * @param {*} response
   */
  const login = (response) => {
    console.info(response);
    setState((state) => {
      return { ...state, isInSync: true, isInRoom: false };
    });
    AuthService.login({
      tokenId: response.tokenId,
      email: response.profileObj.email,
    })
      .then((res) => {
        if (res.data === "registered" || res.data === "logined") {
          setState((state) => {
            return {
              ...state,
              isLogined: true,
              tokenId: response.tokenId,
              email: response.profileObj.email,
            };
          });
          props.setMaskedEmail(maskEmail(response.profileObj.email));
          if (res.data === "logined") {
            // DBのTodoリストを取得
            TodoListService.findByTokenId(response.tokenId).then((r) => {
              // ローカルのデータより新しいかどうか比較する
              if (
                new Date(r.data.updatedAt).getTime() >
                localStorage.getItem("todoListsUpdatedAt")
              ) {
                // ローカルのデータをDBのデータに上書きする
                setTodoLists((todoLists) => {
                  const newTodoLists = {
                    ...todoLists,
                    ...JSON.parse(r.data.todoList),
                  };
                  localStorage.setItem(
                    "todoLists",
                    JSON.stringify(newTodoLists)
                  );
                  return newTodoLists;
                });
                localStorage.setItem(
                  "todoListsUpdatedAt",
                  new Date(r.data.updatedAt).getTime()
                );
              }
            });
            // DBの設定を取得
            SettingService.findByTokenId(response.tokenId).then((r) => {
              // ローカルのデータより新しいかどうか比較する
              if (
                new Date(r.data.updatedAt).getTime() >
                localStorage.getItem("settingsUpdatedAt")
              ) {
                // ローカルのデータをDBのデータに上書きする
                setSettings((settings) => {
                  const newSettings = {
                    ...settings,
                    ...JSON.parse(r.data.setting),
                  };
                  localStorage.setItem("settings", JSON.stringify(newSettings));
                  return newSettings;
                });
                localStorage.setItem(
                  "settingsUpdatedAt",
                  new Date(r.data.updatedAt).getTime()
                );
              }
            });
          }
          TodoListService.update(response.tokenId, JSON.stringify(todoLists));
          SettingService.update(response.tokenId, JSON.stringify(settings));
          setState((state) => {
            return { ...state, isInSync: false };
          });
        } else {
          handleLoginFailure();
          setState((state) => {
            return { ...state, isInSync: false };
          });
        }
      })
      .catch(() => {
        handleLoginFailure();
        setState((state) => {
          return { ...state, isInSync: false };
        });
      });
  };

  /**
   * ログアウト時の処理です。
   * @param {*} response
   */
  const logout = (response) => {
    setState((state) => {
      return { ...state, isLogined: false, tokenId: "", email: "" };
    });
    props.setMaskedEmail("");
  };

  /**
   * ログインに失敗したときの処理です。
   * @param {*} response
   */
  const handleLoginFailure = (response) => {
    setSnackbarMassage("ログインに失敗しました");
    setSnackbarOpen(true);
  };

  /**
   * ログアウトに失敗したときの処理です。
   * @param {*} response
   */
  const handleLogoutFailure = (response) => {
    setSnackbarMassage("ログアウトに失敗しました");
    setSnackbarOpen(true);
  };

  return (
    <div id="googleButton">
      {state.isLogined ? (
        <GoogleLogout
          clientId={CLIENT_ID}
          buttonText="ログアウト"
          onLogoutSuccess={logout}
          onFailure={handleLogoutFailure}
          theme={theme.palette.type}
        />
      ) : (
        <GoogleLogin
          clientId={CLIENT_ID}
          buttonText="ログイン"
          onSuccess={login}
          onFailure={handleLoginFailure}
          cookiePolicy={"single_host_origin"}
          responseType="code,token"
          theme={theme.palette.type}
        />
      )}
      <SimpleSnackbar
        open={snackbarOpen}
        setOpen={setSnackbarOpen}
        message={snackbarMessage}
      />
    </div>
  );
});

export default GoogleButton;
