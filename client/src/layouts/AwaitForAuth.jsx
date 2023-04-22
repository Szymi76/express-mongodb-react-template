import styled from "styled-components";
import { useAuth } from "../app/store/useAuth";
import { Oval } from "react-loader-spinner";

/**
 *
 * Jak ma wyglądać strona, jeśli nie wiadomo czy użytkownik (nie) jest zalogowany
 */
export const AwaitForAuth = ({ children }) => {
  const { isLoading } = useAuth();

  if (isLoading) return <LoadingPage />;

  return children;
};

const LoadingPage = () => {
  return (
    <Wrapper>
      <Oval color="#2563eb" secondaryColor="#2563eb" />
    </Wrapper>
  );
};

const Wrapper = styled.div(({ theme }) => ({
  height: "100vh",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  paddingTop: "5rem",
}));
