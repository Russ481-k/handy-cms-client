import { css } from "@emotion/react";

export const getScrollbarStyle = (isDark: boolean) => css`
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
    border-radius: 3px;
    transition: background-color 0.2s;

    &:hover {
      background-color: ${isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'};
    }
  }

  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: ${isDark ? 'rgba(255, 255, 255, 0.2) transparent' : 'rgba(0, 0, 0, 0.2) transparent'};
`;

// 기존 스타일 유지 (하위 호환성)
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
