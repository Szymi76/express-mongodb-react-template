import styled from "styled-components";

/**
 *
 * To jakie ma wyglądać wrapper na każdej stronie.
 * Czyli np. każda strona będzie mieć tło niebieskie, itd.
 */

export const PrimaryLayout = ({ children }) => {
  return <Wrapper>{children}</Wrapper>;
};

const Wrapper = styled.div(({ theme }) => ({
  height: "100vh",
  width: "100%",
  overflowY: "auto",
  backgroundColor: theme.gray["50"],
}));
