import { NextResponse } from "next/server";

// 임시 게시판 데이터
const boards = [
  {
    id: 1,
    name: "공지사항",
    slug: "notice",
    type: "NOTICE",
    useCategory: false,
    allowComment: true,
    useAttachment: true,
    postsPerPage: 20,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "자유게시판",
    slug: "free",
    type: "FREE",
    useCategory: true,
    allowComment: true,
    useAttachment: true,
    postsPerPage: 20,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: 3,
    name: "갤러리",
    slug: "gallery",
    type: "GALLERY",
    useCategory: true,
    allowComment: true,
    useAttachment: true,
    postsPerPage: 12,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: 4,
    name: "FAQ",
    slug: "faq",
    type: "FAQ",
    useCategory: true,
    allowComment: false,
    useAttachment: false,
    postsPerPage: 20,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
];

export async function GET() {
  // 실제 구현에서는 데이터베이스에서 게시판 데이터를 가져옵니다.
  return NextResponse.json(boards);
}
