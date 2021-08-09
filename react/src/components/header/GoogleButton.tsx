import { useTheme } from "@material-ui/core";
import "components/header/GoogleButton.css";
import SimpleSnackbar from "components/SimpleSnackbar";
import { GlobalStateContext } from "contexts/GlobalStateContext";
import React, { memo, useContext, useState } from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import AuthService from "services/auth.service";
import SettingService from "services/setting.service";
import TodoListService from "services/todoList.service";
import { maskEmail } from "utils/string";

/** クライアントID */
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID
  ? process.env.REACT_APP_CLIENT_ID
  : "";

/**
 * Googleでログイン/ログアウトするボタンのコンポーネントです。
 */
const GoogleButton = memo((props: any) => {
  const theme = useTheme();
  const { globalState, setGlobalState } = useContext(GlobalStateContext);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMassage] = useState("");

  /**
   * ログイン時の処理です。
   * @param {*} response
   */
  const login = (response: any) => {
    setGlobalState((globalState: any) => {
      return { ...globalState, isInSync: true, isInRoom: false };
    });
    AuthService.login({
      tokenId: response.tokenId,
      email: response.profileObj.email,
    })
      .then((res) => {
        if (res.data === "registered" || res.data === "logined") {
          setGlobalState((globalState: any) => {
            return {
              ...globalState,
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
                setGlobalState((globalState: any) => {
                  const newTodoLists = {
                    ...globalState.todoLists,
                    ...JSON.parse(r.data.todoList),
                  };
                  localStorage.setItem(
                    "todoLists",
                    JSON.stringify(newTodoLists)
                  );
                  return { ...globalState, todoLists: newTodoLists };
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
                setGlobalState((globalState: any) => {
                  const newSettings = {
                    ...globalState.settings,
                    ...JSON.parse(r.data.setting),
                  };
                  localStorage.setItem("settings", JSON.stringify(newSettings));
                  return { ...globalState, settings: newSettings };
                });
                localStorage.setItem(
                  "settingsUpdatedAt",
                  new Date(r.data.updatedAt).getTime().toString()
                );
              }
            });
          }
          TodoListService.update(
            response.tokenId,
            JSON.stringify(globalState.todoLists)
          );
          SettingService.update(
            response.tokenId,
            JSON.stringify(globalState.settings)
          );
          setGlobalState((globalState: any) => {
            return { ...globalState, isInSync: false };
          });
        } else {
          handleLoginFailure();
          setGlobalState((globalState: any) => {
            return { ...globalState, isInSync: false };
          });
        }
      })
      .catch(() => {
        handleLoginFailure();
        setGlobalState((globalState: any) => {
          return { ...globalState, isInSync: false };
        });
      });
  };

  /**
   * ログアウト時の処理です。
   */
  const logout = () => {
    setGlobalState((globalState: any) => {
      return { ...globalState, isLogined: false, tokenId: "", email: "" };
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
      {globalState.isLogined ? (
        <GoogleLogout
          clientId={CLIENT_ID}
          buttonText="ログアウト"
          onLogoutSuccess={logout}
          onFailure={handleLogoutFailure}
          // @ts-ignore
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
