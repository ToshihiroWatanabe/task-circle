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
const GoogleButton = memo((props: any) => {
  const theme = useTheme();
  const { state, setState } = useContext(StateContext);
  const { todoLists, setTodoLists } = useContext(TodoListsContext);
  const { settings, setSettings } = useContext(SettingsContext);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMassage] = useState("");

  /**
   * ログイン時の処理です。
   * @param {*} response
   */
  const login = (response: any) => {
    setState((state: any) => {
      return { ...state, isInSync: true, isInRoom: false };
    });
    AuthService.login({
      tokenId: response.tokenId,
      email: response.profileObj.email,
    })
      .then((res) => {
        if (res.data === "registered" || res.data === "logined") {
          setState((state: any) => {
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
                // @ts-ignore
                new Date(r.data.updatedAt).getTime() >
                // @ts-ignore
                localStorage.getItem("todoListsUpdatedAt")
              ) {
                // ローカルのデータをDBのデータに上書きする
                setTodoLists((todoLists: any) => {
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
                  new Date(r.data.updatedAt).getTime().toString()
                );
              }
            });
            // DBの設定を取得
            SettingService.findByTokenId(response.tokenId).then((r) => {
              // ローカルのデータより新しいかどうか比較する
              if (
                //@ts-ignore
                new Date(r.data.updatedAt).getTime() >
                //@ts-ignore
                localStorage.getItem("settingsUpdatedAt")
              ) {
                // ローカルのデータをDBのデータに上書きする
                setSettings((settings: any) => {
                  const newSettings = {
                    ...settings,
                    ...JSON.parse(r.data.setting),
                  };
                  localStorage.setItem("settings", JSON.stringify(newSettings));
                  return newSettings;
                });
                localStorage.setItem(
                  "settingsUpdatedAt",
                  new Date(r.data.updatedAt).getTime().toString()
                );
              }
            });
          }
          TodoListService.update(response.tokenId, JSON.stringify(todoLists));
          SettingService.update(response.tokenId, JSON.stringify(settings));
          setState((state: any) => {
            return { ...state, isInSync: false };
          });
        } else {
          handleLoginFailure();
          setState((state: any) => {
            return { ...state, isInSync: false };
          });
        }
      })
      .catch(() => {
        handleLoginFailure();
        setState((state: any) => {
          return { ...state, isInSync: false };
        });
      });
  };

  /**
   * ログアウト時の処理です。
   * @param {*} response
   */
  const logout = (response: any) => {
    setState((state: any) => {
      return { ...state, isLogined: false, tokenId: "", email: "" };
    });
    props.setMaskedEmail("");
  };

  /**
   * ログインに失敗したときの処理です。
   */
  const handleLoginFailure = () => {
    setSnackbarMassage("ログインに失敗しました");
    setSnackbarOpen(true);
  };

  /**
   * ログアウトに失敗したときの処理です。
   */
  const handleLogoutFailure = () => {
    setSnackbarMassage("ログアウトに失敗しました");
    setSnackbarOpen(true);
  };

  return (
    <div id="googleButton">
      {state.isLogined ? (
        // @ts-ignore
        <GoogleLogout
          clientId={CLIENT_ID}
          buttonText="ログアウト"
          onLogoutSuccess={logout}
          onFailure={handleLogoutFailure}
          theme={theme.palette.type}
        />
      ) : (
        <GoogleLogin
          // @ts-ignore
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
        // @ts-ignore
        open={snackbarOpen}
        setOpen={setSnackbarOpen}
        message={snackbarMessage}
      />
    </div>
  );
});

export default GoogleButton;
