import { useMutation, useQuery } from "@tanstack/react-query";
import { router } from "../app/api/rootRouter";
import { useAuth } from "../app/store/useAuth";
import { Oval } from "react-loader-spinner";
import { useState } from "react";
import { useCountdown } from "../hooks/useCountdown";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <Wrapper>
      {currentUser ? (
        <>
          <UserDetails />
          <GetUserById />
        </>
      ) : (
        <>
          <LoginForm />
          <RegisterForm />
        </>
      )}
    </Wrapper>
  );
};

export default Home;

const LoginForm = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const {
    mutateAsync: login,
    isLoading,
    isError,
  } = useMutation({
    mutationFn: ({ email, password }) => router.auth.login(email, password),
  });

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const { email, password } = data;
      await login({ email, password });
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Title>Zaloguj się</Title>
      {isError && <ErrorText>{error}</ErrorText>}
      <Label>Adres email</Label>
      <TextInput
        type="email"
        required
        value={data.email}
        placeholder="np. michałszymczas12@gmail.com"
        onChange={(e) => setData({ ...data, email: e.target.value })}
      />
      <Label>Hasło</Label>
      <TextInput
        type="password"
        required
        value={data.password}
        onChange={(e) => setData({ ...data, password: e.target.value })}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading && <SmallLoading />}
        Dalej
      </Button>
    </Form>
  );
};

const RegisterForm = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    passwordRepeat: "",
  });
  const [error, setError] = useState("");
  const {
    mutateAsync: register,
    isLoading,
    isError,
  } = useMutation({
    mutationFn: ({ name, email, password }) =>
      router.auth.register(name, email, password),
  });

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const { name, email, password, passwordRepeat } = data;
      if (password != passwordRepeat) return;
      await register({ name, email, password });
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Title>Stwórz konto</Title>
      {isError && <ErrorText>{error}</ErrorText>}
      <Label>Twoja nazwa</Label>
      <TextInput
        type="text"
        required
        value={data.name}
        placeholder="np. michu22"
        onChange={(e) => setData({ ...data, name: e.target.value })}
      />
      <Label>Adres email</Label>
      <TextInput
        type="email"
        required
        value={data.email}
        placeholder="np. michałszymczas12@gmail.com"
        onChange={(e) => setData({ ...data, email: e.target.value })}
      />
      <Label>Hasło</Label>
      <TextInput
        type="password"
        required
        value={data.password}
        onChange={(e) => setData({ ...data, password: e.target.value })}
      />
      <Label>Powtórz hasło</Label>
      <TextInput
        type="password"
        required
        value={data.pa}
        onChange={(e) => setData({ ...data, passwordRepeat: e.target.value })}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading && <SmallLoading />}
        Dalej
      </Button>
    </Form>
  );
};

const UserDetails = () => {
  const { currentUser, logout } = useAuth();

  const expires_at = +localStorage.getItem("expires_at") ?? "";
  const nowInSeconds = +(new Date().getTime() / 1000).toFixed();
  const countdown = useCountdown(expires_at - nowInSeconds);

  return (
    <Form>
      <PrimaryText>{currentUser.name}</PrimaryText>
      <SecondaryText>{currentUser.email}</SecondaryText>
      <Button onClick={logout}>Wyloguj się</Button>
      <Link to="/tylko-dla-zalogowanych">Tylko dla zalogowanych</Link>
      {countdown > 0 ? (
        <Label>Access token wygaśnie za: {countdown}s</Label>
      ) : (
        <Label>Access token wygasł!</Label>
      )}
    </Form>
  );
};

const GetUserById = () => {
  const [someUserId, setSomeUserId] = useState();

  const {
    data: someUser,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["get-user-by-id"],
    queryFn: () => router.user.getUserById(someUserId),
  });

  return (
    <Form>
      <Label>Wyszukaj użytkownika po jego id</Label>
      <TextInput
        type="text"
        value={someUserId}
        onChange={(e) => setSomeUserId(e.target.value)}
        placeholder="np. 644179e541de4d678f6a65a2"
      />
      <Button type="button" onClick={refetch}>
        Szukaj
      </Button>
      {isLoading && <SmallLoading />}
      {isError && someUser && (
        <ErrorText>Brak użytkownika o takim id</ErrorText>
      )}
      {someUser && !isError && (
        <>
          <PrimaryText style={{ marginTop: "2rem" }}>
            {someUser.name}
          </PrimaryText>
          <SecondaryText>{someUser.email}</SecondaryText>
        </>
      )}
    </Form>
  );
};

const SmallLoading = () => {
  return <Oval color="white" secondaryColor="white" height={14} width={14} />;
};

const Wrapper = styled.main(({ theme }) => ({
  height: "100%",
  // width: "100%",
  display: "flex",
  flexWrap: "wrap",
  gap: "30px",
  justifyContent: "center",
  alignItems: "start",
  paddingTop: "8.5rem",
  // backgroundColor: theme.gray["50"],
}));

const Form = styled.form(({ theme }) => ({
  backgroundColor: theme.secondary,
  width: "95%",
  maxWidth: "450px",
  border: `1px solid ${theme.gray["200"]}`,
  borderRadius: theme.rounded.md,
  padding: theme.padding.lg,
  display: "flex",
  flexDirection: "column",
}));

const Button = styled.button(({ theme }) => ({
  padding: theme.padding.md,
  backgroundColor: theme.main,
  color: theme.secondary,
  border: "none",
  borderRadius: theme.rounded.md,
  transitionDuration: "125ms",
  cursor: "pointer",
  marginTop: "1rem",
  display: "flex",
  justifyContent: "center",
  gap: ".75rem",
  ":hover": {
    scale: "97%",
  },
  ":active": {
    scale: "92%",
  },
}));

const PrimaryText = styled.h3(({ theme }) => ({
  fontSize: "1.5em",
  fontWeight: 500,
}));

const SecondaryText = styled.h3(({ theme }) => ({
  fontSize: ".95em",
  color: theme.gray["500"],
  fontWeight: 400,
}));

const Label = styled.label(({ theme }) => ({
  color: theme.gray["500"],
  fontSize: ".8em",
  textTransform: "uppercase",
  marginBottom: ".25rem",
  marginTop: "1rem",
}));

const TextInput = styled.input(({ theme }) => ({
  border: `1px solid ${theme.gray["200"]}`,
  borderRadius: theme.rounded.md,
  padding: theme.padding.md,
  outline: "none",
  transitionDuration: "100ms",
  ":focus": {
    borderColor: theme.main,
  },
}));

const Title = styled.h1(({ theme }) => ({
  fontSize: "2em",
  fontWeight: "bold",
  marginBottom: "2rem",
}));

const ErrorText = styled.h5(({ theme }) => ({
  fontSize: ".8em",
  color: theme.text.error,
  marginTop: "1rem",
}));
