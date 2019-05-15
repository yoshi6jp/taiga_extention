import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Button,
  Alert,
  Navbar,
  Form,
  InputGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  Spinner
} from "reactstrap";
import { PersonalTasks } from "./PersonalTasks";
import { PersonalInfo } from "./PersonalInfo";
import { RootContext } from "../Provider";
import { PersonalChart } from "./PersonalChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowCircleLeft,
  faUser,
  faKey,
  faSignInAlt,
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { ActionTypes } from "../actions";
import { UpdateButton } from "./UpdateButton";
import useRouter from "use-react-router";
import { preventDefault } from "../util/handler";
export const SignInForm: React.FC = () => {
  const {
    state: { auth_token, auth_error, username: sign_in_username },
    dispatch
  } = useContext(RootContext);

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      if (username && password) {
        setLoading(true);
        dispatch({
          type: ActionTypes.SIGN_IN,
          payload: {
            username,
            password
          }
        });
      }
      e.preventDefault();
    },
    [password, username, dispatch, setLoading]
  );
  const handleUsername = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUsername(e.target.value);
    },
    [setUsername]
  );
  const handlePassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
    },
    [setPassword]
  );
  const handleSignOut = useCallback(() => {
    dispatch({ type: ActionTypes.SIGN_OUT });
  }, [dispatch]);
  useEffect(() => {
    if (auth_error || auth_token) {
      setLoading(false);
    }
  }, [auth_error, auth_token, setLoading]);
  return (
    <>
      {auth_token ? (
        <Form inline onSubmit={preventDefault} className="mr-1">
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <FontAwesomeIcon icon={faUser} />
              </InputGroupText>
            </InputGroupAddon>
            <Input readOnly valid={true} placeholder={sign_in_username} />
            <InputGroupAddon addonType="append">
              <Button onClick={handleSignOut} color="danger">
                <FontAwesomeIcon icon={faSignOutAlt} />
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </Form>
      ) : (
        <Form inline onSubmit={handleSubmit} className="mr-1">
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <FontAwesomeIcon icon={faUser} />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              disabled={loading}
              onInput={handleUsername}
              onChange={handleUsername}
              name="username"
              placeholder="username"
              invalid={auth_error}
            />
          </InputGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <FontAwesomeIcon icon={faKey} />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              disabled={loading}
              onInput={handlePassword}
              onChange={handlePassword}
              name="password"
              placeholder="password"
              type="password"
              invalid={auth_error}
            />
          </InputGroup>
          <Button color="info">
            {loading ? (
              <Spinner size="sm" type="grow" />
            ) : (
              <FontAwesomeIcon icon={faSignInAlt} />
            )}
          </Button>
        </Form>
      )}
    </>
  );
};
export const PersonalPage: React.FC = () => {
  const {
    state: { user },
    dispatch
  } = useContext(RootContext);
  const {
    match: {
      params: { uid }
    }
  } = useRouter();
  useEffect(() => {
    if (uid) {
      dispatch({ type: ActionTypes.FETCH_USER, payload: { uid } });
    }
    return () => {
      dispatch({ type: ActionTypes.RESET_USER });
    };
  }, [dispatch, uid]);
  return (
    <>
      <Navbar color="light" light>
        <Button tag={Link} to="/">
          <FontAwesomeIcon icon={faArrowCircleLeft} /> Go back
        </Button>
        <SignInForm />
        <UpdateButton />
      </Navbar>
      {user ? (
        <>
          <PersonalInfo userInfo={user} />
          <br />
          <PersonalTasks userInfo={user} />
          <br />
          <PersonalChart userInfo={user} />
        </>
      ) : (
        <Alert color="danger">This user does not exist.</Alert>
      )}
    </>
  );
};
