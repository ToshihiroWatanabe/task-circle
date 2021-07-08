import React, { useState, memo, useContext } from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import SimpleSnackbar from "components/SimpleSnackbar";
import { StateContext } from "contexts/StateContext";
import "components/header/GoogleButton.css";
import { maskEmail } from "utils/string";
import AuthService from "services/auth.service";

/**
 * クライアントID
 */
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

/**
 * Googleでログイン/ログアウトするボタンのコンポーネントです。
 */
const GoogleButton = memo((props) => {
  const [state, setState] = useContext(StateContext);
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
        if (res) {
          setState((state) => {
            return {
              ...state,
              isLogined: true,
              tokenId: response.tokenId,
              email: response.profileObj.email,
            };
          });
          props.setMaskedEmail(maskEmail(response.profileObj.email));
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
    console.info(response);
    setSnackbarMassage("ログインに失敗しました");
    setSnackbarOpen(true);
  };

  /**
   * ログアウトに失敗したときの処理です。
   * @param {*} response
   */
  const handleLogoutFailure = (response) => {
    console.info(response);
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
