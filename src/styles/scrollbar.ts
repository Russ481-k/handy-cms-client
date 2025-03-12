import { css } from "@emotion/react";

export const scrollbarStyle = css`
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: rgba(155, 155, 155, 0.5);
    border-radius: 3px;
    transition: background-color 0.2s;

    &:hover {
      background-color: rgba(155, 155, 155, 0.7);
    }
  }

  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: rgba(155, 155, 155, 0.5) transparent;
`;
