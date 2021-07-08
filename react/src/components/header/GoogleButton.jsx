import React, { useState, memo, useContext } from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import SimpleSnackbar from "components/SimpleSnackbar";
import { StateContext } from "contexts/StateContext";
import "components/header/GoogleButton.css";
import { maskEmail } from "utils/string";
import AuthService from "services/auth.service";
import TodoListService from "services/todoList.service";
import SettingService from "services/setting.service";
import { TodoListsContext } from "contexts/TodoListsContext";
import { SettingsContext } from "contexts/SettingsContext";

/**
 * クライアントID
 */
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

/**
 * Googleでログイン/ログアウトするボタンのコンポーネントです。
 */
const GoogleButton = memo((props) => {
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
            TodoListService.findByTokenId(response.tokenId).then((r) => {
              console.log(r);
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
            SettingService.findByTokenId(response.tokenId).then((r) => {
              console.log(r);
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
        } else {
          handleLoginFailure();
        }
      })
      .catch(() => {
        handleLoginFailure();
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
        />
      ) : (
        <GoogleLogin
          clientId={CLIENT_ID}
          buttonText="ログイン"
          onSuccess={login}
          onFailure={handleLoginFailure}
          cookiePolicy={"single_host_origin"}
          responseType="code,token"
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
