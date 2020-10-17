/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { LoginForm } from "../../components/auth/LoginForm";
import { login } from "../../lib/api/auth";
import core from "../../modules/core";

export const LoginContainer: React.FC = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const onSubmit = useCallback(
    async (id, password) => {
      const loggedIn = await login(id, password);
      if (loggedIn) {
        dispatch(core.actions.setUser({ name: "CodeSquare" }));
        history.push("/");
      }
      return loggedIn;
    },
    [dispatch, history],
  );
  const onCancel = useCallback(() => {
    history.push("/");
  }, [history]);
  return (
    <LoginForm onSubmit={onSubmit} onCancel={onCancel} {...props}></LoginForm>
  );
};