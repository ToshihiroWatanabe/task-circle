import React from "react";
import { Box, Card, makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  card: {
    width: "calc(100% - 2rem)",
    padding: "1rem",
    marginBottom: "1rem",
    [theme.breakpoints.down("xs")]: {
      width: "calc(100% - 8px)",
    },
  },
}));

/**
 * プライバシーポリシーページのコンポーネントです。
 */
const PrivacyPolicy = () => {
  const classes = useStyles();

  return (
    <>
      <Card className={classes.card}>
        <Typography variant="h5">プライバシーポリシー</Typography>
        <Box mt={1} />
        <Typography variant="h6">個人情報の利用目的</Typography>
        <Typography>
          当アプリでは、ユーザー登録の際、メールアドレス等の個人情報を入力いただく場合がございます。
          取得した個人情報は、当アプリのサービスのために利用させていただくものであり、これらの目的以外では利用いたしません。
        </Typography>
        <Box mt={2} />
        <Typography>最終更新日 2021年7月7日</Typography>
      </Card>
    </>
  );
};

export default PrivacyPolicy;
